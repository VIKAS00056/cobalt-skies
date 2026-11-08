import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Load environment variables
dotenv.config();

import { connectDB } from './config/db.js';
import { seedDatabase } from './scripts/seed.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Enable CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for festival participants
      }
    },
    credentials: true,
  })
);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply general API rate limiter
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'COBALT SKIES Fest API Engine',
    version: '2026.1.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server & Connect Database
const startServer = async () => {
  try {
    await connectDB();
    // Run automated seed check
    try {
      await seedDatabase();
    } catch (seedErr) {
      console.warn('Initial seeding note:', seedErr.message);
    }

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`⚡ COBALT SKIES 2026 Backend Server is Running!`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🛡️  Admin Account: ${process.env.ADMIN_EMAIL || 'admin@cobaltskies.com'}`);
      console.log(`💳 Payment Gateway: Razorpay UPI Engine Ready`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error('Fatal Server Boot Error:', error);
    process.exit(1);
  }
};

startServer();

export default app;
