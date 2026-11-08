import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  toggleBlockUser,
  getAllPayments,
  exportRegistrationsCSV,
  exportPaymentsCSV,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Apply admin protection to all routes in this file
router.use(protect, requireAdmin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle-block', toggleBlockUser);
router.get('/payments', getAllPayments);
router.get('/export/registrations', exportRegistrationsCSV);
router.get('/export/payments', exportPaymentsCSV);

export default router;
