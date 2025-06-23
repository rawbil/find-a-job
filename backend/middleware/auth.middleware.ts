import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from 'jsonwebtoken';
import userModel, { IUser } from "../models/user.model";

export default async function AuthMiddleware(req: Request, res: Response, next: NextFunction){
    try {
        const accessToken = req.cookies.access_token;
        if(!accessToken) {
            return next(new ErrorHandler("Session not found. Please login again", 401));
        }

        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
        if(!decoded) {
            return next(new ErrorHandler("Authentication failed. Please login again", 401));
        }

        const user = await userModel.findById(decoded.id) as IUser;
        if(!user) {
            return next(new ErrorHandler("Authenticated user not found. Please login again", 401));
        }

        req.user = user;
        next()
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
}