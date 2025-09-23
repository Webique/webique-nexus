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
  toggleDailyTaskCompleted: (id: string, completed: boolean) => Promise<void>;
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

  // Normalize MongoDB documents to frontend types
  const normalizeImportantNote = (doc: any): ImportantNote => ({
    id: doc.id || doc._id,
    content: doc.content,
    createdAt: doc.createdAt || new Date().toISOString(),
    updatedAt: doc.updatedAt || new Date().toISOString(),
  });

  const normalizeGeneralNote = (doc: any): GeneralNote => ({
    id: doc.id || doc._id,
    content: doc.content,
    createdAt: doc.createdAt || new Date().toISOString(),
    updatedAt: doc.updatedAt || new Date().toISOString(),
  });

  const normalizeDailyTask = (doc: any): DailyTask => ({
    id: doc.id || doc._id,
    content: doc.content,
    date: doc.date ? new Date(doc.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    // @ts-ignore allow completed extension at runtime
    completed: !!doc.completed,
    createdAt: doc.createdAt || new Date().toISOString(),
    updatedAt: doc.updatedAt || new Date().toISOString(),
  });

  // Load notes from API on component mount
  useEffect(() => {
    loadImportantNotes();
    loadGeneralNotes();
    loadDailyTasks();
  }, []);

  const loadImportantNotes = useCallback(async () => {
    try {
      const response = await ApiService.getImportantNotes();
      const items = Array.isArray(response) ? response : Array.isArray((response as any)?.data) ? (response as any).data : [];
      setImportantNotes(items.map(normalizeImportantNote));
    } catch (error) {
      console.error('Failed to load important notes:', error);
    }
  }, []);

  const loadGeneralNotes = useCallback(async () => {
    try {
      const response = await ApiService.getGeneralNotes();
      const items = Array.isArray(response) ? response : Array.isArray((response as any)?.data) ? (response as any).data : [];
      setGeneralNotes(items.map(normalizeGeneralNote));
    } catch (error) {
      console.error('Failed to load general notes:', error);
    }
  }, []);

  const loadDailyTasks = useCallback(async () => {
    try {
      const response = await ApiService.getDailyTasks();
      const items = Array.isArray(response) ? response : Array.isArray((response as any)?.data) ? (response as any).data : [];
      setDailyTasks(items.map(normalizeDailyTask));
    } catch (error) {
      console.error('Failed to load daily tasks:', error);
    }
  }, []);

  // Important Notes Management
  const addImportantNote = useCallback(async (content: string) => {
    try {
      setLoading(true);
      const response = await ApiService.createImportantNote({ content });
      const created = normalizeImportantNote(response);
      setImportantNotes(prev => [...prev, created]);
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
      const updated = normalizeImportantNote(response);
      setImportantNotes(prev => prev.map(note => 
        note.id === id ? updated : note
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
      const created = normalizeGeneralNote(response);
      setGeneralNotes(prev => [...prev, created]);
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
    try {
      setLoading(true);
      const response = await ApiService.updateGeneralNote(id, { content });
      const updated = normalizeGeneralNote(response);
      setGeneralNotes(prev => prev.map(note => 
        note.id === id ? updated : note
      ));
      toast({
        title: "General Note Updated",
        description: "Your note has been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to update general note:', error);
      toast({
        title: "Error",
        description: "Failed to update general note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteGeneralNote = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await ApiService.deleteGeneralNote(id);
      setGeneralNotes(prev => prev.filter(note => note.id !== id));
      toast({
        title: "General Note Deleted",
        description: "Your general note has been removed.",
      });
    } catch (error) {
      console.error('Failed to delete general note:', error);
      toast({
        title: "Error",
        description: "Failed to delete general note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Daily Tasks Management
  const addDailyTask = useCallback(async (content: string, date: string) => {
    try {
      setLoading(true);
      const response = await ApiService.createDailyTask({ content, date });
      const created = normalizeDailyTask(response);
      setDailyTasks(prev => [...prev, created]);
      toast({
        title: "Task Added",
        description: `Task added for ${new Date(date).toLocaleDateString()}.`,
      });
    } catch (error) {
      console.error('Failed to add daily task:', error);
      toast({
        title: "Error",
        description: "Failed to add daily task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateDailyTask = useCallback(async (id: string, content: string) => {
    try {
      setLoading(true);
      const task = dailyTasks.find(t => t.id === id);
      if (!task) return;
      const response = await ApiService.updateDailyTask(id, { content, date: task.date });
      const updated = normalizeDailyTask(response);
      setDailyTasks(prev => prev.map(t => t.id === id ? updated : t));
      toast({
        title: "Task Updated",
        description: "Your task has been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to update daily task:', error);
      toast({
        title: "Error",
        description: "Failed to update daily task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [dailyTasks, toast]);

  const toggleDailyTaskCompleted = useCallback(async (id: string, completed: boolean) => {
    try {
      setLoading(true);
      const response = await ApiService.toggleDailyTaskComplete(id, completed);
      const updated = normalizeDailyTask(response);
      setDailyTasks(prev => prev.map(t => t.id === id ? updated : t));
    } catch (error) {
      console.error('Failed to toggle task:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const moveDailyTask = useCallback(async (id: string, newDate: string) => {
    try {
      setLoading(true);
      const task = dailyTasks.find(t => t.id === id);
      if (!task) return;
      const response = await ApiService.updateDailyTask(id, { content: task.content, date: newDate });
      const updated = normalizeDailyTask(response);
      setDailyTasks(prev => prev.map(t => t.id === id ? updated : t));
      toast({
        title: "Task Moved",
        description: `Task moved to ${new Date(newDate).toLocaleDateString()}.`,
      });
    } catch (error) {
      console.error('Failed to move daily task:', error);
      toast({
        title: "Error",
        description: "Failed to move daily task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [dailyTasks, toast]);

  const deleteDailyTask = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await ApiService.deleteDailyTask(id);
      setDailyTasks(prev => prev.filter(task => task.id !== id));
      toast({
        title: "Task Deleted",
        description: "Your task has been removed.",
      });
    } catch (error) {
      console.error('Failed to delete daily task:', error);
      toast({
        title: "Error",
        description: "Failed to delete daily task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
    toggleDailyTaskCompleted,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};
