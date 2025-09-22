import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Project } from "@/types/project";
import { ExternalLink, Calendar, DollarSign, Phone, Instagram, Globe } from "lucide-react";

interface ProjectDetailsDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailsDialog({ project, open, onOpenChange }: ProjectDetailsDialogProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLabelVariant = (label: string) => {
    return label === 'In-House' ? 'default' : 'secondary';
  };

  const totalCosts = project.domainCost + project.additionalCosts;
  const profit = project.totalAmount - totalCosts;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            Project Details
            <Badge variant={getLabelVariant(project.label)}>
              {project.label}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Header */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{project.name}</h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Created: {formatDate(project.createdAt)}
              </span>
              {project.finishedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Finished: {formatDate(project.finishedDate)}
                </span>
              )}
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{project.phoneNumber}</span>
              </div>
              
              {project.instagram && (
                <div className="flex items-center gap-3">
                  <Instagram className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={project.instagram.startsWith('http') ? project.instagram : `https://${project.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {project.instagram}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              
              {project.websiteLink && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={project.websiteLink.startsWith('http') ? project.websiteLink : `https://${project.websiteLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {project.websiteLink}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Project Timeline */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Timeline</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-card border-border">
                <div className="text-center">
                  <Calendar className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="font-semibold text-foreground">{formatDate(project.deadline)}</p>
                </div>
              </Card>
              
              <Card className="p-4 bg-gradient-card border-border">
                <div className="text-center">
                  <div className={`w-6 h-6 rounded-full mx-auto mb-2 ${
                    project.status === 'completed' ? 'bg-success' : 'bg-warning'
                  }`} />
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold text-foreground capitalize">{project.status}</p>
                </div>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Financial Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Financial Breakdown
            </h3>
            
            <div className="space-y-4">
              {/* Revenue */}
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Total Revenue</span>
                <span className="font-semibold text-success">{formatCurrency(project.totalAmount)}</span>
              </div>
              
              <Separator />
              
              {/* Costs */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground pl-4">Domain Cost</span>
                  <span className="text-destructive">{formatCurrency(project.domainCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground pl-4">Additional Costs</span>
                  <span className="text-destructive">{formatCurrency(project.additionalCosts)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-border">
                  <span className="text-muted-foreground">Total Costs</span>
                  <span className="font-semibold text-destructive">{formatCurrency(totalCosts)}</span>
                </div>
              </div>
              
              <Separator />
              
              {/* Profit */}
              <div className="flex justify-between items-center py-2">
                <span className="text-foreground font-medium">Net Profit</span>
                <span className={`font-bold text-lg ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(profit)}
                </span>
              </div>
              
              {/* Profit Margin */}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Profit Margin</span>
                <span className={`font-medium ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {project.totalAmount > 0 ? `${((profit / project.totalAmount) * 100).toFixed(1)}%` : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}