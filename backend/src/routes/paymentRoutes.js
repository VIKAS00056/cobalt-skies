import express from 'express';
import {
  createOrder,
  verifyPayment,
  handleWebhook,
  getMyPayments,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', handleWebhook);
router.get('/my-payments', protect, getMyPayments);

export default router;
