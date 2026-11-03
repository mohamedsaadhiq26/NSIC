import express from 'express';
import prisma from '../prismaClient.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/claims
 * Submit an official student claim request
 * Strictly restricted to STUDENT authorization
 * Body: { itemId, studentName, registrationNumber, department }
 */
router.post('/', authenticateToken, requireRole('STUDENT'), async (req, res) => {
  try {
    const { itemId, studentName, registrationNumber, department } = req.body;
    const claimerId = req.user.id;

    if (!itemId || !studentName?.trim() || !registrationNumber?.trim() || !department?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Item ID, Full Name, Registration Number, and Department are all required',
      });
    }

    const item = await prisma.foundItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.status === 'resolved') {
      return res.status(400).json({
        success: false,
        message: 'This item has already been resolved and returned to its owner',
      });
    }

    // Check for existing pending claim by this student on this item
    const existingClaim = await prisma.claim.findFirst({
      where: {
        itemId,
        claimerId,
        status: 'pending',
      },
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active pending claim for this item.',
      });
    }

    // Record the official claim in SQLite
    const newClaim = await prisma.claim.create({
      data: {
        itemId,
        claimerId,
        studentName: studentName.trim(),
        registrationNumber: registrationNumber.trim(),
        department: department.trim(),
        status: 'pending',
      },
      include: {
        claimer: { select: { id: true, name: true, email: true, role: true } },
        item: { select: { id: true, title: true, category: true, location: true, status: true } },
      },
    });

    // Update item status to 'pending'
    await prisma.foundItem.update({
      where: { id: itemId },
      data: { status: 'pending' },
    });

    res.status(201).json({
      success: true,
      message: 'Official claim request submitted! Status updated to Pending for Admin review.',
      claim: newClaim,
    });
  } catch (error) {
    console.error('Error submitting claim:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit claim',
    });
  }
});

/**
 * PUT /api/claims/:id
 * Approve or Reject a claim
 * Strictly restricted to ADMIN authorization
 * Body: { status: 'approved' | 'rejected' }
 */
router.put('/:id', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'approved' or 'rejected'",
      });
    }

    const existingClaim = await prisma.claim.findUnique({
      where: { id },
      include: { item: true },
    });

    if (!existingClaim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    // Update the claim status
    const updatedClaim = await prisma.claim.update({
      where: { id },
      data: {
        status,
        adminOverridden: true,
      },
      include: {
        claimer: { select: { id: true, name: true, email: true } },
        item: true,
      },
    });

    if (status === 'approved') {
      // Mark item as resolved
      await prisma.foundItem.update({
        where: { id: existingClaim.itemId },
        data: { status: 'resolved' },
      });
    } else if (status === 'rejected') {
      // Check if any other pending claims remain for this item
      const remainingPendingClaims = await prisma.claim.count({
        where: {
          itemId: existingClaim.itemId,
          status: 'pending',
          id: { not: id },
        },
      });

      // If no other pending claims, revert item status back to 'available'
      if (remainingPendingClaims === 0) {
        await prisma.foundItem.update({
          where: { id: existingClaim.itemId },
          data: { status: 'available' },
        });
      }
    }

    res.json({
      success: true,
      message: `Claim successfully ${status} by administrator.`,
      claim: updatedClaim,
    });
  } catch (error) {
    console.error('Error updating claim status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update claim status',
    });
  }
});

/**
 * GET /api/claims
 * Fetch all claims or filter by itemId
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.query;
    const where = itemId ? { itemId } : {};

    // If student, can only see their own claims unless filtering by item
    if (req.user.role === 'STUDENT') {
      where.claimerId = req.user.id;
    }

    const claims = await prisma.claim.findMany({
      where,
      include: {
        claimer: { select: { id: true, name: true, email: true } },
        item: { select: { id: true, title: true, category: true, location: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: claims.length, claims });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve claims', error: error.message });
  }
});

export default router;
