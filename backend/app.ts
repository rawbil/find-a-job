import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
export const app = express();
import cors from 'cors';
require('dotenv').config()

//body-parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie-parser
app.use(cookieParser());

//cors config
const corsOptions = {
    origin: process.env.ORIGIN
}
app.use(cors(corsOptions));

//test route
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({success: true, message: "API working correctly"});
})