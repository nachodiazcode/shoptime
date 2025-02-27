// Ejemplo de uso en server.js
import config from './config/config.js';
console.log('Running on port:', config.port);

// Ejemplo en la conexión a la base de datos
import mongoose from 'mongoose';
import config from './config/config.js';

mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));
