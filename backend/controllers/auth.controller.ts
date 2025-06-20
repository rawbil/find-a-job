import { NextFunction, Request, Response } from "express";
import userModel from "../models/user.model";
import { IUser } from "../models/user.model";
import validator from "validator";
import bcrypt from "bcryptjs";
import ErrorHandler from "../utils/ErrorHandler";

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
    email: string,
    password: string
}

export const LoginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {email, password} = req.body as ILoginUser;
    //avoid null fields
    if(!email || !password) {
        return next(new ErrorHandler("Please provide all the inputs", 400));
    }

    //check for user with email
    const user = await userModel.findOne({email});
    if(!user) {
        return next(new ErrorHandler("Invalid credentials", 400))
    }

    //compare passwords
    const isPassCorrect = await user.confirmPasswordFunc(password);
    if(!isPassCorrect) {
        return next(new ErrorHandler("Invalid credentials", 400));
    }

    

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//!LOGOUT
export const LogoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
