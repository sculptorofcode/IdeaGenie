import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email?: string;
  joinedAt: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String },
  joinedAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
