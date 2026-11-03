import express from 'express';
import prisma from '../prismaClient.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Require ADMIN role for all routes in this file
router.use(authenticateToken, requireRole('ADMIN'));

/**
 * GET /api/admin/stats
 * Overview dashboard metrics
 */
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalItems, activeItems, flaggedItems, totalClaims, pendingClaims] = await Promise.all([
      prisma.user.count(),
      prisma.foundItem.count(),
      prisma.foundItem.count({ where: { status: 'available' } }),
      prisma.foundItem.count({ where: { isFlagged: true } }),
      prisma.claim.count(),
      prisma.claim.count({ where: { status: 'pending' } }),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalItems,
        activeItems,
        flaggedItems,
        totalClaims,
        pendingClaims,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin stats' });
  }
});

/**
 * GET /api/admin/users
 * View all registered users with role and stats
 */
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        studentId: true,
        department: true,
        createdAt: true,
        _count: {
          select: {
            foundItems: true,
            claims: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

/**
 * PATCH /api/admin/users/:id/role
 * Change a user's role (STUDENT or ADMIN)
 */
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['STUDENT', 'ADMIN'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Must be STUDENT or ADMIN.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    res.json({ success: true, message: `User role updated to ${role}`, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user role' });
  }
});

/**
 * GET /api/admin/items
 * View all lost/found items regardless of status
 */
router.get('/items', async (req, res) => {
  try {
    const items = await prisma.foundItem.findMany({
      include: {
        finder: {
          select: { id: true, name: true, email: true, role: true },
        },
        claims: {
          include: {
            claimer: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin items' });
  }
});

/**
 * DELETE /api/admin/items/:id
 * Delete post from repository
 */
router.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const item = await prisma.foundItem.findUnique({ where: { id } });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    await prisma.foundItem.delete({ where: { id } });

    res.json({ success: true, message: `Item "${item.title}" successfully deleted by administrator.` });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ success: false, message: 'Failed to delete item' });
  }
});

/**
 * PATCH /api/admin/items/:id/flag
 * Toggle spam flag on an item
 */
router.patch('/items/:id/flag', async (req, res) => {
  try {
    const { isFlagged } = req.body;
    const item = await prisma.foundItem.update({
      where: { id: req.params.id },
      data: { isFlagged: Boolean(isFlagged) },
    });
    res.json({ success: true, message: `Item flag status updated`, item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to flag item' });
  }
});

export default router;
