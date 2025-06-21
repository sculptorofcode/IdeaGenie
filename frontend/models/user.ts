import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  civicUserId: string;
  username: string;
  email?: string;
  joinedAt: Date;
  lastLogin?: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  civicUserId: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true },
  email: { type: String },
  joinedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
});

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
