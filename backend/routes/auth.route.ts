import express from 'express';
import { LoginUser, RegisterUser } from '../controllers/auth.controller';

const router = express.Router();

//!REGISTER
//api/auth/register
router.post('/register', RegisterUser);

//!LOGIN
//api/auth/login
router.post('/login', LoginUser)

export default router;