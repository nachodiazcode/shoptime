import mongoose from 'mongoose';

const messagesSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true,
  },
  remitente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  destinatario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mensaje: {
    type: String,
    required: true,
  },
  respuesta: {
    type: String,
    default: null,
  },
  respondido: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model('Messages', messagesSchema);
