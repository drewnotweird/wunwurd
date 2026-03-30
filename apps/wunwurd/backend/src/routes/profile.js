const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/profile
router.get('/', authRequired, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        wunwurds: {
          include: { movie: true },
          orderBy: { updatedAt: 'desc' },
        },
      },
    });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;
