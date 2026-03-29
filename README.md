# WUNWURD — Single-Word Movie Reviews

A community-driven app where users submit exactly one word to describe any movie.
The most-submitted word becomes the movie's official WUNWURD.

---

## Before you start — what you need to install

You only need to do this once on your Mac. Open **Terminal** (press `Cmd + Space`, type `Terminal`, hit Enter).

### 1. Install Homebrew (Mac package manager)

Paste this into Terminal and press Enter:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the prompts. It may ask for your Mac password.

### 2. Install Node.js

```
brew install node
```

Verify it worked:

```
node --version
```

You should see something like `v20.x.x`.

### 3. Install Docker Desktop

Docker runs your database without you needing to configure PostgreSQL manually.

1. Go to **https://www.docker.com/products/docker-desktop/**
2. Download **Docker Desktop for Mac (Apple Silicon)** if you have an M1/M2/M3 Mac, or **(Intel)** if you have an older Mac.
3. Open the downloaded `.dmg` file and drag Docker to Applications.
4. Open Docker from your Applications folder and wait for it to say "Docker Desktop is running".

---

## Get a free TMDB API key (for movie data)

TMDB (The Movie Database) provides all the movie posters and info. It's completely free.

1. Go to **https://www.themoviedb.org/signup** and create a free account.
2. After signing up, go to **https://www.themoviedb.org/settings/api**
3. Click **"Request an API Key"** → choose **"Developer"** → fill in the form (for personal project, anything goes).
4. Copy the **API Key (v3 auth)** — it looks like `abc123def456...`

---

## Set up the project

Open Terminal and navigate to this project folder:

```
cd "/Users/andrew/Documents/Claude Projects/Wunwurd"
```

### Step 1 — Start the database

```
docker-compose up -d
```

This starts PostgreSQL in the background. You'll see it downloading (first time only) then starting. To confirm it's running:

```
docker ps
```

You should see a container named something like `wunwurd-postgres-1`.

### Step 2 — Set up the backend

```
cd backend
```

Copy the example environment file and fill in your keys:

```
cp .env.example .env
```

Now open `.env` in a text editor. On Mac you can run:

```
open -e .env
```

Edit these three values:
- `TMDB_API_KEY` — paste the key you got from TMDB
- `JWT_SECRET` — make up any long random string (e.g. `supersecretpassword123changeThis!`)
- Leave `DATABASE_URL` and `PORT` as-is if you're using the Docker setup

Save the file.

Now install the backend packages and set up the database:

```
npm install
npm run db:push
```

If you see `Your database is now in sync with your Prisma schema.` — you're good.

### Step 3 — Set up the frontend

Open a **second Terminal window** (Cmd + T or Cmd + N), then:

```
cd "/Users/andrew/Documents/Claude Projects/Wunwurd/frontend"
npm install
```

---

## Run the app

You need two Terminal windows open simultaneously.

### Terminal window 1 — Backend

```
cd "/Users/andrew/Documents/Claude Projects/Wunwurd/backend"
npm run dev
```

You should see: `WUNWURD backend running on http://localhost:3001`

### Terminal window 2 — Frontend

```
cd "/Users/andrew/Documents/Claude Projects/Wunwurd/frontend"
npm run dev
```

You should see a URL like: `http://localhost:5173`

Open that URL in your browser. WUNWURD is running!

---

## Stopping the app

- In each Terminal window, press `Ctrl + C` to stop the server.
- To stop the database: `docker-compose down` (run from the project root folder)
- To start again next time: start Docker Desktop, run `docker-compose up -d`, then start both servers.

---

## Project structure

```
Wunwurd/
├── backend/          ← Node.js + Express API server
│   ├── prisma/       ← Database schema
│   ├── src/
│   │   ├── middleware/   ← Auth checking
│   │   ├── routes/       ← API endpoints
│   │   └── services/     ← TMDB API calls
│   └── .env          ← Your secret keys (never share this!)
├── frontend/         ← React app
│   └── src/
│       ├── components/   ← Reusable UI pieces
│       ├── pages/        ← Each screen/route
│       ├── context/      ← Login state
│       └── hooks/        ← Utilities
└── docker-compose.yml   ← Database setup
```

---

## Environment variables

| Variable | Where | What it is |
|---|---|---|
| `DATABASE_URL` | backend/.env | PostgreSQL connection string |
| `TMDB_API_KEY` | backend/.env | Your TMDB API key |
| `JWT_SECRET` | backend/.env | Secret for signing login tokens — keep private! |
| `PORT` | backend/.env | Port the backend runs on (default 3001) |
| `FRONTEND_URL` | backend/.env | URL of the frontend (for CORS) |

---

## Troubleshooting

**"Cannot connect to database"**
→ Make sure Docker Desktop is open and running, then: `docker-compose up -d`

**"Invalid TMDB API key"**
→ Double-check your `.env` file — no extra spaces or quotes around the key.

**"Port already in use"**
→ Something else is running on port 3001 or 5173. You can change `PORT=3002` in `.env` and update `vite.config.js` proxy target accordingly.

**npm install errors**
→ Try `npm install --legacy-peer-deps`

**Movies not showing on home page**
→ Check Terminal window 1 for errors — your TMDB API key might be wrong.
