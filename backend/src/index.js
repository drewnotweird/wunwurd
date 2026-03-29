const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const moviesRoutes = require('./routes/movies');
const profileRoutes = require('./routes/profile');
const wordsRoutes = require('./routes/words');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/words', wordsRoutes);

app.listen(PORT, () => {
  console.log(`WUNWURD backend running on http://localhost:${PORT}`);
});
