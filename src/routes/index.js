import express from 'express';
import userRoutes from './user.js';
import authRoutes from './auth.js';

const router = express.Router();

router.use('/users', userRoutes); // Rutas para usuarios
router.use('/auth', authRoutes); // Rutas para autenticación

export default router;
