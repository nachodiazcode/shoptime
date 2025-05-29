import Cart from '../models/Cart.js';
import Order from '../models/Order.js'; // Asegúrate de tener importado correctamente el modelo Order
import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

// Crear una orden
export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({ usuario: userId }).populate({
    path: 'productos.productId',
    select: 'titulo precio stock',
    strictPopulate: false
  });

  if (!cart || !cart.productos || cart.productos.length === 0) {
    return res.status(400).json({ message: 'El carrito está vacío. Agrega productos antes de crear una orden.' });
  }

  const orderProducts = cart.productos.map(p => ({
    productoId: p.productId._id,
    titulo: p.productId.titulo,
    cantidad: p.quantity,
    precioUnitario: p.productId.precio,
    precio: p.productId.precio, // Asegúrate de que este campo está siendo incluido correctamente
    subtotal: p.productId.precio * p.quantity
  }));

  const total = orderProducts.reduce((acc, p) => acc + p.subtotal, 0);

  const order = new Order({
    usuario: userId,
    productos: orderProducts,
    total,
    estado: 'pendiente'
  });

  await order.save();
  await Cart.findOneAndUpdate({ usuario: userId }, { productos: [] });

  res.status(201).json({ message: 'Orden creada exitosamente', order });
});

// Obtener órdenes de un usuario
export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ usuario: req.user.id }).populate('productos.productoId');
  res.json(orders);
});

// Obtener una orden por ID
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('productos.productoId');

  if (!order) {
    return res.status(404).json({ message: 'Orden no encontrada' });
  }

  res.json(order);
});
