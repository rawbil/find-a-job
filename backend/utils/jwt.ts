import { Response } from "express";
import { IUser } from "../models/user.model";
require("dotenv").config();

interface ITokenOptions {
  maxAge: number;
  expires: Date;
  secure: boolean;
  httpOnly: boolean;
  sameSite: boolean | "lax" | "strict" | "none" | undefined;
}
export const accessTokenExpires = parseInt(
  process.env.ACCESS_TOKEN_EXPIRES || "60"
); //60m

export const refreshTokenExpires = parseInt(
  process.env.REFRESH_TOKEN_EXPIRES || "7"
); //7d

export const accessTokenOptions = {
  expires: new Date(Date.now() + accessTokenExpires * 60 * 1000),
  maxAge: accessTokenExpires * 60 * 1000,
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: "lax",
} as ITokenOptions;

export const refreshTokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpires * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpires * 24 * 60 * 60 * 1000,
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: "lax",
} as ITokenOptions;

//main function
export default async function CreateCookies(res: Response, user: IUser) {
  const access_token = await user.generateAccessToken();
  const refresh_token = await user.generateRefreshToken();

  //cookies
  res.cookie("access_token", access_token, accessTokenOptions);
  res.cookie("refresh_token", refresh_token, refreshTokenOptions);

  res
    .status(200)
    .json({
      success: true,
      user,
      access_token,
      refresh_token,
      message: "Login successful!!",
    });
}
