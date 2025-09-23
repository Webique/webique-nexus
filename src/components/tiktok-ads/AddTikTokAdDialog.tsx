import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProjects } from "@/contexts/ProjectContext";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const tiktokAdSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  price: z.number().min(0, "Price must be positive"),
  date: z.string().min(1, "Date is required"),
});

type TikTokAdFormData = z.infer<typeof tiktokAdSchema>;

interface AddTikTokAdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTikTokAdDialog({ open, onOpenChange }: AddTikTokAdDialogProps) {
  const { addTikTokAd } = useProjects();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TikTokAdFormData>({
    resolver: zodResolver(tiktokAdSchema),
    defaultValues: {
      name: "",
      price: undefined,
      date: "",
    },
  });

  const onSubmit = async (data: TikTokAdFormData) => {
    setIsSubmitting(true);
    try {
      addTikTokAd({
        name: data.name,
        price: data.price,
        date: data.date,
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding TikTok ad:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] p-6">
        <DialogHeader>
          <DialogTitle>Add New TikTok Ad Campaign</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-input" 
                      placeholder="e.g., Summer Sale Campaign"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (SAR)</FormLabel>
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
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      className="bg-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Campaign"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
