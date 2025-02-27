import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Middleware para proteger rutas
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        try {
            // Verificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Obtener información del usuario del token
            req.user = await User.findById(decoded.id).select('-password');

            return next(); // Continuar solo si todo está correcto
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'No autorizado, token fallido' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'No autorizado, no hay token' });
    }
});

// Middleware para verificar el rol del usuario
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        return res.status(401).json({ message: 'No autorizado como administrador' });
    }
};

export { protect, admin };
