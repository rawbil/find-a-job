import express from 'express';
import AuthMiddleware from '../middleware/auth.middleware';
import { CreateUserProfile, GetAllUsersProfiles, GetUserProfile, UpdateUserProfile } from '../controllers/profile.controller';
const router = express.Router();

//api/profile/create
router.post('/create', AuthMiddleware, CreateUserProfile);
//api/profile/update
router.patch('/update', AuthMiddleware, UpdateUserProfile);
//api/profile/get-profile
router.get('/get-profile', AuthMiddleware, GetUserProfile);
//api/profiles/all
router.get('/all', AuthMiddleware, GetAllUsersProfiles);


export default router;