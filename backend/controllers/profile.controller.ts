import ProfileModel from "../models/profile.model";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import profileModel from "../models/profile.model";
import validator from "validator";

//!CREATE USER PROFILE
interface ICreateProfile {
  profileImage?:
    | string
    | {
        public_id: string;
        url: string;
      };
  name: string;
  location: string;
  skills: string[];
  phoneNumber: string;
  email: string;
}

export const CreateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body as ICreateProfile;
    const userId = req.user?._id as string;
    //ensure required fields are provided
    if (
      !data.name ||
      !data.location ||
      !data.skills ||
      !data.phoneNumber ||
      !data.email
    ) {
      return next(
        new ErrorHandler(
          "name, location, skills, phone number and email should be provided",
          400
        )
      );
    }

    const isValidEmail = validator.isEmail(data.email);
    if (!isValidEmail) {
      return next(new ErrorHandler("oops... invalid email format", 400));
    }

    //check if profile with similar email exists
    const isEmailExists = await profileModel.findOne({ email: data.email });
    if (isEmailExists) {
      return next(new ErrorHandler("oops...Email already exists", 409));
    }

    //check number length
    if (data.phoneNumber.length !== 10) {
      return next(new ErrorHandler("Phone number should have 10 digits", 400));
    }

    //add Profile image
    const avatar = data.profileImage as string;
    if (avatar) {
      try {
        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "Kazi-Profiles",
        });
        data.profileImage = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }

    const profile = await profileModel.create({
      user: userId,
      name: data.name,
      email: data.email,
      skills: data.skills,
      phoneNumber: data.phoneNumber,
      profileImage: data.profileImage,
      location: data.location
    });
    res.status(201).json({
      success: true,
      message: "Profile Created successfully",
      profile,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

//!UPDATE USER PROFILE
export const UpdateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

//!GET USER PROFILE
export const GetUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

//!GET ALL PROFILES
export const GetAllUsersProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

//*USER CANNOT DELETE PROFILE, BECAUSE EACH USER NEEDS TO HAVE A PROFILE, IF THEY NO LONGER WANT THEIR PROFILE, THEY CAN JUST DELETE THEIR ACCOUNT
