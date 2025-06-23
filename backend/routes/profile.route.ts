import express from 'express';
import AuthMiddleware from '../middleware/auth.middleware';
import { CreateUserProfile, GetAllUsersProfiles, GetLatestUsersProfiles, GetUserProfile, UpdateUserProfile } from '../controllers/profile.controller';
const router = express.Router();

//api/profile/create
router.post('/create', AuthMiddleware, CreateUserProfile);
//api/profile/update
router.patch('/update', AuthMiddleware, UpdateUserProfile);
//api/profile/get-profile
router.get('/get-profile', AuthMiddleware, GetUserProfile);
//api/profile/all
router.get('/all', GetAllUsersProfiles); //should be visible by all users
//api/profile/latest
router.get('/latest',  GetLatestUsersProfiles); //should be visible by all users

export default router;