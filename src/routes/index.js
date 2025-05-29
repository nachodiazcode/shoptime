import express from 'express';
import userRoutes from './user.js';
import authRoutes from './auth.js';
import productRoutes from './products.js';
import cartRoutes from './cart.js';
import orderRoutes from './order.js';

const router = express.Router();

// Rutas de usuario
router.use('/users', userRoutes);  // Maneja operaciones relacionadas con los usuarios, como registro, actualización y eliminación de usuarios.

// Rutas de autenticación
router.use('/auth', authRoutes);   // Maneja la autenticación y autorización, incluyendo inicio de sesión y manejo de tokens.

// Rutas de productos
router.use('/products', productRoutes);  // Maneja operaciones relacionadas con productos, como agregar, editar, eliminar y ver productos.

// Rutas de carrito
router.use('/cart', cartRoutes);  // Maneja operaciones relacionadas con el carrito de compras, incluyendo agregar productos al carrito, actualizar cantidades y vaciar el carrito.

// Rutas de órdenes
router.use('/orders', orderRoutes);  // Maneja operaciones relacionadas con órdenes, como crear órdenes a partir de productos en el carrito, y ver detalles de órdenes específicas.

// Ruta de prueba principal
router.get('/', (req, res) => {
  res.json({ message: 'API ShopTime funcionando correctamente!' });
});

export default router;
