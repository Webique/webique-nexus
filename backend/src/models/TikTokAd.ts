import mongoose, { Document, Schema } from 'mongoose';

export interface ITikTokAd extends Document {
  name: string;
  price: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TikTokAdSchema = new Schema<ITikTokAd>({
  name: {
    type: String,
    required: [true, 'TikTok ad name is required'],
    trim: true,
    maxlength: [100, 'TikTok ad name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'TikTok ad price is required'],
    min: [0, 'Price cannot be negative']
  },
  date: {
    type: Date,
    required: [true, 'TikTok ad date is required']
  }
}, {
  timestamps: true
});

// Index for better query performance
TikTokAdSchema.index({ date: -1, createdAt: -1 });
TikTokAdSchema.index({ name: 'text' });

export default mongoose.model<ITikTokAd>('TikTokAd', TikTokAdSchema);
