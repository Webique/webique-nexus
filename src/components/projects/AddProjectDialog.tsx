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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/contexts/ProjectContext";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  notes: z.string().optional(),
  instagram: z.string().optional(),
  websiteLink: z.string().optional(),
  totalAmount: z.number().min(0).optional(),
  amountReceived: z.number().min(0).optional(),
  finishedDate: z.string().optional(),
  domainCost: z.number().min(0).optional(),
  additionalCosts: z.number().min(0).optional(),
  additionalCostReason: z.string().optional(),
  freelancerManagerFees: z.number().min(0).optional(),
  freelancerFees: z.number().min(0).optional(),
  freelancer: z.string().optional(),
  label: z.enum(['In-House', 'Freelancer']).optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProjectDialog({ open, onOpenChange }: AddProjectDialogProps) {
  const { addProject } = useProjects();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      notes: "",
      instagram: "",
      websiteLink: "",
      totalAmount: undefined,
      amountReceived: undefined,
      finishedDate: "",
      domainCost: undefined,
      additionalCosts: undefined,
      additionalCostReason: "",
      freelancerManagerFees: undefined,
      freelancerFees: undefined,
      freelancer: undefined,
      label: undefined,
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      const totalAmount = data.totalAmount || 0;
      const amountReceived = data.amountReceived || 0;
      const remainingAmount = totalAmount - amountReceived;

      // Set all fees to 0 or undefined - will be added manually
      const projectData = {
        name: data.name,
        phoneNumber: data.phoneNumber,
        notes: data.notes || "",
        instagram: data.instagram || "",
        websiteLink: data.websiteLink || "",
        totalAmount: totalAmount,
        amountReceived: amountReceived,
        remainingAmount: remainingAmount,
        finishedDate: data.finishedDate || "",
        domainCost: data.domainCost ?? 0,
        additionalCosts: data.additionalCosts ?? 0,
        additionalCostReason: data.additionalCostReason || "",
        freelancerManagerFees: data.freelancerManagerFees ?? 0,
        freelancerFees: data.freelancerFees ?? 0,
        freelancer: data.freelancer,
        label: data.label,
        status: 'active' as const,
      };
      addProject(projectData);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-w-[95vw] bg-card border-border p-6">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Project</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name *</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-input" />
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
                      <Input {...field} className="bg-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Project Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Notes (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-input" 
                      placeholder="Brief description of the project..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-input" placeholder="@username or URL" />
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
                      <Input {...field} className="bg-input" placeholder="https://..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
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
                name="amountReceived"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount Received (SAR) (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
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
            </div>

            {/* Remaining Amount Preview */}
            <div className="bg-muted/50 rounded-lg p-3 border border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Remaining Amount:</span>
                <span className={`font-semibold ${
                  ((form.watch("totalAmount") || 0) - (form.watch("amountReceived") || 0)) > 0 
                    ? 'text-warning' 
                    : 'text-success'
                }`}>
                  {formatCurrency((form.watch("totalAmount") || 0) - (form.watch("amountReceived") || 0))}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="finishedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Finished Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="bg-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="domainCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain Cost (SAR) (Optional)</FormLabel>
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
                name="additionalCosts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Costs (SAR) (Optional)</FormLabel>
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
            </div>

            {/* Additional Cost Reason */}
            <FormField
              control={form.control}
              name="additionalCostReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Cost Reason (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-input" 
                      placeholder="e.g., Extra features, design changes, etc."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Freelancer Fields - Only show when label is Freelancer */}
            {form.watch("label") === "Freelancer" && (
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Freelancer Costs</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="freelancerManagerFees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manager Fees (SAR)</FormLabel>
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
                    name="freelancerFees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Freelancer Fees (SAR)</FormLabel>
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
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Label (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-input">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="In-House">In-House</SelectItem>
                      <SelectItem value="Freelancer">Freelancer</SelectItem>
                    </SelectContent>
                  </Select>
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
                {isSubmitting ? "Adding..." : "Add Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}