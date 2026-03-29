const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/words/:word — all movies tagged with this word, sorted by vote count
router.get('/:word', async (req, res) => {
  const word = req.params.word.toLowerCase().replace(/[^a-z]/g, '');
  if (!word) return res.status(400).json({ error: 'Invalid word' });

  try {
    // Group wunwurds by movie, count votes for this word per movie
    const grouped = await prisma.wunwurd.groupBy({
      by: ['movieId'],
      where: { word },
      _count: { word: true },
      orderBy: { _count: { word: 'desc' } },
    });

    if (grouped.length === 0) return res.json([]);

    const movieIds = grouped.map((g) => g.movieId);
    const movies = await prisma.movie.findMany({
      where: { id: { in: movieIds } },
    });

    const movieMap = Object.fromEntries(movies.map((m) => [m.id, m]));

    const result = grouped
      .map((g) => ({ ...movieMap[g.movieId], votes: g._count.word }))
      .filter((m) => m.tmdbId); // skip any orphaned records

    res.json(result);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch movies for word' });
  }
});

module.exports = router;
