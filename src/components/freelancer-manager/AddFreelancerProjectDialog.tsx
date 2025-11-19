import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useProjects } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

const freelancerProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  notes: z.string().optional(),
  instagram: z.string().optional(),
  websiteLink: z.string().optional(),
  totalAmount: z.number().min(0, "Total amount must be positive").optional(),
  freelancer: z.string().optional(),
});

type FreelancerProjectFormData = z.infer<typeof freelancerProjectSchema>;

interface AddFreelancerProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddFreelancerProjectDialog({ open, onOpenChange }: AddFreelancerProjectDialogProps) {
  const { addProject } = useProjects();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FreelancerProjectFormData>({
    resolver: zodResolver(freelancerProjectSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      notes: "",
      instagram: "",
      websiteLink: "",
      totalAmount: undefined,
      freelancer: undefined,
    },
  });

  const onSubmit = async (data: FreelancerProjectFormData) => {
    setIsSubmitting(true);
    try {
      const totalAmount = data.totalAmount || 0;
      
      // Default values for Freelancer projects
      const domainCost = 100;
      const freelancerManagerFees = 50;
      const freelancerFees = 310;
      const mergedAdditionalCosts = freelancerManagerFees + freelancerFees;

      const projectData = {
        name: data.name,
        phoneNumber: data.phoneNumber,
        notes: data.notes || "",
        instagram: data.instagram || "",
        websiteLink: data.websiteLink || "",
        totalAmount: totalAmount,
        amountReceived: 0, // Freelancer Manager cannot set this
        remainingAmount: totalAmount,
        domainCost: domainCost,
        additionalCosts: mergedAdditionalCosts,
        additionalCostReason: "",
        freelancerManagerFees: freelancerManagerFees,
        freelancerFees: freelancerFees,
        freelancer: data.freelancer,
        label: 'Freelancer' as const,
        status: 'active' as const,
      };
      
      await addProject(projectData);
      toast({
        title: "Project Added",
        description: "Project has been added successfully.",
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Error",
        description: "Failed to add project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Freelancer Project</DialogTitle>
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

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="bg-input min-h-[100px]" 
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
                {isSubmitting ? "Adding..." : "Add Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

