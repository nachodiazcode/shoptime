import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

// Crear un nuevo producto
export const createProduct = asyncHandler(async (req, res) => {
  const { titulo, descripcion, precio, stock, categoria, imagen } = req.body;
  if (!titulo || !descripcion || !precio || !stock || !categoria) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios excepto la imagen.' });
  }
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Autenticación de usuario requerida.' });
  }
  const product = new Product({
    titulo,
    descripcion,
    precio,
    stock,
    categoria,
    imagen,
    creadoPor: req.user.id
  });
  await product.save();
  res.status(201).json({ message: 'Producto creado exitosamente', product });
});

// Obtener todos los productos
export const getProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find().populate('creadoPor', 'titulo email');
  res.json({ message: 'Productos obtenidos exitosamente', products });
});

// Obtener un producto por ID
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('creadoPor', 'titulo email');
  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado.' });
  }
  res.json({ message: 'Producto obtenido exitosamente', product });
});

// Actualizar un producto
export const updateProduct = asyncHandler(async (req, res) => {
  const { titulo, descripcion, precio, precioPromocion, stock, categoria, imagenes, atributos, ubicacion } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado.' });
  }
  product.titulo = titulo || product.titulo;
  product.descripcion = descripcion || product.descripcion;
  product.precio = precio || product.precio;
  product.precioPromocion = precioPromocion || product.precioPromocion;
  product.stock = stock || product.stock;
  product.categoria = categoria || product.categoria;
  product.imagenes = imagenes || product.imagenes;
  product.atributos = atributos || product.atributos;
  product.ubicacion = ubicacion || product.ubicacion;
  await product.save();
  res.json({ message: 'Producto actualizado exitosamente', product });
});

// Eliminar un producto
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado.' });
  }
  await product.deleteOne();
  res.json({ message: 'Producto eliminado exitosamente.' });
});

// Buscar productos por palabras clave
export const searchProducts = asyncHandler(async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: 'Se requiere un parámetro de consulta.' });
  }
  const products = await Product.find({
    $or: [
      { titulo: { $regex: query, $options: 'i' } },
      { descripcion: { $regex: query, $options: 'i' } }
    ]
  }).populate('creadoPor', 'nombre email');
  res.json({ message: `Productos encontrados que coinciden con '${query}'`, products });
});

// Filtrar búsqueda de productos
export const filterSearchProducts = asyncHandler(async (req, res) => {
  const { titulo, minPrecio, maxPrecio, enStock, categoria, descripcion } = req.query;
  let queryConditions = {};
  if (titulo) queryConditions.titulo = { $regex: titulo, $options: 'i' };
  if (descripcion) queryConditions.descripcion = { $regex: descripcion, $options: 'i' };
  if (categoria) queryConditions.categoria = categoria;
  if (minPrecio) queryConditions.precio = { ...queryConditions.precio, $gte: Number(minPrecio) };
  if (maxPrecio) queryConditions.precio = { ...queryConditions.precio, $lte: Number(maxPrecio) };
  if (enStock) queryConditions.stock = { $gt: 0 };
  const products = await Product.find(queryConditions).populate('creadoPor', 'nombre email');
  res.json({ message: 'Productos filtrados obtenidos exitosamente', products });
});

// Crear múltiples nuevos productos
export const createMultipleProducts = asyncHandler(async (req, res) => {
  const products = req.body;
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: 'Por favor, proporcione un arreglo de productos.' });
  }
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Autenticación de usuario requerida.' });
  }
  const productsWithCreator = products.map(product => ({
    ...product,
    creadoPor: req.user.id
  }));
  try {
    const newProducts = await Product.insertMany(productsWithCreator);
    res.status(201).json({ message: 'Productos agregados exitosamente', products: newProducts });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar productos', error: error.message });
  }
});
