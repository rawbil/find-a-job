import mongoose, { Schema, Document, Model} from 'mongoose';

export interface IProfile extends Document {

}

const profileSchema = new Schema<IProfile>({

});

const profileModel: Model<IProfile> = mongoose.model("Profile", profileSchema );

export default profileModel;