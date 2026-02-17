const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { limiter } = require('./middleware/rateLimit');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const progressRoutes = require('./routes/progressRoutes');

// Unsplash route (public, for landing page images)
const { searchPhotos, getRandomPhoto } = require('./utils/apiUnsplash');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://images.unsplash.com", "https://plus.unsplash.com", "https://*.unsplash.com"],
      connectSrc: ["'self'", "http://localhost:*", "https://*.edamam.com", "https://api.api-ninjas.com", "https://api.unsplash.com"],
    }
  }
}));
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://fitness-tracker-sigma-weld.vercel.app',
      process.env.CLIENT_URL
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// API Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/nutrition', nutritionRoutes);
app.use('/api/v1/workouts', workoutRoutes);
app.use('/api/v1/progress', progressRoutes);

// Public route for images (no auth required)
app.get('/api/v1/images/search', async (req, res, next) => {
  try {
    const { query = 'fitness', count = 6 } = req.query;
    const photos = await searchPhotos(query, parseInt(count));
    res.json({ success: true, data: photos });
  } catch (error) {
    next(error);
  }
});

app.get('/api/v1/images/random', async (req, res, next) => {
  try {
    const { query = 'fitness gym' } = req.query;
    const photo = await getRandomPhoto(query);
    res.json({ success: true, data: photo });
  } catch (error) {
    next(error);
  }
});

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'FitLife API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 FitLife API running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
