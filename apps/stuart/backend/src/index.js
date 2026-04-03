import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()
app.use(cors())

const PORT = process.env.PORT || 3005
const SPOTIFY_PREVIEW_URL = 'https://p.scdn.co/mp3-preview/5fBlnN4KvXlH1T5CmNE5Sm'

// Proxy endpoint for Spotify preview - handles CORS
app.get('/api/preview', async (req, res) => {
  try {
    const response = await fetch(SPOTIFY_PREVIEW_URL)
    if (!response.ok) {
      return res.status(response.status).send('Failed to fetch preview')
    }

    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'public, max-age=86400')
    response.body.pipe(res)
  } catch (err) {
    console.error('Preview fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch preview' })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Stuart backend running on http://localhost:${PORT}`)
})
