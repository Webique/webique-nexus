import React, { createContext, useContext, useState, useCallback } from 'react';
import { ImportantNote, GeneralNote, DailyTask } from '@/types/notes';
import { useToast } from '@/hooks/use-toast';

interface NotesContextType {
  importantNotes: ImportantNote[];
  generalNotes: GeneralNote[];
  dailyTasks: DailyTask[];
  addImportantNote: (content: string) => void;
  updateImportantNote: (id: string, content: string) => void;
  deleteImportantNote: (id: string) => void;
  addGeneralNote: (content: string) => void;
  updateGeneralNote: (id: string, content: string) => void;
  deleteGeneralNote: (id: string) => void;
  addDailyTask: (content: string, date: string) => void;
  updateDailyTask: (id: string, content: string) => void;
  moveDailyTask: (id: string, newDate: string) => void;
  deleteDailyTask: (id: string) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [importantNotes, setImportantNotes] = useState<ImportantNote[]>([]);
  const [generalNotes, setGeneralNotes] = useState<GeneralNote[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const { toast } = useToast();

  // Important Notes Management
  const addImportantNote = useCallback((content: string) => {
    const newNote: ImportantNote = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setImportantNotes(prev => [...prev, newNote]);
    toast({
      title: "Important Note Added",
      description: "Your important note has been saved.",
    });
  }, [toast]);

  const updateImportantNote = useCallback((id: string, content: string) => {
    setImportantNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, content, updatedAt: new Date().toISOString() }
        : note
    ));
    toast({
      title: "Important Note Updated",
      description: "Your note has been updated successfully.",
    });
  }, [toast]);

  const deleteImportantNote = useCallback((id: string) => {
    setImportantNotes(prev => prev.filter(note => note.id !== id));
    toast({
      title: "Important Note Deleted",
      description: "Your important note has been removed.",
    });
  }, [toast]);

  // General Notes Management
  const addGeneralNote = useCallback((content: string) => {
    const newNote: GeneralNote = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setGeneralNotes(prev => [...prev, newNote]);
    toast({
      title: "General Note Added",
      description: "Your general note has been saved.",
    });
  }, [toast]);

  const updateGeneralNote = useCallback((id: string, content: string) => {
    setGeneralNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, content, updatedAt: new Date().toISOString() }
        : note
    ));
    toast({
      title: "General Note Updated",
      description: "Your note has been updated successfully.",
    });
  }, [toast]);

  const deleteGeneralNote = useCallback((id: string) => {
    setGeneralNotes(prev => prev.filter(note => note.id !== id));
    toast({
      title: "General Note Deleted",
      description: "Your general note has been removed.",
    });
  }, [toast]);

  // Daily Tasks Management
  const addDailyTask = useCallback((content: string, date: string) => {
    const newTask: DailyTask = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      content,
      date,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDailyTasks(prev => [...prev, newTask]);
    toast({
      title: "Task Added",
      description: `Task added for ${new Date(date).toLocaleDateString()}.`,
    });
  }, [toast]);

  const updateDailyTask = useCallback((id: string, content: string) => {
    setDailyTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, content, updatedAt: new Date().toISOString() }
        : task
    ));
    toast({
      title: "Task Updated",
      description: "Your task has been updated successfully.",
    });
  }, [toast]);

  const moveDailyTask = useCallback((id: string, newDate: string) => {
    setDailyTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, date: newDate, updatedAt: new Date().toISOString() }
        : task
    ));
    toast({
      title: "Task Moved",
      description: `Task moved to ${new Date(newDate).toLocaleDateString()}.`,
    });
  }, [toast]);

  const deleteDailyTask = useCallback((id: string) => {
    setDailyTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Task Deleted",
      description: "Your task has been removed.",
    });
  }, [toast]);

  const value: NotesContextType = {
    importantNotes,
    generalNotes,
    dailyTasks,
    addImportantNote,
    updateImportantNote,
    deleteImportantNote,
    addGeneralNote,
    updateGeneralNote,
    deleteGeneralNote,
    addDailyTask,
    updateDailyTask,
    moveDailyTask,
    deleteDailyTask,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};
