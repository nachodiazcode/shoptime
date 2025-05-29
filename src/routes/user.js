import express from 'express';
import {
  getUsers,
  updateUser,
  createMultipleUsers,
  register  // Asegúrate de importar el controlador de registro
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta para obtener todos los usuarios, protegida con autenticación
router.get('/', protect, getUsers);

// Ruta para crear múltiples usuarios (no protegida en este ejemplo)
router.post('/batch-create', createMultipleUsers);

// Ruta para actualizar un usuario, protegida con autenticación
router.put('/:id', protect, updateUser);

// Ruta para registrar un nuevo usuario (puede o no estar protegida, según tu lógica de negocio)
router.post('/register', register);

export default router;
