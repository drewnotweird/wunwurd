// Run: node migrate.js
// Copies all data from Railway PostgreSQL → Neon PostgreSQL

const { Client } = require('pg');

const SOURCE = 'postgresql://postgres:ogoIQCDQiQjGchizZGfDgfkTkwcnZJlB@gondola.proxy.rlwy.net:14545/railway';
const TARGET = process.env.NEON_URL;

if (!TARGET) {
  console.error('Set NEON_URL environment variable first');
  process.exit(1);
}

async function migrate() {
  const src = new Client({ connectionString: SOURCE, ssl: false });
  const tgt = new Client({ connectionString: TARGET, ssl: { rejectUnauthorized: false } });

  await src.connect();
  await tgt.connect();
  console.log('Connected to both databases');

  // Clear target tables (order matters due to foreign keys)
  await tgt.query('TRUNCATE "Wunwurd", "Movie", "User" RESTART IDENTITY CASCADE');
  console.log('Cleared target tables');

  // Users
  const users = await src.query('SELECT * FROM "User" ORDER BY id');
  console.log(`Migrating ${users.rows.length} users...`);
  for (const u of users.rows) {
    await tgt.query(
      `INSERT INTO "User" (id, username, email, "passwordHash", "createdAt")
       VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING`,
      [u.id, u.username, u.email, u.passwordHash, u.createdAt]
    );
  }

  // Movies
  const movies = await src.query('SELECT * FROM "Movie" ORDER BY id');
  console.log(`Migrating ${movies.rows.length} movies...`);
  for (const m of movies.rows) {
    await tgt.query(
      `INSERT INTO "Movie" (id, "tmdbId", title, year, "posterPath", "backdropPath", "cachedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING`,
      [m.id, m.tmdbId, m.title, m.year, m.posterPath, m.backdropPath, m.cachedAt]
    );
  }

  // Wunwurds
  const wunwurds = await src.query('SELECT * FROM "Wunwurd" ORDER BY id');
  console.log(`Migrating ${wunwurds.rows.length} wunwurds...`);
  for (const w of wunwurds.rows) {
    await tgt.query(
      `INSERT INTO "Wunwurd" (id, "userId", "movieId", word, "submittedAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING`,
      [w.id, w.userId, w.movieId, w.word, w.submittedAt, w.updatedAt]
    );
  }

  // Reset sequences so new rows don't conflict
  await tgt.query(`SELECT setval('"User_id_seq"', (SELECT MAX(id) FROM "User"))`);
  await tgt.query(`SELECT setval('"Movie_id_seq"', (SELECT MAX(id) FROM "Movie"))`);
  await tgt.query(`SELECT setval('"Wunwurd_id_seq"', (SELECT MAX(id) FROM "Wunwurd"))`);

  console.log('Migration complete.');
  await src.end();
  await tgt.end();
}

migrate().catch(err => { console.error(err); process.exit(1); });
