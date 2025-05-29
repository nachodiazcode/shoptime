import express from 'express';
import { getUserCart, addProductToCart, updateProductQuantity, removeProductFromCart, clearCart } from '../controllers/cartController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Obtener el carrito del usuario
router.get('/', protect, getUserCart);

// Agregar producto al carrito
router.post('/', protect, addProductToCart);

// Actualizar la cantidad de un producto en el carrito
router.put('/', protect, updateProductQuantity);

// Eliminar un producto del carrito por su ID
router.delete('/:productId', protect, removeProductFromCart);

// Vaciar el carrito
router.delete('/', protect, clearCart);

export default router;
