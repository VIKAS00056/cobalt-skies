import express from 'express';
import {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
} from '../controllers/gameController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getGames)
  .post(protect, requireAdmin, createGame);

router.route('/:identifier')
  .get(getGameById)
  .put(protect, requireAdmin, updateGame)
  .delete(protect, requireAdmin, deleteGame);

export default router;
