import express from 'express';
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterSearchProducts,
    createMultipleProducts
} from '../controllers/productController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createProduct)
    .get(getProducts);

router.get('/search', searchProducts);  // Ruta para búsqueda por palabras clave
router.get('/filter', filterSearchProducts);  // Ruta para búsqueda filtrada

router.route('/:id')
    .get(getProductById)
    .put(protect, updateProduct)
    .delete(protect, deleteProduct);

router.post('/create-multiple', protect, createMultipleProducts);


export default router;

