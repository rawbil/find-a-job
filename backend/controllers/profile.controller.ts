import ProfileModel from '../models/profile.model';
import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/ErrorHandler';
import cloudinary from 'cloudinary'

//!CREATE USER PROFILE
export const CreateUserProfile = async(req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
}

//!UPDATE USER PROFILE
export const UpdateUserProfile = async(req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
}

//!GET USER PROFILE
export const GetUserProfile = async(req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
}

//!GET ALL PROFILES
export const GetAllUsersProfile = async(req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
}

//*USER CANNOT DELETE PROFILE, BECAUSE EACH USER NEEDS TO HAVE A PROFILE, IF THEY NO LONGER WANT THEIR PROFILE, THEY CAN JUST DELETE THEIR ACCOUNT