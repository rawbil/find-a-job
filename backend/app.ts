import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
export const app = express();
import cors from 'cors';
require('dotenv').config();
import AuthRoute from './routes/auth.route';
import ProfileRoute from './routes/profile.route';
import ClientRoute from './routes/client.route';
import UserRoute from './routes/user.route'

//body-parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie-parser
app.use(cookieParser());

//cors config
const corsOptions = {
    origin: process.env.ORIGIN || "*",
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
};
app.use(cors(corsOptions));

app.use('/api/auth', AuthRoute);
app.use('/api/profile', ProfileRoute);
app.use('/api/client', ClientRoute);
app.use('/api/users', UserRoute);;

//test route
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({success: true, message: "API working correctly"});
})

//unknown routes
app.use(/.*/, (req: Request, res: Response, next: NextFunction)=> {
   // res.status(404).json({success: false, message: `The route: '${req.originalUrl}' does not exist`});
   const error = new Error(`The route '${req.originalUrl} does not exist'`) as any;
   error.statusCode = 404;
   next(error);
})


app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    res.status(error.statusCode).json({success: false, message: error.message});
})
