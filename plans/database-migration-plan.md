# Database Migration Plan: Railway → Permanent Free Solution

**Status:** Plan created April 1, 2026  
**Current Setup:** 2 PostgreSQL databases on Railway (`wunwurd`, `nowandnext`)  
**Goal:** Migrate to a permanently free, zero-migration-required solution

---

## Current Databases

### `wunwurd` (Movie guessing game)
- **Tables:** User, Movie, Wunwurd
- **Key relationships:** User ← Wunwurd → Movie (cascading deletes)
- **Estimated size:** < 50 MB (hobby project, small user base)
- **Auth:** JWT tokens, email via Nodemailer/Resend

### `nowandnext` (AAC communication board)
- **Tables:** User, UserSymbol, Board, Routine
- **Key relationships:** User → UserSymbol/Board/Routine (cascading deletes)
- **Estimated size:** < 100 MB (local/family use)
- **Auth:** JWT tokens
- **Storage:** JSON fields (items in Board, steps in Routine)

Both use **Prisma ORM** with PostgreSQL provider.

---

## Free PostgreSQL Options: Comparison

| Feature | **Supabase** | **Neon** | **Render** |
|---------|-----------|----------|-----------|
| **Free tier storage** | 500 MB | 0.5 GB | 100 MB shared |
| **Connections** | 10 pooled | 3 pooled, unlimited solo | Limited |
| **Idle timeout** | None (persistent) | None (persistent) | 7 days + rebuilds after idle |
| **Performance** | Excellent | Excellent | Slower on wake |
| **Auth integration** | Built-in Supabase Auth | Prisma only | Prisma only |
| **Backup/restore** | Automatic daily | Point-in-time recovery | Manual |
| **Scaling** | Upgrade within console | Auto-scale included | Limited |
| **Best for** | Teams, complex apps | Performance-focused | Simple hobby projects |
| **Risk** | Updates occasionally break things | Very stable | Idle corruption risk |
| **Upgrade path** | Smooth, paid plans available | Smooth, paid plans available | Need migration |

---

## ✅ **Recommendation: SUPABASE**

**Why Supabase is the best choice for you:**

1. **Exactly matches your use case** – Hobby projects with sporadic users (wunwurd, nowandnext)
2. **500 MB free tier is plenty** – You'll never hit limits with these schemas
3. **Zero idle concerns** – Your backend stays warm; no wake-up lag
4. **Painless migration** – Prisma + PostgreSQL → Supabase just works
5. **Built-in backup** – Automatic daily backups (peace of mind)
6. **Room to grow** – Can keep free tier indefinitely, or upgrade if needed (not forced)
7. **Community proven** – Thousands of hobby projects run on Supabase free tier

---

## Migration Path (Supabase)

### Phase 1: Prepare (30 min)
1. Create Supabase account + 2 new projects (`wunwurd`, `nowandnext`)
2. Copy PostgreSQL connection strings
3. Update `.env` files locally + CI/CD secrets
4. Test locally with Supabase connection strings

### Phase 2: Migrate Data (30 min)
1. **Export from Railway:**
   ```bash
   pg_dump postgresql://user:pass@railway-host/dbname > wunwurd.sql
   pg_dump postgresql://user:pass@railway-host/dbname > nowandnext.sql
   ```

2. **Import to Supabase:**
   ```bash
   psql postgresql://user:pass@supabase-host/postgres < wunwurd.sql
   psql postgresql://user:pass@supabase-host/postgres < nowandnext.sql
   ```

3. **Or use Prisma (safer):**
   ```bash
   cd apps/wunwurd/backend
   # Update .env DATABASE_URL to Supabase
   npx prisma migrate resolve --rolled-back 001_init  # if needed
   npx prisma db push --force-reset  # on Supabase, fresh start
   npm run seed  # if you have seed.js
   ```

### Phase 3: Verify (15 min)
1. Log into Supabase console, verify tables + row counts
2. Run local tests with Supabase connection
3. Spot-check API endpoints in staging

### Phase 4: Deploy (5 min)
1. Update GitHub Actions secrets with Supabase connection strings
2. Update `VITE_API_URL` in production if needed
3. Trigger deploy workflow

### Phase 5: Decommission Railway (5 min)
1. Keep Railway project running for 24 hours as fallback
2. Monitor error logs from staging/production
3. Delete Railway project after you're confident

---

## Environment Variables to Update

**Supabase generates these for you:**
```
DATABASE_URL="postgresql://postgres:password@region.supabase.co:5432/postgres?schema=public"
```

**Update in:**
- `apps/wunwurd/backend/.env`
- `apps/nowandnext/backend/.env`
- GitHub Actions secrets (Fasthosts deploy workflow)
- Docker `.env` if using compose locally

---

## Rollback Plan

If Supabase has issues:
1. **Keep a snapshot** – Export data before deleting Railway
2. **Fallback to Neon** – Same connection string format, 5-min switchover
3. **Render** – Would need connection pooling tuning

---

## After Migration Checklist

- [ ] Supabase projects created
- [ ] Data migrated + verified
- [ ] Local `.env` updated
- [ ] Staging tested for 2-3 days
- [ ] GitHub Actions secrets updated
- [ ] Deploy workflow runs successfully
- [ ] Production logs clean (no DB errors)
- [ ] Railway project marked for deletion in 30 days
- [ ] Backup downloaded locally (optional but recommended)

---

## Long-Term Benefits

✅ **Never migrate again** – Supabase scales for free within limits you won't hit  
✅ **Automatic backups** – Your data is protected  
✅ **Production-grade** – Used by real companies, not just hobbyists  
✅ **Better than Railway** – Railway was always temporary; Supabase is meant to be permanent  

---

## Questions to Answer Before Starting

- [ ] Is data in Railway currently? (Yes/No)
- [ ] Do you have recent backups? (Yes/No)
- [ ] Any custom PostgreSQL extensions needed? (List them)
- [ ] Prefer minimal migrations or comfort of testing slower path?
