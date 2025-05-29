import express from 'express';
import { createOrder, getUserOrders, getOrderById } from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder) // Crear orden desde el carrito
  .get(protect, getUserOrders); // Obtener todas las órdenes del usuario

router.route('/:id')
  .get(protect, getOrderById); // Obtener una orden específica

export default router;
