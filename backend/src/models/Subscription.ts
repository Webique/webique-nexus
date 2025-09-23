import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  name: string;
  price: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  name: {
    type: String,
    required: [true, 'Subscription name is required'],
    trim: true,
    maxlength: [100, 'Subscription name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Subscription price is required'],
    min: [0, 'Price cannot be negative']
  },
  date: {
    type: Date,
    required: [true, 'Subscription date is required']
  }
}, {
  timestamps: true
});

// Index for better query performance
SubscriptionSchema.index({ date: -1, createdAt: -1 });
SubscriptionSchema.index({ name: 'text' });

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
