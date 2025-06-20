import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  // confirmPassword?: string;
  comparePasswords: (password: string) => Promise<boolean>;
  generateAccessToken: () => Promise<string>;
  generateRefreshToken: () => Promise<string>;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    select: false,
    },
    // confirmPassword: {
    //   type: String,
    // },
  },
  { timestamps: true }
);

//hash password
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//compare passwords
userSchema.methods.comparePasswords = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

//generate access and refresh tokens
userSchema.methods.generateAccessToken = async function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "1h",
  });
};

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;
