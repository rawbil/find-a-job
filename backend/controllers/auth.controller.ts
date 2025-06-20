import { NextFunction, Request, Response } from "express";
import userModel from "../models/user.model";
import { IUser } from "../models/user.model";
import validator from "validator";
import bcrypt from "bcryptjs";
import ErrorHandler from "../utils/ErrorHandler";
import CreateCookies from "../utils/jwt";

//!REGISTER

interface IRegisterUser {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fullName, email, password, confirmPassword } =
      req.body as IRegisterUser;
    //check if all the inputs are provided
    if (!fullName || !email || !password || !confirmPassword) {
      //return (res.status(400).json({success: false, message: "Please provide all the inputs"}));
      return next(new ErrorHandler("Please provide all the inputs", 400));
    }

    //validate email
    const validatedEmail = validator.isEmail(email);
    if (!validatedEmail) {
      /// return res.status(400).json({success: false, message: "Invalid email format"});
      return next(new ErrorHandler("oops... invalid email format", 400));
    }

    //validate password
    const validatePassword = validator.isStrongPassword(password);
    if (!validatePassword) {
      // return res.status(400).json({success: false, message: "Password should have at least 8 charactes, one uppercase letter, one lowercase letter and one special character"});
      return next(
        new ErrorHandler(
          "Password should have at least 8 charactes, one uppercase letter, one lowercase letter and one special character",
          400
        )
      );
    }

    //check if users already exists
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      //  return res.status(409).json({success: false, message: "oops...email already taken"});
      return next(new ErrorHandler("oops... email already taken", 409));
    }

    //check if confirmPassword matches password
    if (confirmPassword !== password) {
      // return res.status(400).json({success: false, message: "Passwords do not match"});
      return next(new ErrorHandler("Passwords do not match", 400));
    }

    //hash confirm password
    // const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 12);

    /* const user = */ await userModel.create({
      fullName,
      email,
      password,
      // confirmPassword: hashedConfirmPassword, -Do not add confirm password to DB
    });

    const savedUser = await userModel.findOne({ email }).select("-password");

    res.status(201).json({ success: true, savedUser });
  } catch (error: any) {
    //  res.status(500).json({success: false, message: error.message})
    return next(new ErrorHandler(error.message, 500));
  }
};

//!LOGIN
interface ILoginUser {
  email: string;
  password: string;
}

export const LoginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as ILoginUser;
    //avoid null fields
    if (!email || !password) {
      return next(new ErrorHandler("Please provide all the inputs", 400));
    }

    //check for user with email
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid credentials", 400));
    }

    //compare passwords
    const isPassCorrect = await user.comparePasswords(password);
    if (!isPassCorrect) {
      return next(new ErrorHandler("Invalid credentials", 400));
    }

    try {
      await CreateCookies(res, user);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

//!CHANGE PASSWORD
interface IPassword {
  oldPassword: string;
  newPassword: string;
}
export const updateUserPass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { oldPassword, newPassword } = req.body as IPassword;
    const userId = req.user?._id;
    const user = await userModel.findById(userId).select("+password");
    if (!user) {
      return next(new ErrorHandler("User not found. Please login", 401));
    }

    //ensure both fields are provided
    if (!oldPassword || !newPassword) {
      return next(
        new ErrorHandler("Please provide both old and new password", 400)
      );
    }

    //compare old password with user password
    const isPasswordCorrect = await user.comparePasswords(oldPassword);
    if (!isPasswordCorrect) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }

    //ensure newpassword is different from old password
    if (oldPassword === newPassword) {
      return next(
        new ErrorHandler(
          "New Password should be different from old password",
          409
        )
      );
    }

    user.password = newPassword;
    await user?.save();
    // Clear the tokens for user to login again
    // res.cookie("access_token", "", { maxAge: 1 });
    // res.cookie("refresh_token", "", { maxAge: 1 });

    res.status(200).json({
      success: true,
      user,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
};

//!RESET PASSWORD

//!LOGOUT
export const LogoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id as string;
    const user = await userModel.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found. Please login again", 401));
    }

    //clear cookies
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });

    res
      .status(200)
      .json({ success: true, message: "Logged out successfully!" });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};
