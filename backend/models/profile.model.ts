import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProfile {
  profileImage: {
    public_id: string;
    url: string;
  };
  name: string;
  location: string;
  skills: string[];
  phoneNumber: string;
  email: string;
}

const profileSchema = new Schema<IProfile>({
  profileImage: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
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
});

const profileModel: Model<IProfile> = mongoose.model("Profile", profileSchema);

export default profileModel;
