import mongoose, { Document, Schema } from 'mongoose';

export interface IImportantNote extends Document {
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDailyTask extends Document {
  content: string;
  date: Date;
  completed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGeneralNote extends Document {
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const ImportantNoteSchema = new Schema<IImportantNote>({
  content: {
    type: String,
    required: [true, 'Note content is required'],
    trim: true,
    maxlength: [2000, 'Note content cannot exceed 2000 characters']
  }
}, {
  timestamps: true
});

const DailyTaskSchema = new Schema<IDailyTask>({
  content: {
    type: String,
    required: [true, 'Task content is required'],
    trim: true,
    maxlength: [1000, 'Task content cannot exceed 1000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Task date is required']
  },
  completed: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

const GeneralNoteSchema = new Schema<IGeneralNote>({
  content: {
    type: String,
    required: [true, 'Note content is required'],
    trim: true,
    maxlength: [2000, 'Note content cannot exceed 2000 characters']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
ImportantNoteSchema.index({ createdAt: -1 });
DailyTaskSchema.index({ date: -1, createdAt: -1 });
GeneralNoteSchema.index({ createdAt: -1 });

export const ImportantNote = mongoose.model<IImportantNote>('ImportantNote', ImportantNoteSchema);
export const DailyTask = mongoose.model<IDailyTask>('DailyTask', DailyTaskSchema);
export const GeneralNote = mongoose.model<IGeneralNote>('GeneralNote', GeneralNoteSchema);
