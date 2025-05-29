import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

// Get user's cart, ensuring it is retrieved or initialized at each session
export const getUserCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ usuario: req.user.id })
    .populate({
      path: 'productos.productId',
      select: 'titulo precio imagen stock',
      strictPopulate: false
    });

  if (!cart) {
    cart = new Cart({ usuario: req.user.id, productos: [] });
    await cart.save();
  }

  res.json({ message: 'Carrito recuperado exitosamente', cart });
});

// Add product to cart with stock validation and handling
export const addProductToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'ID de producto y cantidad válidos son requeridos' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ message: 'Stock insuficiente disponible' });
  }

  const cart = await Cart.findOneAndUpdate(
    { usuario: req.user.id },
    {
      $addToSet: {
        productos: {
          productId,
          quantity,
          precioUnitario: product.precio,
          subtotal: product.precio * quantity
        }
      }
    },
    { new: true, upsert: true }
  );

  cart.total = cart.productos.reduce((acc, p) => acc + p.subtotal, 0);
  await cart.save();

  res.status(201).json({ message: 'Producto agregado al carrito', cart });
});

// Update product quantity in cart with validations
export const updateProductQuantity = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity <= 0) {
    return res.status(400).json({ message: 'ID de producto y cantidad válidos son requeridos' });
  }

  const cart = await Cart.findOne({ usuario: req.user.id });
  if (!cart) {
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }

  const productIndex = cart.productos.findIndex(p => p.productId.toString() === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
  }

  // Check stock before updating
  const product = await Product.findById(productId);
  if (quantity > product.stock) {
    return res.status(400).json({ message: 'Stock insuficiente para la cantidad solicitada' });
  }

  cart.productos[productIndex].quantity = quantity;
  cart.productos[productIndex].subtotal = cart.productos[productIndex].precioUnitario * quantity;

  cart.total = cart.productos.reduce((acc, p) => acc + p.subtotal, 0);
  await cart.save();

  res.status(200).json({ message: 'Cantidad actualizada exitosamente', cart });
});

// Remove product from cart
export const removeProductFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOneAndUpdate(
    { usuario: req.user.id },
    { $pull: { productos: { productId } } },
    { new: true }
  );

  if (!cart) {
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }

  cart.total = cart.productos.reduce((acc, p) => acc + p.subtotal, 0);
  await cart.save();

  res.status(200).json({ message: 'Producto eliminado del carrito', cart });
});

// Clear the entire cart
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { usuario: req.user.id },
    { productos: [], total: 0 },
    { new: true }
  );

  if (!cart) {
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }

  res.status(200).json({ message: 'Carrito vaciado exitosamente', cart });
});

export default {
  getUserCart,
  addProductToCart,
  updateProductQuantity,
  removeProductFromCart,
  clearCart
};
