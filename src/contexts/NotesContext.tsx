import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ImportantNote, GeneralNote, DailyTask } from '@/types/notes';
import { useToast } from '@/hooks/use-toast';
import ApiService from '@/services/api';

interface NotesContextType {
  importantNotes: ImportantNote[];
  generalNotes: GeneralNote[];
  dailyTasks: DailyTask[];
  loading: boolean;
  addImportantNote: (content: string) => Promise<void>;
  updateImportantNote: (id: string, content: string) => Promise<void>;
  deleteImportantNote: (id: string) => Promise<void>;
  addGeneralNote: (content: string) => Promise<void>;
  updateGeneralNote: (id: string, content: string) => Promise<void>;
  deleteGeneralNote: (id: string) => Promise<void>;
  addDailyTask: (content: string, date: string) => Promise<void>;
  updateDailyTask: (id: string, content: string) => Promise<void>;
  moveDailyTask: (id: string, newDate: string) => Promise<void>;
  deleteDailyTask: (id: string) => Promise<void>;
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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load notes from API on component mount
  useEffect(() => {
    loadImportantNotes();
    loadGeneralNotes();
    loadDailyTasks();
  }, []);

  const loadImportantNotes = useCallback(async () => {
    try {
      const response = await ApiService.getImportantNotes();
      setImportantNotes(response.data || []);
    } catch (error) {
      console.error('Failed to load important notes:', error);
    }
  }, []);

  const loadGeneralNotes = useCallback(async () => {
    try {
      const response = await ApiService.getGeneralNotes();
      setGeneralNotes(response.data || []);
    } catch (error) {
      console.error('Failed to load general notes:', error);
    }
  }, []);

  const loadDailyTasks = useCallback(async () => {
    try {
      const response = await ApiService.getDailyTasks();
      setDailyTasks(response.data || []);
    } catch (error) {
      console.error('Failed to load daily tasks:', error);
    }
  }, []);

  // Important Notes Management
  const addImportantNote = useCallback(async (content: string) => {
    try {
      setLoading(true);
      const response = await ApiService.createImportantNote({ content });
      setImportantNotes(prev => [...prev, response]);
      toast({
        title: "Important Note Added",
        description: "Your important note has been saved.",
      });
    } catch (error) {
      console.error('Failed to add important note:', error);
      toast({
        title: "Error",
        description: "Failed to add important note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateImportantNote = useCallback(async (id: string, content: string) => {
    try {
      setLoading(true);
      const response = await ApiService.updateImportantNote(id, { content });
      setImportantNotes(prev => prev.map(note => 
        note.id === id ? response : note
      ));
      toast({
        title: "Important Note Updated",
        description: "Your note has been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to update important note:', error);
      toast({
        title: "Error",
        description: "Failed to update important note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteImportantNote = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await ApiService.deleteImportantNote(id);
      setImportantNotes(prev => prev.filter(note => note.id !== id));
      toast({
        title: "Important Note Deleted",
        description: "Your important note has been removed.",
      });
    } catch (error) {
      console.error('Failed to delete important note:', error);
      toast({
        title: "Error",
        description: "Failed to delete important note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // General Notes Management
  const addGeneralNote = useCallback(async (content: string) => {
    try {
      setLoading(true);
      const response = await ApiService.createGeneralNote({ content });
      setGeneralNotes(prev => [...prev, response]);
      toast({
        title: "General Note Added",
        description: "Your general note has been saved.",
      });
    } catch (error) {
      console.error('Failed to add general note:', error);
      toast({
        title: "Error",
        description: "Failed to add general note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateGeneralNote = useCallback(async (id: string, content: string) => {
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
    loading,
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
