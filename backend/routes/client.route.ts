import express from "express";
import {
  CreateUserProfile,
  //UpdateUserProfile,
  GetUserProfile,
  GetAllUsersProfiles,
  GetLatestUsersProfiles,
  UpdateClientPost,
  DeleteClientPost,
  GetUserPosts,
} from "../controllers/client.controller";
import AuthMiddleware from "../middleware/auth.middleware";

const router = express.Router();

// Create client profile (protected)
//api/client/create
router.post("/create", AuthMiddleware, CreateUserProfile);

// Update client profile (protected)
//api/client/update/:id
//router.patch("/update", AuthMiddleware, UpdateUserProfile);
router.patch('/update/:id', AuthMiddleware, UpdateClientPost);

//delete
//api/client/delete/:id
router.delete('/delete/:id', AuthMiddleware, DeleteClientPost);


// Get current user's client profile (protected)
//api/client/get-profile/:id
router.get("/get-profile/:id", AuthMiddleware, GetUserProfile);

// Get all client profiles (public or protected as needed)
//api/client/profiles
router.get("/profiles", GetAllUsersProfiles);

// Get latest 10 client profiles (public or protected as needed)
//api/client/latest
router.get("/latest", GetLatestUsersProfiles);

//api/client/user-posts
router.get('/user-posts', AuthMiddleware, GetUserPosts);

export default router;