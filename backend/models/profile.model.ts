import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProfile extends Document {
  user: mongoose.Types.ObjectId;
  profileImage?: {
    public_id: string;
    url: string;
  };
  name: string;
  location: string;
  skills: string[];
  phoneNumber: string;
  email: string;
}

const profileSchema = new Schema<IProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    profileImage: {
      public_id: { type: String},
      url: { type: String},
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const profileModel: Model<IProfile> = mongoose.model("Profile", profileSchema);

export default profileModel;
