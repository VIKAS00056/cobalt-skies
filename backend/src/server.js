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

// Trust reverse proxy for Cloudflare / Render deployments (required for accurate rate limiting and IP resolution)
app.set('trust proxy', 1);

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Allowed origins for CORS
const explicitAllowedOrigins = [
  'https://cobalt-skies.pages.dev',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, Postman, server-to-server health checks)
    if (!origin) return callback(null, true);

    // Check explicit origins
    if (explicitAllowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow Cloudflare Pages deployments (*.cobalt-skies.pages.dev or cobalt-skies.pages.dev)
    if (/^https:\/\/([a-z0-9-]+\.)?cobalt-skies\.pages\.dev$/.test(origin)) {
      return callback(null, true);
    }

    // Allow local development on any port
    if (/^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // Permissive fallback so fest attendees on any preview deployment are never blocked
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-razorpay-signature'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoints for Render and monitoring (handles '/', '/health', and '/api/health')
app.get(['/', '/health', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'COBALT SKIES Fest API Engine',
    version: '2026.1.0',
    environment: process.env.NODE_ENV || 'production',
  });
});

// Apply API rate limiter to all API endpoints
app.use('/api', apiLimiter);

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
const HOST = '0.0.0.0';

// Start Server & Connect Database
const startServer = async () => {
  try {
    await connectDB();
    // Run automated seed check (seeds admin + initial events if collection empty)
    try {
      await seedDatabase();
    } catch (seedErr) {
      console.warn('Initial seeding note:', seedErr.message);
    }

    app.listen(PORT, HOST, () => {
      console.log(`\n======================================================`);
      console.log(`⚡ COBALT SKIES 2026 Backend Server is Running!`);
      console.log(`📡 Host: ${HOST} | Port: ${PORT}`);
      console.log(`📡 URL: http://${HOST}:${PORT}`);
      console.log(`🛡️  Admin Account: ${process.env.ADMIN_EMAIL || 'admin@cobaltskies.com'}`);
      console.log(`💳 Payment Gateway: Razorpay UPI Engine Ready (Demo/Test Mode)`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error('Fatal Server Boot Error:', error);
    process.exit(1);
  }
};

startServer();

export default app;
