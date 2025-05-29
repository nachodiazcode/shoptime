import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import logger from './../utils/logger.js';  // Ajusta la ruta según la ubicación real de tu archivo logger

// Función auxiliar para generar un token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

// Controlador para registrar un nuevo usuario
export const register = asyncHandler(async (req, res) => {
    const { username, email, password, roles, profile, address, paymentMethods } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        logger.error('Intento de registro con un email que ya existe: ' + email);
        return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        username,
        email,
        password: hashedPassword,
        roles,
        profile,
        address,
        paymentMethods
    });

    await user.save();
    logger.info('Usuario registrado: ' + username);
    res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            roles: user.roles,
            profile: user.profile,
            address: user.address,
            paymentMethods: user.paymentMethods,
            token: generateToken(user._id)
        }
    });
});

// Controlador para actualizar un usuario
export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { username, email, password, roles, profile, address } = req.body;

    const user = await User.findById(id);
    if (!user) {
        logger.warn('Usuario no encontrado: ' + id);
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.roles = roles || user.roles;
    user.profile = profile || user.profile;
    user.address = address || user.address;

    if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    logger.info('Usuario actualizado: ' + username);
    res.json({
        message: 'Usuario actualizado exitosamente',
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            roles: user.roles,
            profile: user.profile,
            address: user.address
        }
    });
});

// Controlador para obtener todos los usuarios
export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    logger.info('Consulta de todos los usuarios realizada.');
    res.json(users.map(user => ({
        _id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        profile: user.profile,
        address: user.address
    })));
});

// Controlador para crear múltiples usuarios
export const createMultipleUsers = asyncHandler(async (req, res) => {
    const users = req.body.users;
    const creationResults = [];

    for (const userData of users) {
        const { username, email, password, roles, profile, address, paymentMethods } = userData;
        const userExists = await User.findOne({ email });
        if (userExists) {
            logger.warn('Registro fallido por email existente: ' + email);
            creationResults.push({ email, message: 'Usuario ya existe' });
            continue;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            roles,
            profile,
            address,
            paymentMethods
        });
        await newUser.save();
        logger.info('Nuevo usuario registrado: ' + username);
        creationResults.push({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            roles: newUser.roles,
            profile: newUser.profile,
            address: newUser.address,
            paymentMethods: newUser.paymentMethods.map(pm => ({
                cardType: pm.cardType,
                cardNumber: '**** **** **** ' + pm.cardNumber.slice(-4),
                cardName: pm.cardName,
                cardExpiration: pm.cardExpiration
            }))
        });
    }

    res.status(201).json(creationResults);
});
