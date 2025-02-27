import express from 'express';
import { register, validateRegister, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', login);

export default router;
