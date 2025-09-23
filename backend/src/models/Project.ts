import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  name: string;
  phoneNumber: string;
  notes?: string;
  instagram?: string;
  websiteLink?: string;
  totalAmount?: number;
  amountReceived?: number;
  remainingAmount?: number;
  finishedDate?: Date;
  domainCost?: number;
  additionalCosts?: number;
  additionalCostReason?: string;
  freelancerManagerFees?: number;
  freelancerFees?: number;
  label?: 'In-House' | 'Freelancer';
  status: 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  instagram: {
    type: String,
    trim: true,
    maxlength: [100, 'Instagram handle cannot exceed 100 characters']
  },
  websiteLink: {
    type: String,
    trim: true,
    maxlength: [500, 'Website link cannot exceed 500 characters']
  },
  totalAmount: {
    type: Number,
    min: [0, 'Total amount cannot be negative']
  },
  amountReceived: {
    type: Number,
    min: [0, 'Amount received cannot be negative']
  },
  remainingAmount: {
    type: Number,
    min: [0, 'Remaining amount cannot be negative']
  },
  finishedDate: {
    type: Date
  },
  domainCost: {
    type: Number,
    min: [0, 'Domain cost cannot be negative']
  },
  additionalCosts: {
    type: Number,
    min: [0, 'Additional costs cannot be negative']
  },
  additionalCostReason: {
    type: String,
    trim: true,
    maxlength: [200, 'Additional cost reason cannot exceed 200 characters']
  },
  freelancerManagerFees: {
    type: Number,
    min: [0, 'Freelancer manager fees cannot be negative']
  },
  freelancerFees: {
    type: Number,
    min: [0, 'Freelancer fees cannot be negative']
  },
  label: {
    type: String,
    enum: ['In-House', 'Freelancer'],
    default: 'In-House'
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Calculate remaining amount before saving
ProjectSchema.pre('save', function(next) {
  if (this.totalAmount && this.amountReceived) {
    this.remainingAmount = this.totalAmount - this.amountReceived;
  }
  next();
});

// Index for better query performance
ProjectSchema.index({ status: 1, createdAt: -1 });
ProjectSchema.index({ name: 'text', notes: 'text' });

export = mongoose.model<IProject>('Project', ProjectSchema);
