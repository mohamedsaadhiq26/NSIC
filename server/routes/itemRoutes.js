import express from 'express';
import prisma from '../prismaClient.js';
import { upload } from '../middleware/upload.js';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/items
 * Fetch items (available & pending)
 * Supports optional ?category=... and ?search=... filters
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, search, status } = req.query;

    const where = {
      isFlagged: false,
    };

    if (status) {
      where.status = status;
    } else {
      // By default show available and pending items in the campus feed
      where.status = { in: ['available', 'pending'] };
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    if (search && search.trim() !== '') {
      where.OR = [
        { title: { contains: search.trim() } },
        { location: { contains: search.trim() } },
      ];
    }

    const items = await prisma.foundItem.findMany({
      where,
      include: {
        finder: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        claims: {
          select: {
            id: true,
            status: true,
            claimerId: true,
            studentName: true,
            registrationNumber: true,
            department: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ success: false, message: 'Server error fetching items', error: error.message });
  }
});

/**
 * GET /api/items/:id
 * Fetch single item by ID
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const item = await prisma.foundItem.findUnique({
      where: { id: req.params.id },
      include: {
        finder: {
          select: { id: true, name: true, email: true, role: true },
        },
        claims: true,
      },
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching item details', error: error.message });
  }
});

/**
 * POST /api/items
 * Upload a new found item with multipart/form-data
 * Strictly restricted to ADMIN authorization
 */
router.post('/', authenticateToken, requireRole('ADMIN'), upload.single('image'), async (req, res) => {
  try {
    const { title, category, location } = req.body;
    const finderId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Item photograph is required' });
    }

    if (!title || !category || !location) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and location are required',
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const newItem = await prisma.foundItem.create({
      data: {
        title: title.trim(),
        category,
        location: location.trim(),
        imageUrl,
        status: 'available',
        finderId,
      },
      include: {
        finder: {
          select: { id: true, name: true, email: true, role: true },
        },
        claims: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Found item logged successfully by Administrator!',
      item: newItem,
    });
  } catch (error) {
    console.error('Error creating found item:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to post item',
    });
  }
});

/**
 * DELETE /api/items/:id
 * Remove an item from the database
 * Strictly restricted to ADMIN authorization
 */
router.delete('/:id', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    const item = await prisma.foundItem.findUnique({ where: { id } });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in repository' });
    }

    await prisma.foundItem.delete({ where: { id } });

    res.json({
      success: true,
      message: `Item "${item.title}" successfully deleted by administrator.`,
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ success: false, message: 'Failed to delete item', error: error.message });
  }
});

export default router;
