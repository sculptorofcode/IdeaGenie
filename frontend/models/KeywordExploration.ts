import mongoose, { Document, Schema } from 'mongoose';

// TypeScript interfaces
export interface ITrend {
  month: string;
  year: number;
  searches: number;
}

export interface ISubKeyword {
  keyword: string;
  volume: number;
  cpc: number;
  intent: string;
  competition: string;
  trend: ITrend[];
}

export interface IKeywordExploration extends Document {
  userId: mongoose.Types.ObjectId;
  mainKeyword: string;
  country: string;
  createdAt: Date;
  subkeywords: ISubKeyword[];
  sourcesScraped: string[]; // e.g. ['reddit', 'x', 'devto']
  completed: boolean;
}

// Mongoose schemas
const TrendSchema: Schema<ITrend> = new mongoose.Schema({
  month: { type: String, required: true },
  year: { type: Number, required: true },
  searches: { type: Number, required: true },
}, { _id: false });

const SubKeywordSchema: Schema<ISubKeyword> = new mongoose.Schema({
  keyword: { type: String, required: true },
  volume: { type: Number, required: true },
  cpc: { type: Number, required: true },
  intent: { type: String, required: true },
  competition: { type: String, required: true },
  trend: [TrendSchema],
}, { _id: false });

const keywordExplorationSchema: Schema<IKeywordExploration> = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mainKeyword: { type: String, required: true },
  country: { type: String, default: 'en-US' },
  createdAt: { type: Date, default: Date.now },
  subkeywords: [SubKeywordSchema],
  sourcesScraped: [String], // e.g. ['reddit', 'x', 'devto']
  completed: { type: Boolean, default: false },
});

export default mongoose.models.KeywordExploration || mongoose.model<IKeywordExploration>('KeywordExploration', keywordExplorationSchema);
