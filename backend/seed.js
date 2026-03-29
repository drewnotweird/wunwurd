const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const prisma = new PrismaClient();
const API_KEY = process.env.TMDB_API_KEY;

// ─── Genre word banks ─────────────────────────────────────────────────────────
// All single words, letters only, max 30 chars
const GENRE_WORDS = {
  28:    ['epic', 'intense', 'explosive', 'thrilling', 'brutal', 'kinetic', 'relentless', 'powerful', 'stunning', 'visceral', 'electrifying', 'fierce', 'raw', 'unstoppable', 'ferocious', 'savage', 'propulsive', 'breathless', 'muscular', 'punishing'],
  12:    ['epic', 'exciting', 'thrilling', 'spectacular', 'grand', 'sweeping', 'breathtaking', 'daring', 'rousing', 'exhilarating', 'wondrous', 'bold', 'adventurous', 'majestic', 'extraordinary', 'soaring', 'mythic', 'boundless', 'rapturous', 'stirring'],
  16:    ['magical', 'charming', 'beautiful', 'heartwarming', 'colorful', 'joyful', 'imaginative', 'wonderful', 'enchanting', 'delightful', 'whimsical', 'vibrant', 'lovely', 'radiant', 'playful', 'luminous', 'sweet', 'expressive', 'lush', 'inventive'],
  35:    ['hilarious', 'funny', 'witty', 'charming', 'delightful', 'clever', 'lighthearted', 'breezy', 'absurd', 'silly', 'warm', 'playful', 'fresh', 'joyful', 'sharp', 'snappy', 'irreverent', 'zany', 'infectious', 'spirited'],
  80:    ['gritty', 'dark', 'stylish', 'slick', 'sharp', 'tense', 'moody', 'brooding', 'atmospheric', 'clever', 'raw', 'intense', 'compelling', 'seedy', 'dangerous', 'sinister', 'murky', 'menacing', 'hardboiled', 'ruthless'],
  99:    ['revealing', 'fascinating', 'powerful', 'compelling', 'insightful', 'moving', 'important', 'honest', 'gripping', 'shocking', 'essential', 'urgent', 'intimate', 'sobering', 'illuminating', 'unflinching', 'damning', 'vital', 'searching', 'courageous'],
  18:    ['emotional', 'moving', 'powerful', 'haunting', 'gripping', 'raw', 'beautiful', 'heartfelt', 'profound', 'touching', 'intense', 'honest', 'deep', 'stirring', 'searing', 'devastating', 'absorbing', 'layered', 'aching', 'resonant'],
  10751: ['wholesome', 'heartwarming', 'charming', 'sweet', 'magical', 'delightful', 'joyful', 'warm', 'lovely', 'cheerful', 'uplifting', 'cozy', 'enchanting', 'bright', 'endearing', 'nurturing', 'sunny', 'gentle', 'cuddly', 'comforting'],
  14:    ['magical', 'wondrous', 'enchanting', 'epic', 'imaginative', 'beautiful', 'mystical', 'dreamlike', 'spectacular', 'majestic', 'mythical', 'extraordinary', 'breathtaking', 'otherworldly', 'transcendent', 'spellbinding', 'ethereal', 'dazzling', 'fantastical', 'luminous'],
  36:    ['majestic', 'sweeping', 'powerful', 'grand', 'epic', 'moving', 'important', 'stirring', 'beautiful', 'compelling', 'dramatic', 'inspiring', 'monumental', 'dignified', 'weighty', 'authoritative', 'immersive', 'reverent', 'formidable', 'consequential'],
  27:    ['terrifying', 'creepy', 'disturbing', 'unsettling', 'chilling', 'scary', 'dark', 'sinister', 'haunting', 'nightmarish', 'tense', 'bleak', 'twisted', 'dreadful', 'oppressive', 'harrowing', 'unnerving', 'grotesque', 'suffocating', 'relentless'],
  10402: ['soulful', 'uplifting', 'vibrant', 'passionate', 'moving', 'electric', 'beautiful', 'energetic', 'joyful', 'inspiring', 'rhythmic', 'emotional', 'powerful', 'infectious', 'alive', 'transcendent', 'exhilarating', 'magnetic', 'rapturous', 'soaring'],
  9648:  ['intriguing', 'clever', 'atmospheric', 'moody', 'suspenseful', 'dark', 'twisty', 'enigmatic', 'layered', 'gripping', 'mysterious', 'compelling', 'cerebral', 'puzzling', 'eerie', 'labyrinthine', 'ambiguous', 'shadowy', 'obsessive', 'hypnotic'],
  10749: ['sweet', 'heartwarming', 'tender', 'lovely', 'beautiful', 'touching', 'emotional', 'dreamy', 'charming', 'moving', 'gentle', 'warm', 'bittersweet', 'swoony', 'intoxicating', 'aching', 'rapturous', 'longing', 'euphoric', 'irresistible'],
  878:   ['visionary', 'cerebral', 'futuristic', 'imaginative', 'stunning', 'ambitious', 'cosmic', 'trippy', 'brilliant', 'epic', 'innovative', 'expansive', 'challenging', 'philosophical', 'otherworldly', 'bold', 'prophetic', 'dazzling', 'mind-expanding', 'strange'],
  53:    ['tense', 'gripping', 'suspenseful', 'dark', 'twisty', 'clever', 'intense', 'brooding', 'chilling', 'riveting', 'mysterious', 'sharp', 'edgy', 'claustrophobic', 'relentless', 'paranoid', 'menacing', 'electric', 'propulsive', 'unsettling'],
  10752: ['brutal', 'harrowing', 'powerful', 'devastating', 'intense', 'raw', 'gritty', 'heroic', 'tragic', 'gripping', 'emotional', 'dark', 'sobering', 'visceral', 'unforgettable', 'shattering', 'uncompromising', 'immersive', 'human', 'staggering'],
  37:    ['rugged', 'atmospheric', 'gritty', 'cool', 'stylish', 'classic', 'brooding', 'tense', 'moody', 'epic', 'raw', 'authentic', 'iconic', 'dusty', 'elemental', 'austere', 'mythic', 'stark', 'lonesome', 'weathered'],
};

