import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/ProjectContext";
import { Project } from "@/types/project";
import { useToast } from "@/hooks/use-toast";

const notesSchema = z.object({
  notes: z.string().optional(),
});

type NotesFormData = z.infer<typeof notesSchema>;

interface EditNotesDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditNotesDialog({ project, open, onOpenChange }: EditNotesDialogProps) {
  const { updateProject } = useProjects();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NotesFormData>({
    resolver: zodResolver(notesSchema),
    defaultValues: {
      notes: project.notes || "",
    },
  });

  useEffect(() => {
    if (open) {
      // Security check: Only allow editing notes on Freelancer projects
      if (project.label !== 'Freelancer') {
        toast({
          title: "Access Denied",
          description: "You can only edit notes on Freelancer projects.",
          variant: "destructive",
        });
        onOpenChange(false);
        return;
      }
      form.reset({
        notes: project.notes || "",
      });
    }
  }, [open, project.notes, project.label, form, onOpenChange, toast]);

  const onSubmit = async (data: NotesFormData) => {
    // Security check: Ensure this is a Freelancer project
    if (project.label !== 'Freelancer') {
      toast({
        title: "Access Denied",
        description: "You can only edit notes on Freelancer projects.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Only update notes field - no other fields can be changed
      await updateProject(project.id, {
        notes: data.notes || "",
      });
      toast({
        title: "Notes Updated",
        description: "Project notes have been updated successfully.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating notes:', error);
      toast({
        title: "Error",
        description: "Failed to update notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Notes - {project.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="bg-input min-h-[150px]" 
                      placeholder="Enter project notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Notes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

