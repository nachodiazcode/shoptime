import express from 'express';
import { getUsers } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { createMultipleUsers } from '../controllers/userController.js';

const router = express.Router();

router.get('/', protect, getUsers); // Usar middleware de protección aquí si necesario
router.post('/batch-create', createMultipleUsers);

export default router;
