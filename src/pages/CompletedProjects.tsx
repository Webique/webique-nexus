import { useState, useMemo } from "react";
import { Edit, Trash2, ExternalLink, Eye, CheckCircle, Copy, RotateCcw } from "lucide-react";
import { useProjects } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
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
import { EditProjectDialog } from "@/components/projects/EditProjectDialog";
import { ProjectDetailsDialog } from "@/components/projects/ProjectDetailsDialog";
import { Project } from "@/types/project";

const CompletedProjects = () => {
  const { getCompletedProjects, deleteProject, reactivateProject } = useProjects();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  
  const completedProjects = getCompletedProjects();
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const sortedCompleted = useMemo(() => {
    const arr = [...completedProjects];
    arr.sort((a, b) => {
      const da = new Date(a.finishedDate || a.createdAt).getTime();
      const db = new Date(b.finishedDate || b.createdAt).getTime();
      return sortOrder === 'desc' ? db - da : da - db;
    });
    return arr;
  }, [completedProjects, sortOrder]);

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
    if (v.startsWith('@')) v = v.slice(1);
    v = v
      .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
      .replace(/^instagram\.com\//i, '')
      .replace(/\/+$/,'');
    return `https://instagram.com/${v}`;
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here if you have one set up
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Completed Projects</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your finished projects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as 'desc'|'asc')}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Sort by date" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest first</SelectItem>
              <SelectItem value="asc">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Completed</p>
              <p className="text-2xl font-bold text-foreground">{completedProjects.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(completedProjects.reduce((sum, project) => sum + (project.totalAmount || 0), 0))}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">$</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Avg Project Value</p>
              <p className="text-2xl font-bold text-foreground">
                {completedProjects.length > 0 
                  ? formatCurrency(completedProjects.reduce((sum, project) => sum + (project.totalAmount || 0), 0) / completedProjects.length)
                  : '$0'
                }
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center">
              <span className="text-info font-bold">Ø</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Projects Table */}
      <Card className="bg-gradient-card border-border">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Completed Projects</h2>
          
          {completedProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No Completed Projects</h3>
              <p className="text-muted-foreground">Complete some active projects to see them here</p>
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
                    <TableHead>Finished Date</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCompleted.map((project) => (
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
                          <div className="flex items-center gap-2">
                            <a 
                              href={project.websiteLink.startsWith('http') ? project.websiteLink : `https://${project.websiteLink}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              Website
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(project.websiteLink.startsWith('http') ? project.websiteLink : `https://${project.websiteLink}`)}
                              className="h-6 w-6 p-0 hover:bg-muted"
                              title="Copy website link"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(project.totalAmount || 0)}</TableCell>
                      <TableCell className="text-primary">{formatCurrency(project.amountReceived || 0)}</TableCell>
                      <TableCell className={`font-medium ${(project.remainingAmount || 0) > 0 ? 'text-warning' : 'text-success'}`}>
                        {formatCurrency(project.remainingAmount || 0)}
                      </TableCell>
                      <TableCell>{project.finishedDate ? formatDate(project.finishedDate) : 'N/A'}</TableCell>
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
                            onClick={() => setViewingProject(project)}
                            className="hover:bg-muted"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
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
                            onClick={() => reactivateProject(project.id)}
                            className="hover:bg-warning/10 hover:text-warning"
                            title="Move back to Active"
                          >
                            <RotateCcw className="w-4 h-4" />
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
      {editingProject && (
        <EditProjectDialog 
          project={editingProject}
          open={!!editingProject} 
          onOpenChange={(open) => !open && setEditingProject(null)} 
        />
      )}
      
      {viewingProject && (
        <ProjectDetailsDialog 
          project={viewingProject}
          open={!!viewingProject} 
          onOpenChange={(open) => !open && setViewingProject(null)}
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
    </div>
  );
};

export default CompletedProjects;