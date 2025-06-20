import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  // confirmPassword?: string;
  confirmPasswordFunc: (password: string) => Promise<boolean>;
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
      select: false
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
userSchema.methods.comparePasswordFunc = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;
