import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true,
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo'],
  },
  stock: {
    type: Number,
    required: [true, 'El stock es obligatorio'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0,
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: ['Computación', 'Gaming', 'Audio', 'Tecnología', 'Fotografía', 'Almacenamiento'],
  },
  imagen: {
    type: String,
    default: 'https://imagenes.com/default.jpg', // Imagen por defecto si no se proporciona
  },
  creadoPor: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario creador es obligatorio'],
  }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
