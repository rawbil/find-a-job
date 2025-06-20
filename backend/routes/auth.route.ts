import express from 'express';
import { LoginUser, LogoutUser, RegisterUser } from '../controllers/auth.controller';
import AuthMiddleware from '../middleware/auth.middleware';

const router = express.Router();

//!REGISTER
//api/auth/register
router.post('/register', RegisterUser);

//!LOGIN
//api/auth/login
router.post('/login', LoginUser)

//!LOGOUT
//api/auth/logout
router.post('/logout', AuthMiddleware, LogoutUser);

export default router;