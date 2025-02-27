import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path'

// Función auxiliar para generar un token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d' // Configura según las necesidades de tu aplicación
    });
};

// Controlador para registrar un nuevo usuario
export const register = async (req, res) => {
    const { username, email, password, tipo } = req.body;

    if (!username || !email || !password || !tipo) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear nuevo usuario
        const user = new User({
            username,
            email,
            password: hashedPassword,
            tipo  // Asegúrate de que este campo está siendo incluido
        });

        const savedUser = await user.save();

        res.status(201).json({
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            token: generateToken(savedUser._id)
        });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error al registrar el usuario: ' + error.message });
    }
};



// Controlador para iniciar sesión
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if (user && await bcrypt.compare(password, user.password)) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión: ' + error.message });
    }
};

// Controlador para obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios: ' + error.message });
    }
};


export const createMultipleUsers = async (req, res) => {
    const users = req.body.users; // Asume que `users` es un array de objetos usuario
    const creationResults = [];
    
    for (const userData of users) {
        const { username, email, password } = userData;
        try {
            // Verificar si el usuario ya existe
            const userExists = await User.findOne({ email });
            if (userExists) {
                creationResults.push({ email, message: 'Usuario ya existe' });
                continue; // Salta a la siguiente iteración del bucle
            }

            // Hash de la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Crear nuevo usuario
            const newUser = new User({
                username,
                email,
                password: hashedPassword
            });

            const savedUser = await newUser.save();
            creationResults.push({ email: savedUser.email, message: 'Usuario creado exitosamente' });
        } catch (error) {
            creationResults.push({ email, message: 'Error al crear usuario: ' + error.message });
        }
    }

    res.status(201).json(creationResults);
};