const DEFAULT_WORDS = ['compelling', 'entertaining', 'engaging', 'solid', 'enjoyable', 'watchable', 'good', 'great', 'stunning', 'impressive', 'memorable', 'interesting', 'satisfying', 'polished', 'effective', 'accomplished', 'assured', 'confident', 'slick', 'smart'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getWordPool(movie) {
  let pool = [];
  for (const id of (movie.genre_ids || [])) {
    if (GENRE_WORDS[id]) pool.push(...GENRE_WORDS[id]);
  }
  if (pool.length < 10) pool.push(...DEFAULT_WORDS);
  // sanitise — strip anything non-alpha (handles the one edge case above)
  pool = pool.map(w => w.replace(/[^a-z]/gi, '').toLowerCase()).filter(Boolean);
  return shuffle([...new Set(pool)]);
}

function buildPlan(wordPool) {
  // Vary the top-word count slightly so movies feel different
  const topCount = 5 + Math.floor(Math.random() * 4); // 5–8
  const plan = [
    { word: wordPool[0],  count: topCount },
    { word: wordPool[1],  count: 3 + Math.floor(Math.random() * 2) }, // 3–4
    { word: wordPool[2],  count: 2 + Math.floor(Math.random() * 2) }, // 2–3
    { word: wordPool[3],  count: 2 },
    { word: wordPool[4],  count: 1 },
    { word: wordPool[5],  count: 1 },
    { word: wordPool[6],  count: 1 },
    { word: wordPool[7],  count: 1 },
    { word: wordPool[8],  count: 1 },
    { word: wordPool[9],  count: 1 },
    { word: wordPool[10], count: 1 },
  ].filter(p => p.word);
  return plan;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🎬  WUNWURD seed script starting…\n');

  // 1. Create 40 fake users
  console.log('Creating seed users…');
  const passwordHash = await bcrypt.hash('seedpassword!', 10);
  const users = [];
  const usernames = [
    'cinephile', 'reelcritic', 'filmfanatic', 'moviejunkie', 'screentime',
    'popcornpal', 'couchcritic', 'filmgeek', 'reelhead', 'directorcut',
    'cineaste', 'framebyframe', 'letterboxd', 'silentfilm', 'dolbydave',
    'projectorman', 'lensflare', 'steadicam', 'dollyshot', 'tracklist',
    'dissolve', 'jumpcut', 'montage', 'voiceover', 'closeup',
    'wideshot', 'blueray', 'criterion', 'arthouse', 'multiplex',
    'matinee', 'midnight', 'preview', 'credits', 'endscene',
    'graincheck', 'aspectratio', 'softfocus', 'deepfield', 'twoshot',
  ];

  for (let i = 0; i < 40; i++) {
    const user = await prisma.user.upsert({
      where: { email: `seed${i + 1}@wunwurd.app` },
      create: {
        username: `${usernames[i] || 'user'}${i + 1}`,
        email: `seed${i + 1}@wunwurd.app`,
        passwordHash,
      },
      update: {},
    });
    users.push(user);
  }
  console.log(`✓ ${users.length} seed users ready\n`);

  // 2. Fetch 100 popular movies (5 pages × 20)
  console.log('Fetching 100 popular movies from TMDB…');
  const movies = [];
  for (let page = 1; page <= 5; page++) {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    const data = await res.json();
    if (data.results) movies.push(...data.results);
    await new Promise(r => setTimeout(r, 300)); // be polite to TMDB
  }
  console.log(`✓ Fetched ${movies.length} movies\n`);

  // 3. Seed wunwurds for each movie
  console.log('Seeding wunwurds…\n');
  let totalWunwurds = 0;

  for (const tmdbMovie of movies) {
    const year = tmdbMovie.release_date
      ? parseInt(tmdbMovie.release_date.slice(0, 4))
      : null;

    // Cache movie
    const movie = await prisma.movie.upsert({
      where: { tmdbId: tmdbMovie.id },
      create: {
        tmdbId: tmdbMovie.id,
        title: tmdbMovie.title,
        year,
        posterPath: tmdbMovie.poster_path || null,
        backdropPath: tmdbMovie.backdrop_path || null,
      },
      update: {
        title: tmdbMovie.title,
        year,
        posterPath: tmdbMovie.poster_path || null,
        backdropPath: tmdbMovie.backdrop_path || null,
        cachedAt: new Date(),
      },
    });

    // Build word plan
    const wordPool = getWordPool(tmdbMovie);
    const plan = buildPlan(wordPool);
    const shuffledUsers = shuffle(users);

    let userIndex = 0;
    let movieWunwurds = 0;

    for (const { word, count } of plan) {
      for (let i = 0; i < count; i++) {
        if (userIndex >= shuffledUsers.length) break;
        await prisma.wunwurd.upsert({
          where: {
            userId_movieId: {
              userId: shuffledUsers[userIndex].id,
              movieId: movie.id,
            },
          },
          create: {
            userId: shuffledUsers[userIndex].id,
            movieId: movie.id,
            word,
          },
          update: { word },
        });
        userIndex++;
        movieWunwurds++;
      }
    }

    totalWunwurds += movieWunwurds;
    const topWord = plan[0]?.word?.toUpperCase();
    console.log(`  ✓  ${movie.title.padEnd(40)} → ${movieWunwurds} votes  (top: ${topWord})`);
  }

  console.log(`\n🎉  Done! Seeded ${totalWunwurds} wunwurds across ${movies.length} movies.\n`);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
