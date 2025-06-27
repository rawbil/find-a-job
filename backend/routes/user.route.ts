import express from 'express';
import AuthMiddleware from '../middleware/auth.middleware';
import { DeleteUserById, GetUserById, UpdateUserById } from '../controllers/user.controller';
const router = express.Router();

//!get-user-by-id
//api/users/get
router.get('/get', AuthMiddleware, GetUserById);

//!update-user-by-id
//api/users/update-one
router.patch('/update-one', AuthMiddleware, UpdateUserById)

//!delete-user-by-id
//api/users/delete
router.post('/delete', AuthMiddleware, DeleteUserById);

export default router;