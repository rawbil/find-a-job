import ProfileModel, { IProfile } from "../models/profile.model";
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
      location: data.location,
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
  skills?: string[];
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

    //check if updated email exists
    if (data.email) {
      const isProfileEmailExists = await ProfileModel.findOne({
        email: data.email as string,
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

    //get profile from DB
    const savedProfile = (await ProfileModel.findOne({
      user: userId,
    })) as IProfile;
    if (!savedProfile) {
      return next(new ErrorHandler("Profile not found", 404));
    }

    //update cloudinary image if changed
    if (data.profileImage) {
      if (savedProfile.profileImage?.public_id) {
        try {
          //delete existing image from cloudinary before uploading the new one
          await cloudinary.v2.uploader.destroy(
            savedProfile.profileImage?.public_id
          );

          //add the new image to cloudinary
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

    const updatedProfile = await ProfileModel.findByIdAndUpdate(
      savedProfile._id,
      {
        $set: data,
      },
      { new: true }
    );

    /*
    -$set is used to update only those fields that have changed, instead of the whole body.
    -If not used and you just say `await ProfileModel.findByIdAndUpdate(userId, data, {new: true})`, it will update everything, and the fields not defined will be set to null
    -Another approach is to manually declare the fields that have changed */

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
    const profile = await ProfileModel.findOne({ user: userId });
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
    const profiles = await ProfileModel.find().limit(20);
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
    const profiles = await ProfileModel.find().sort({ updatedAt: -1 }).limit(10);
    if (profiles.length === 0) {
      return next(new ErrorHandler("No Profile to display", 404));
    }

    res.status(200).json({ success: true, profiles });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

//*USER CANNOT DELETE PROFILE, BECAUSE EACH USER NEEDS TO HAVE A PROFILE, IF THEY NO LONGER WANT THEIR PROFILE, THEY CAN JUST DELETE THEIR ACCOUNT
