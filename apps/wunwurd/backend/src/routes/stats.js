const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

const NO_BOTS = { user: { email: { not: { endsWith: '@wunwurd.app' } } } };
const NOT_BOT = { email: { not: { endsWith: '@wunwurd.app' } } };

function checkKey(req, res, next) {
  const key = req.query.key || req.headers['x-stats-key'];
  if (key !== 'verisimilitude') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

router.get('/', checkKey, async (req, res) => {
  try {
    const [
      totalUsers,
      totalWunwurds,
      lastWunwurd,
      topWords,
      topMovieGroups,
      activeUserCount,
      users,
      moviesTotal,
      moviesWithWunwurds,
    ] = await Promise.all([
      prisma.user.count({ where: NOT_BOT }),
      prisma.wunwurd.count({ where: NO_BOTS }),
      prisma.wunwurd.findFirst({
        where: NO_BOTS,
        orderBy: { submittedAt: 'desc' },
        include: {
          user: { select: { username: true } },
          movie: { select: { title: true, tmdbId: true } },
        },
      }),
      prisma.wunwurd.groupBy({
        by: ['word'],
        where: NO_BOTS,
        _count: { word: true },
        orderBy: { _count: { word: 'desc' } },
        take: 15,
      }),
      prisma.wunwurd.groupBy({
        by: ['movieId'],
        where: NO_BOTS,
        _count: { movieId: true },
        orderBy: { _count: { movieId: 'desc' } },
        take: 5,
      }),
      prisma.user.count({ where: { ...NOT_BOT, wunwurds: { some: NO_BOTS } } }),
      prisma.user.findMany({
        where: NOT_BOT,
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          _count: { select: { wunwurds: true } },
        },
        orderBy: { wunwurds: { _count: 'desc' } },
      }),
      prisma.movie.count(),
      prisma.movie.count({ where: { wunwurds: { some: NO_BOTS } } }),
    ]);

    const distinctWordCount = await prisma.wunwurd
      .findMany({ where: NO_BOTS, select: { word: true }, distinct: ['word'] })
      .then((r) => r.length);

    const movieIds = topMovieGroups.map((g) => g.movieId);
    const movies = await prisma.movie.findMany({ where: { id: { in: movieIds } } });
    const movieMap = Object.fromEntries(movies.map((m) => [m.id, m]));
    const topMovies = topMovieGroups.map((g) => ({
      title: movieMap[g.movieId]?.title || '?',
      tmdbId: movieMap[g.movieId]?.tmdbId,
      wunwurdCount: g._count.movieId,
    }));

    res.json({
      users: {
        total: totalUsers,
        active: activeUserCount,
        list: users.map((u) => ({
          id: u.id,
          username: u.username,
          email: u.email,
          joinedAt: u.createdAt,
          wunwurdCount: u._count.wunwurds,
        })),
      },
      wunwurds: {
        total: totalWunwurds,
        distinctWords: distinctWordCount,
        last: lastWunwurd
          ? {
              word: lastWunwurd.word,
              movie: lastWunwurd.movie.title,
              tmdbId: lastWunwurd.movie.tmdbId,
              by: lastWunwurd.user.username,
              at: lastWunwurd.submittedAt,
            }
          : null,
        topWords: topWords.map((w) => ({ word: w.word, count: w._count.word })),
      },
      movies: {
        total: moviesTotal,
        withWunwurds: moviesWithWunwurds,
        top: topMovies,
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
