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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/ProjectContext";
import { Project } from "@/types/project";
import { useToast } from "@/hooks/use-toast";

const editFreelancerProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  instagram: z.string().optional(),
  websiteLink: z.string().optional(),
  totalAmount: z.number().min(0, "Total amount must be positive").optional(),
  freelancer: z.string().optional(),
});

type EditFreelancerProjectFormData = z.infer<typeof editFreelancerProjectSchema>;

interface EditFreelancerProjectDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditFreelancerProjectDialog({ project, open, onOpenChange }: EditFreelancerProjectDialogProps) {
  const { updateProject } = useProjects();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditFreelancerProjectFormData>({
    resolver: zodResolver(editFreelancerProjectSchema),
    defaultValues: {
      name: project.name || "",
      phoneNumber: project.phoneNumber || "",
      instagram: project.instagram || "",
      websiteLink: project.websiteLink || "",
      totalAmount: project.totalAmount,
      freelancer: project.freelancer || "",
    },
  });

  useEffect(() => {
    if (open) {
      // Security check: Only allow editing active Freelancer projects
      if (project.label !== 'Freelancer') {
        toast({
          title: "Access Denied",
          description: "You can only edit Freelancer projects.",
          variant: "destructive",
        });
        onOpenChange(false);
        return;
      }

      if (project.status !== 'active') {
        toast({
          title: "Access Denied",
          description: "You can only edit active projects.",
          variant: "destructive",
        });
        onOpenChange(false);
        return;
      }

      form.reset({
        name: project.name || "",
        phoneNumber: project.phoneNumber || "",
        instagram: project.instagram || "",
        websiteLink: project.websiteLink || "",
        totalAmount: project.totalAmount,
        freelancer: project.freelancer || "",
      });
    }
  }, [open, project, form, onOpenChange, toast]);

  const onSubmit = async (data: EditFreelancerProjectFormData) => {
    // Security check: Ensure this is an active Freelancer project
    if (project.label !== 'Freelancer' || project.status !== 'active') {
      toast({
        title: "Access Denied",
        description: "You can only edit active Freelancer projects.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const totalAmount = data.totalAmount || 0;
      const currentAmountReceived = project.amountReceived || 0;
      const remainingAmount = totalAmount - currentAmountReceived;

      // Only update allowed fields - cannot change amountReceived, fees, or status
      await updateProject(project.id, {
        name: data.name,
        phoneNumber: data.phoneNumber,
        instagram: data.instagram || "",
        websiteLink: data.websiteLink || "",
        totalAmount: totalAmount,
        remainingAmount: remainingAmount,
        freelancer: data.freelancer || "",
      });

      toast({
        title: "Project Updated",
        description: "Project has been updated successfully.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Project - {project.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name *</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-input" placeholder="Enter project name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-input" placeholder="Enter phone number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-input" placeholder="Enter Instagram handle" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="websiteLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website Link (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-input" placeholder="Enter website URL" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount (SAR) (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="bg-input" 
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="freelancer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Freelancer Name (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-input" 
                      placeholder="Enter freelancer name"
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
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

