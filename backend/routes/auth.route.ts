import express from 'express';
import { LoginUser, LogoutUser, RegisterUser, updateUserPass } from '../controllers/auth.controller';
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

//!CHANGE PASSWORD
//api/auth/change-password
router.put('/change-password',AuthMiddleware, updateUserPass)

export default router;