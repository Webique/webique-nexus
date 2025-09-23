export interface ImportantNote {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyTask {
  id: string;
  content: string;
  date: string; // ISO date string (YYYY-MM-DD)
  completed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GeneralNote {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotesState {
  importantNotes: ImportantNote[];
  generalNotes: GeneralNote[];
  dailyTasks: DailyTask[];
}
