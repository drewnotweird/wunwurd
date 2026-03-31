const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get user's personal symbol library, sorted by most used
router.get('/', authRequired, async (req, res) => {
  const symbols = await prisma.userSymbol.findMany({
    where: { userId: req.user.userId },
    orderBy: { useCount: 'desc' },
  });
  res.json(symbols);
});

// Save a new symbol to library
router.post('/', authRequired, async (req, res) => {
  const { label, mulberryId, imageUrl, bgColor, emoji } = req.body;
  const symbol = await prisma.userSymbol.create({
    data: { userId: req.user.userId, label, mulberryId, imageUrl, bgColor, emoji },
  });
  res.json(symbol);
});

// Update a symbol (e.g. relabel)
router.put('/:id', authRequired, async (req, res) => {
  const { label, mulberryId, imageUrl, bgColor, emoji } = req.body;
  const symbol = await prisma.userSymbol.findUnique({ where: { id: Number(req.params.id) } });
  if (!symbol || symbol.userId !== req.user.userId) return res.status(404).json({ error: 'Not found' });
  const updated = await prisma.userSymbol.update({
    where: { id: symbol.id },
    data: { label, mulberryId, imageUrl, bgColor, emoji },
  });
  res.json(updated);
});

// Increment use count when a symbol is added to a board
router.post('/:id/use', authRequired, async (req, res) => {
  const symbol = await prisma.userSymbol.findUnique({ where: { id: Number(req.params.id) } });
  if (!symbol || symbol.userId !== req.user.userId) return res.status(404).json({ error: 'Not found' });
  const updated = await prisma.userSymbol.update({
    where: { id: symbol.id },
    data: { useCount: { increment: 1 } },
  });
  res.json(updated);
});

// Delete a symbol
router.delete('/:id', authRequired, async (req, res) => {
  const symbol = await prisma.userSymbol.findUnique({ where: { id: Number(req.params.id) } });
  if (!symbol || symbol.userId !== req.user.userId) return res.status(404).json({ error: 'Not found' });
  await prisma.userSymbol.delete({ where: { id: symbol.id } });
  res.json({ ok: true });
});

module.exports = router;
