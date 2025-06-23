import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClientProfile extends Document {
  user: mongoose.Types.ObjectId;
  profileImage?: {
    public_id: string;
    url: string;
  };
  name: string;
  location: string;
  services: string[],
  preferredTime: Date | string,
  description: string,
  budget: string,
  phoneNumber: string;
  email: string;
}

const clientSchema = new Schema<IClientProfile>(
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
    services: {
      type: [String],
      required: true,
    },
    preferredTime: {
        type: Schema.Types.Mixed,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    budget: {
        type: String,
        required: true
    }
  },
  { timestamps: true }
);

const clientModel: Model<IClientProfile> = mongoose.model("ClientPost", clientSchema);

export default clientModel;
