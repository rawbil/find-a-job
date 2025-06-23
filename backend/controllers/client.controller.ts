import clientModel, { IClientProfile } from "../models/client.job-post";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
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
  services: string[];
  preferredTime: Date | string;
  description: string;
  budget: string;
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

    // Ensure required fields are provided
    if (
      !data.name ||
      !data.location ||
      !data.services ||
      !Array.isArray(data.services) ||
      data.services.length === 0 ||
      !data.preferredTime ||
      !data.description ||
      !data.budget ||
      !data.phoneNumber ||
      !data.email
    ) {
      return next(
        new ErrorHandler(
          "name, location, services, preferredTime, description, budget, phone number and email should be provided",
          400
        )
      );
    }

    const isValidEmail = validator.isEmail(data.email);
    if (!isValidEmail) {
      return next(new ErrorHandler("oops... invalid email format", 400));
    }

    // Check if profile with similar email exists
    const isEmailExists = await clientModel.findOne({ email: data.email });
    if (isEmailExists) {
      return next(new ErrorHandler("oops...Email already exists", 409));
    }

    // Check number length
    if (data.phoneNumber.length !== 10) {
      return next(new ErrorHandler("Phone number should have 10 digits", 400));
    }

    // Add Profile image
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

    const profile = await clientModel.create({
      user: userId,
      name: data.name,
      email: data.email,
      location: data.location,
      phoneNumber: data.phoneNumber,
      services: data.services,
      preferredTime: data.preferredTime,
      description: data.description,
      budget: data.budget,
      profileImage: data.profileImage,
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
interface IUpdateProfile {
  profileImage?:
    | string
    | {
        public_id: string;
        url: string;
      };
  name?: string;
  location?: string;
  services?: string[];
  preferredTime?: Date | string;
  description?: string;
  budget?: string;
  phoneNumber?: string;
  email?: string;
}

export const UpdateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body as IUpdateProfile;
    const userId = req.user?._id as string;

    // Check if updated email exists (and is not the current user's email)
    if (data.email) {
      const isProfileEmailExists = await clientModel.findOne({
        email: data.email as string,
        user: { $ne: userId },
      });
      if (isProfileEmailExists) {
        return next(
          new ErrorHandler(
            "Another profile with this email exists, can you provide a different one?",
            409
          )
        );
      }
    }

    // Get profile from DB
    const savedProfile = (await clientModel.findOne({
      user: userId,
    })) as IClientProfile;
    if (!savedProfile) {
      return next(new ErrorHandler("Profile not found", 404));
    }

    // Update cloudinary image if changed
    if (data.profileImage) {
      if (savedProfile.profileImage?.public_id) {
        try {
          // Delete existing image from cloudinary before uploading the new one
          await cloudinary.v2.uploader.destroy(
            savedProfile.profileImage?.public_id
          );

          // Add the new image to cloudinary
          const myCloud = await cloudinary.v2.uploader.upload(
            data.profileImage as string,
            {
              folder: "Kazi-Profiles",
            }
          );
          data.profileImage = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      } else {
        try {
          const myCloud = await cloudinary.v2.uploader.upload(
            data.profileImage as string,
            {
              folder: "Kazi-Profiles",
            }
          );
          data.profileImage = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }
    }

    const updatedProfile = await clientModel.findByIdAndUpdate(
      savedProfile._id,
      {
        $set: data,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      updatedProfile,
      message: "Profile updated successfully",
    });
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
    const userId = req.user?._id as string;
    const profile = await clientModel.findOne({ user: userId });
    if (!profile) {
      return next(new ErrorHandler("Profile not found", 404));
    }

    res.status(200).json({ success: true, profile });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

//!GET ALL PROFILES
export const GetAllUsersProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const profiles = await clientModel.find().limit(20);
    if (profiles.length === 0) {
      return next(new ErrorHandler("No Profile to display", 404));
    }

    res.status(200).json({ success: true, profiles });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

//!GET THE LAST 10 PROFILES
export const GetLatestUsersProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const profiles = await clientModel.find().sort({ updatedAt: -1 }).limit(10);
    if (profiles.length === 0) {
      return next(new ErrorHandler("No Profile to display", 404));
    }

    res.status(200).json({ success: true, profiles });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};