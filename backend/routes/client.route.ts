import express from "express";
import {
  CreateUserProfile,
  UpdateUserProfile,
  GetUserProfile,
  GetAllUsersProfiles,
  GetLatestUsersProfiles,
} from "../controllers/client.controller";
import AuthMiddleware from "../middleware/auth.middleware";

const router = express.Router();

// Create client profile (protected)
//api/client/create
router.post("/create", AuthMiddleware, CreateUserProfile);

// Update client profile (protected)
//api/client/update
router.patch("/update", AuthMiddleware, UpdateUserProfile);

// Get current user's client profile (protected)
//api/client/get-profile
router.get("/get-profile", AuthMiddleware, GetUserProfile);

// Get all client profiles (public or protected as needed)
//api/client/profiles
router.get("/profiles", GetAllUsersProfiles);

// Get latest 10 client profiles (public or protected as needed)
//api/client/latest
router.get("/latest", GetLatestUsersProfiles);

export default router;