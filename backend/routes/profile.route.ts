import express from 'express';
import AuthMiddleware from '../middleware/auth.middleware';
import { CreateUserProfile } from '../controllers/profile.controller';
const router = express.Router();

//api/profile/create
router.post('/create', AuthMiddleware, CreateUserProfile);


export default router;