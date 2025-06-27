import { NextFunction, Request, Response } from 'express';
import userModel from '../models/user.model';
import { IUser } from '../models/user.model';
import ErrorHandler from '../utils/ErrorHandler';
import validator from 'validator';

//!GET USER BY ID
export const GetUserById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id as string;
        const user = await userModel.findById(userId);
        if(!user) {
            return next(new ErrorHandler("User not found. Try logging in again", 404));
        }

        res.status(200).json({success: true, user});
        
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
}

//!UPDATE USER BY ID
export const UpdateUserById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const userId = req.user?._id as string;

        const user = await userModel.findById(userId);
          if(!user) {
            return next(new ErrorHandler("User not found. Try logging in again", 404));
        }

        if(data.email) {
            const validatedEmail = validator.isEmail(data.email);
            if(!validatedEmail) {
                return next(new ErrorHandler("Invalid email format", 400))
            }
            //ensure email does not already exist
            const emailExists = await userModel.findOne({email: data.email});
            if(emailExists) {
                return next(new ErrorHandler("Email already exists", 409));
            }
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            user._id,
            { $set: data },
            { new: true }
        );

        res.status(200).json({success: true, updatedUser, message: "Success"})


    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
}

//!DELETE USER BY ID
export const DeleteUserById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {password} = req.body;
        const userId = req.user?._id as string;
        const user = await userModel.findById(userId).select("+password");
        if(!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        //compare passwords
        const comparePasswords = await user.comparePasswords(password);
        if(!comparePasswords) {
            return next(new ErrorHandler("Incorrect Password", 400));
        }

        await userModel.findByIdAndDelete(user._id);

        res.status(200).json({success: true, message: "User deleted"})
        
         
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
}