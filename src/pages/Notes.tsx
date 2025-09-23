import { useState, useMemo } from "react";
import { useNotes } from "@/contexts/NotesContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  Calendar,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  FileText,
  ChevronDown,
  ChevronRight as ChevronRightIcon
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Notes = () => {
  const {
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
  } = useNotes();

  // Date navigation state
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  });

  const [generalNotesOpen, setGeneralNotesOpen] = useState(false);
  const [showAddImportantNote, setShowAddImportantNote] = useState(false);
  const [showAddGeneralNote, setShowAddGeneralNote] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingImportantNote, setEditingImportantNote] = useState<string | null>(null);
  const [editingGeneralNote, setEditingGeneralNote] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [deletingImportantNote, setDeletingImportantNote] = useState<string | null>(null);
  const [deletingGeneralNote, setDeletingGeneralNote] = useState<string | null>(null);
  const [deletingTask, setDeletingTask] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  // Form states
  const [importantNoteContent, setImportantNoteContent] = useState("");
  const [generalNoteContent, setGeneralNoteContent] = useState("");
  const [taskContent, setTaskContent] = useState("");

  // Date navigation functions
  const goToPreviousDay = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const goToNextDay = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  };

  // Get dates for the three columns
  const getDateForColumn = (offset: number) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + offset);
    return date;
  };

  const yesterday = getDateForColumn(-1);
  const today = getDateForColumn(0);
  const tomorrow = getDateForColumn(1);

  // Format date for display and storage
  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateForStorage = (date: Date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    const dateString = formatDateForStorage(date);
    return dailyTasks.filter(task => task.date === dateString);
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleAddImportantNote = () => {
    if (importantNoteContent.trim()) {
      addImportantNote(importantNoteContent.trim());
      setImportantNoteContent("");
      setShowAddImportantNote(false);
    }
  };

  const handleUpdateImportantNote = () => {
    if (importantNoteContent.trim() && editingImportantNote) {
      updateImportantNote(editingImportantNote, importantNoteContent.trim());
      setImportantNoteContent("");
      setEditingImportantNote(null);
    }
  };

  const handleAddGeneralNote = () => {
    if (generalNoteContent.trim()) {
      addGeneralNote(generalNoteContent.trim());
      setGeneralNoteContent("");
      setShowAddGeneralNote(false);
    }
  };

  const handleUpdateGeneralNote = () => {
    if (generalNoteContent.trim() && editingGeneralNote) {
      updateGeneralNote(editingGeneralNote, generalNoteContent.trim());
      setGeneralNoteContent("");
      setEditingGeneralNote(null);
    }
  };

  const handleAddTask = (targetDate: Date) => {
    if (taskContent.trim()) {
      addDailyTask(taskContent.trim(), formatDateForStorage(targetDate));
      setTaskContent("");
      setShowAddTask(false);
    }
  };

  const handleUpdateTask = () => {
    if (taskContent.trim() && editingTask) {
      updateDailyTask(editingTask, taskContent.trim());
      setTaskContent("");
      setEditingTask(null);
    }
  };

  const handleDeleteImportantNote = () => {
    if (deletingImportantNote) {
      deleteImportantNote(deletingImportantNote);
      setDeletingImportantNote(null);
    }
  };

  const handleDeleteGeneralNote = () => {
    if (deletingGeneralNote) {
      deleteGeneralNote(deletingGeneralNote);
      setDeletingGeneralNote(null);
    }
  };

  const handleDeleteTask = () => {
    if (deletingTask) {
      deleteDailyTask(deletingTask);
      setDeletingTask(null);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetDate: Date) => {
    if (draggedTask) {
      moveDailyTask(draggedTask, formatDateForStorage(targetDate));
      setDraggedTask(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Column component for reusability
  const TaskColumn = ({ 
    date, 
    title, 
    isTodayColumn = false 
  }: { 
    date: Date; 
    title: string; 
    isTodayColumn?: boolean; 
  }) => {
    const tasks = getTasksForDate(date);
    const dateString = formatDateForStorage(date);
    const isCurrentDay = isToday(date);

    return (
      <div
        className="space-y-3"
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(date)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold capitalize flex items-center gap-2 ${
              isCurrentDay ? 'text-primary' : 'text-foreground'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                isCurrentDay ? 'bg-primary' : 'bg-muted-foreground'
              }`} />
              {title}
            </h3>
            {isCurrentDay && (
              <Badge variant="default" className="text-xs">
                Today
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {tasks.length}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setTaskContent("");
                setShowAddTask(true);
                // Set the target date for the dialog
                (window as any).targetDate = date;
              }}
              className="h-6 w-6 p-0 hover:bg-primary/10"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mb-3">
          {formatDateForDisplay(date)}
        </div>

        <div className="space-y-2 min-h-[200px]">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-xs">No tasks for this day</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(task.id)}
                className="group p-3 rounded-lg bg-muted/50 border border-border hover:bg-muted/70 transition-colors cursor-move"
              >
                <div className="flex items-start gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground flex-1">{task.content}</p>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingTask(task.id);
                        setTaskContent(task.content);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeletingTask(task.id)}
                      className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 ml-6">
                  {formatDate(task.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notes & Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage your important notes and daily tasks
          </p>
        </div>
      </div>

      {/* Important Notes Section */}
      <Card className="bg-gradient-card border-border">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Important Notes</h2>
                <p className="text-sm text-muted-foreground">
                  {importantNotes.length} notes • Permanent storage
                </p>
              </div>
            </div>
            <Button onClick={() => setShowAddImportantNote(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </div>

          {importantNotes.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">No Important Notes</h3>
              <p className="text-xs text-muted-foreground">Add important notes that you want to keep permanently</p>
            </div>
          ) : (
            <div className="space-y-3">
              {importantNotes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-start gap-3 p-4 rounded-lg bg-warning/5 border border-warning/20"
                >
                  <div className="w-6 h-6 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star className="w-3 h-3 text-warning" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground whitespace-pre-wrap">{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Created {formatDate(note.createdAt)}
                      {note.updatedAt !== note.createdAt && ` • Updated ${formatDate(note.updatedAt)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingImportantNote(note.id);
                        setImportantNoteContent(note.content);
                      }}
                      className="h-8 w-8 p-0 hover:bg-muted"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeletingImportantNote(note.id)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* General Notes Section */}
      <Card className="bg-gradient-card border-border">
        <Collapsible open={generalNotesOpen} onOpenChange={setGeneralNotesOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-6 h-auto hover:bg-transparent"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-info" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-foreground">General Notes</h3>
                  <p className="text-sm text-muted-foreground">
                    {generalNotes.length} notes • Quick thoughts and ideas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAddGeneralNote(true);
                    }}
                    className="h-8 px-3"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Note
                  </Button>
                </div>
                {generalNotesOpen ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-6 pb-6">
              {generalNotes.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h4 className="text-sm font-medium text-foreground mb-1">No General Notes</h4>
                  <p className="text-xs text-muted-foreground">Add general notes for quick thoughts and ideas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {generalNotes.map((note) => (
                    <div
                      key={note.id}
                      className="flex items-start gap-3 p-4 rounded-lg bg-info/5 border border-info/20"
                    >
                      <div className="w-6 h-6 rounded-full bg-info/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FileText className="w-3 h-3 text-info" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground whitespace-pre-wrap">{note.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created {formatDate(note.createdAt)}
                          {note.updatedAt !== note.createdAt && ` • Updated ${formatDate(note.updatedAt)}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingGeneralNote(note.id);
                            setGeneralNoteContent(note.content);
                          }}
                          className="h-8 w-8 p-0 hover:bg-muted"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeletingGeneralNote(note.id)}
                          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Daily Tasks Section */}
      <Card className="bg-gradient-card border-border">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Daily Tasks</h2>
                <p className="text-sm text-muted-foreground">
                  {dailyTasks.length} tasks • Drag to move between dates
                </p>
              </div>
            </div>
            
            {/* Date Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousDay}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-muted">
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {formatDateForDisplay(currentDate)}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextDay}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="h-8 px-3"
              >
                Today
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TaskColumn 
              date={yesterday} 
              title="Yesterday" 
            />
            <TaskColumn 
              date={today} 
              title="Today" 
              isTodayColumn={true}
            />
            <TaskColumn 
              date={tomorrow} 
              title="Tomorrow" 
            />
          </div>
        </div>
      </Card>

      {/* Add Important Note Dialog */}
      <Dialog open={showAddImportantNote} onOpenChange={setShowAddImportantNote}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Important Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={importantNoteContent}
              onChange={(e) => setImportantNoteContent(e.target.value)}
              placeholder="Write your important note here..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddImportantNote(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddImportantNote} disabled={!importantNoteContent.trim()}>
                Add Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Important Note Dialog */}
      <Dialog open={!!editingImportantNote} onOpenChange={() => setEditingImportantNote(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Important Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={importantNoteContent}
              onChange={(e) => setImportantNoteContent(e.target.value)}
              placeholder="Write your important note here..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditingImportantNote(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateImportantNote} disabled={!importantNoteContent.trim()}>
                Update Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add General Note Dialog */}
      <Dialog open={showAddGeneralNote} onOpenChange={setShowAddGeneralNote}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add General Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={generalNoteContent}
              onChange={(e) => setGeneralNoteContent(e.target.value)}
              placeholder="Write your general note here..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddGeneralNote(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddGeneralNote} disabled={!generalNoteContent.trim()}>
                Add Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit General Note Dialog */}
      <Dialog open={!!editingGeneralNote} onOpenChange={() => setEditingGeneralNote(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit General Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={generalNoteContent}
              onChange={(e) => setGeneralNoteContent(e.target.value)}
              placeholder="Write your general note here..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditingGeneralNote(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateGeneralNote} disabled={!generalNoteContent.trim()}>
                Update Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Daily Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={taskContent}
              onChange={(e) => setTaskContent(e.target.value)}
              placeholder="Enter your task..."
            />
            <div className="text-sm text-muted-foreground">
              Task will be added to: <span className="font-medium text-foreground">
                {formatDateForDisplay((window as any).targetDate || currentDate)}
              </span>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddTask(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => handleAddTask((window as any).targetDate || currentDate)} 
                disabled={!taskContent.trim()}
              >
                Add Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Daily Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={taskContent}
              onChange={(e) => setTaskContent(e.target.value)}
              placeholder="Enter your task..."
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditingTask(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateTask} disabled={!taskContent.trim()}>
                Update Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Important Note Confirmation */}
      <AlertDialog open={!!deletingImportantNote} onOpenChange={() => setDeletingImportantNote(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Important Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this important note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteImportantNote}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete General Note Confirmation */}
      <AlertDialog open={!!deletingGeneralNote} onOpenChange={() => setDeletingGeneralNote(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete General Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this general note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteGeneralNote}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Task Confirmation */}
      <AlertDialog open={!!deletingTask} onOpenChange={() => setDeletingTask(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTask}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Notes;