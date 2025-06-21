import mongoose, { Document, Schema } from 'mongoose';

// TypeScript interfaces
export interface IPost {
  body: string;
  comments: string[];
  likes: number;
  postUrl: string;
}

export interface ISourceData extends Document {
  explorationId: mongoose.Types.ObjectId;
  source: string; // 'reddit', 'x', 'devto'
  keyword: string;
  fetchedAt: Date;
  data: IPost[];
}

const PostSchema: Schema<IPost> = new mongoose.Schema({
  body: { type: String, required: true },
  comments: [String],
  likes: { type: Number, required: true },
  postUrl: { type: String, required: true },
}, { _id: false });

const sourceDataSchema: Schema<ISourceData> = new mongoose.Schema({
  explorationId: { type: mongoose.Schema.Types.ObjectId, ref: 'KeywordExploration', required: true },
  source: { type: String, required: true }, // 'reddit', 'x', 'devto'
  keyword: { type: String, required: true },
  fetchedAt: { type: Date, default: Date.now },
  data: [PostSchema],
});

export default mongoose.models.SourceData || mongoose.model<ISourceData>('SourceData', sourceDataSchema);
