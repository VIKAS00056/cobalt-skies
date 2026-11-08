import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, requireAdmin, createEvent);

router.route('/:identifier')
  .get(getEventById)
  .put(protect, requireAdmin, updateEvent)
  .delete(protect, requireAdmin, deleteEvent);

export default router;
