import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productos: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      precioUnitario: { type: Number, required: true },
      subtotal: { type: Number, required: true }
  }],
  total: { type: Number, default: 0 },
  estado: { type: String, default: 'activo' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware para calcular el total antes de guardar
CartSchema.pre('save', function (next) {
  this.total = this.productos.reduce((acc, item) => acc + item.subtotal, 0);
  next();
});

export default mongoose.model('Cart', CartSchema);
