import { useState } from "react";
import { Plus, Edit, CheckCircle, Trash2, ExternalLink } from "lucide-react";
import { useProjects } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { AddProjectDialog } from "@/components/projects/AddProjectDialog";
import { EditProjectDialog } from "@/components/projects/EditProjectDialog";
import { Project } from "@/types/project";

const ActiveProjects = () => {
  const { getActiveProjects, completeProject, deleteProject } = useProjects();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [completingProject, setCompletingProject] = useState<Project | null>(null);
  
  const activeProjects = getActiveProjects();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getLabelVariant = (label: string) => {
    return label === 'In-House' ? 'default' : 'secondary';
  };

  const buildInstagramUrl = (value: string): string => {
    if (!value) return '#';
    let v = value.trim();
    if (v.startsWith('http')) return v;
    // strip leading @ and any leading domain if user pasted it without protocol
    if (v.startsWith('@')) v = v.slice(1);
    v = v
      .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
      .replace(/^instagram\.com\//i, '')
      .replace(/\/+$/,'');
    return `https://instagram.com/${v}`;
  };

  const handleCompleteProject = (project: Project) => {
    setCompletingProject(project);
  };

  const confirmComplete = () => {
    if (completingProject) {
      completeProject(completingProject.id);
      setCompletingProject(null);
    }
  };

  const handleDeleteProject = (project: Project) => {
    setDeletingProject(project);
  };

  const confirmDelete = () => {
    if (deletingProject) {
      deleteProject(deletingProject.id);
      setDeletingProject(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Active Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your ongoing projects and track progress
          </p>
        </div>
        <Button 
          onClick={() => setShowAddDialog(true)}
          className="bg-gradient-primary hover:shadow-bronze transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Active</p>
              <p className="text-2xl font-bold text-foreground">{activeProjects.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Plus className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Value</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(activeProjects.reduce((sum, project) => sum + (project.totalAmount || 0), 0))}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">In-House Projects</p>
              <p className="text-2xl font-bold text-foreground">
                {activeProjects.filter(p => p.label === 'In-House').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center">
              <Badge variant="default" className="text-xs">IH</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Projects Table */}
      <Card className="bg-gradient-card border-border">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Project List</h2>
          
          {activeProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No Active Projects</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first project</p>
              <Button onClick={() => setShowAddDialog(true)} className="bg-gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Instagram</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Completed Date</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeProjects.map((project) => (
                    <TableRow key={project.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.phoneNumber}</TableCell>
                      <TableCell>
                        {project.instagram && (
                          <a 
                            href={buildInstagramUrl(project.instagram)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            Instagram
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </TableCell>
                      <TableCell>
                        {project.websiteLink && (
                          <a 
                            href={project.websiteLink.startsWith('http') ? project.websiteLink : `https://${project.websiteLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            Website
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(project.totalAmount || 0)}</TableCell>
                      <TableCell className="text-primary">{formatCurrency(project.amountReceived || 0)}</TableCell>
                      <TableCell className={`font-medium ${(project.remainingAmount || 0) > 0 ? 'text-warning' : 'text-success'}`}>
                        {formatCurrency(project.remainingAmount || 0)}
                      </TableCell>
                      <TableCell>{project.finishedDate ? formatDate(project.finishedDate) : 'Not completed yet'}</TableCell>
                      <TableCell>
                        <Badge variant={getLabelVariant(project.label)}>
                          {project.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingProject(project)}
                            className="hover:bg-muted"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCompleteProject(project)}
                            className="hover:bg-success/10 hover:text-success"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteProject(project)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>

      {/* Dialogs */}
      <AddProjectDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />
      
      {editingProject && (
        <EditProjectDialog 
          project={editingProject}
          open={!!editingProject} 
          onOpenChange={(open) => !open && setEditingProject(null)} 
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingProject} onOpenChange={(open) => !open && setDeletingProject(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingProject?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Complete Project Confirmation */}
      <AlertDialog open={!!completingProject} onOpenChange={(open) => !open && setCompletingProject(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark "{completingProject?.name}" as completed? This will move it to the completed projects section.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmComplete}
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              Complete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ActiveProjects;