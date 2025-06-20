import mongoose from "mongoose";
require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI as string;

export default async function ConnectDb() {
  try {
  mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log(`Database connected: ${mongoose.connection.host}`))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); 
  });
  } catch (error: any) {
    console.log(error);
  }
}
