import express from 'express';
import {
  getMyRegistrations,
  getRegistrationById,
  getAllRegistrations,
  cancelRegistration,
} from '../controllers/registrationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/my-registrations', protect, getMyRegistrations);
router.get('/', protect, requireAdmin, getAllRegistrations);
router.get('/:identifier', protect, getRegistrationById);
router.patch('/:id/cancel', protect, requireAdmin, cancelRegistration);

export default router;
