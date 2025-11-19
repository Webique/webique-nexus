import { useState, useMemo } from "react";
import { ExternalLink, CheckCircle, Eye, Plus, Edit } from "lucide-react";
import { useProjects } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProjectDetailsDialog } from "@/components/projects/ProjectDetailsDialog";
import { AddFreelancerProjectDialog } from "@/components/freelancer-manager/AddFreelancerProjectDialog";
import { EditNotesDialog } from "@/components/freelancer-manager/EditNotesDialog";
import { EditFreelancerProjectDialog } from "@/components/freelancer-manager/EditFreelancerProjectDialog";
import { Project } from "@/types/project";

const FreelancerManager = () => {
  // NOTE: Freelancer Manager has LIMITED access:
  // - Can only view Freelancer projects
  // - Can add new Freelancer projects
  // - Can edit active projects (name, phone, instagram, website, total amount, freelancer, notes)
  // - Can edit notes on completed Freelancer projects ONLY
  // - CANNOT delete projects
  // - CANNOT edit amountReceived
  // - CANNOT mark projects as completed
  
  const { projects } = useProjects();
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [editingNotes, setEditingNotes] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeSortOrder, setActiveSortOrder] = useState<'desc' | 'asc'>('desc');
  const [completedSortOrder, setCompletedSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filter only Freelancer projects - security: Freelancer Manager can only see Freelancer projects
  const freelancerProjects = useMemo(() => {
    return projects.filter(project => project.label === 'Freelancer');
  }, [projects]);

  const activeProjects = useMemo(() => {
    return freelancerProjects.filter(project => project.status === 'active');
  }, [freelancerProjects]);

  const completedProjects = useMemo(() => {
    return freelancerProjects.filter(project => project.status === 'completed');
  }, [freelancerProjects]);

  const sortedActive = useMemo(() => {
    const arr = [...activeProjects];
    arr.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return activeSortOrder === 'desc' ? db - da : da - db;
    });
    return arr;
  }, [activeProjects, activeSortOrder]);

  const sortedCompleted = useMemo(() => {
    const arr = [...completedProjects];
    arr.sort((a, b) => {
      const da = new Date(a.finishedDate || a.createdAt).getTime();
      const db = new Date(b.finishedDate || b.createdAt).getTime();
      return completedSortOrder === 'desc' ? db - da : da - db;
    });
    return arr;
  }, [completedProjects, completedSortOrder]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const buildInstagramUrl = (value: string): string => {
    if (!value) return '#';
    let v = value.trim();
    if (v.startsWith('http')) return v;
    if (v.startsWith('@')) v = v.slice(1);
    v = v
      .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
      .replace(/^instagram\.com\//i, '')
      .replace(/\/+$/, '');
    return `https://instagram.com/${v}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Freelancer Projects</h1>
          <p className="text-muted-foreground mt-1">
            View active and completed freelancer projects
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
              <p className="text-muted-foreground text-sm">Active Projects</p>
              <p className="text-2xl font-bold text-foreground">{activeProjects.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Completed Projects</p>
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
              <p className="text-muted-foreground text-sm">Total Value</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(freelancerProjects.reduce((sum, project) => sum + (project.totalAmount || 0), 0))}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center">
              <span className="text-info font-bold">$</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Projects Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Projects ({activeProjects.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed Projects ({completedProjects.length})</TabsTrigger>
        </TabsList>

        {/* Active Projects Tab */}
        <TabsContent value="active" className="space-y-4">
          <Card className="bg-gradient-card border-border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Active Freelancer Projects</h2>
                <Select value={activeSortOrder} onValueChange={(v) => setActiveSortOrder(v as 'desc' | 'asc')}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Sort by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Newest first</SelectItem>
                    <SelectItem value="asc">Oldest first</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {activeProjects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No Active Projects</h3>
                  <p className="text-muted-foreground">No active freelancer projects at the moment</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Freelancer</TableHead>
                        <TableHead>Instagram</TableHead>
                        <TableHead>Website</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Amount Received</TableHead>
                        <TableHead>Remaining</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedActive.map((project) => (
                        <>
                          <TableRow key={project.id} className="hover:bg-muted/50 transition-colors">
                            <TableCell className="font-medium">{project.name}</TableCell>
                            <TableCell>{project.phoneNumber}</TableCell>
                            <TableCell>{project.freelancer || '-'}</TableCell>
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
                            <TableCell className="max-w-xs truncate" title={project.notes}>
                              {project.notes || '-'}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setEditingProject(project)}
                                  className="p-2 hover:bg-muted rounded-md transition-colors"
                                  title="Edit Project"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setViewingProject(project)}
                                  className="p-2 hover:bg-muted rounded-md transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Completed Projects Tab */}
        <TabsContent value="completed" className="space-y-4">
          <Card className="bg-gradient-card border-border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Completed Freelancer Projects</h2>
                <Select value={completedSortOrder} onValueChange={(v) => setCompletedSortOrder(v as 'desc' | 'asc')}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Sort by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Newest first</SelectItem>
                    <SelectItem value="asc">Oldest first</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {completedProjects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No Completed Projects</h3>
                  <p className="text-muted-foreground">No completed freelancer projects yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Freelancer</TableHead>
                        <TableHead>Instagram</TableHead>
                        <TableHead>Website</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Amount Received</TableHead>
                        <TableHead>Remaining</TableHead>
                        <TableHead>Finished Date</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedCompleted.map((project) => (
                        <TableRow key={project.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="font-medium">{project.name}</TableCell>
                          <TableCell>{project.phoneNumber}</TableCell>
                          <TableCell>{project.freelancer || '-'}</TableCell>
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
                          <TableCell>{project.finishedDate ? formatDate(project.finishedDate) : 'N/A'}</TableCell>
                          <TableCell className="max-w-xs truncate" title={project.notes}>
                            {project.notes || '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingNotes(project)}
                                className="p-2 hover:bg-muted rounded-md transition-colors"
                                title="Edit Notes"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setViewingProject(project)}
                                className="p-2 hover:bg-muted rounded-md transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
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
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddFreelancerProjectDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      {editingProject && (
        <EditFreelancerProjectDialog
          project={editingProject}
          open={!!editingProject}
          onOpenChange={(open) => !open && setEditingProject(null)}
        />
      )}

      {editingNotes && (
        <EditNotesDialog
          project={editingNotes}
          open={!!editingNotes}
          onOpenChange={(open) => !open && setEditingNotes(null)}
        />
      )}

      {/* Project Details Dialog */}
      {viewingProject && (
        <ProjectDetailsDialog
          project={viewingProject}
          open={!!viewingProject}
          onOpenChange={(open) => !open && setViewingProject(null)}
        />
      )}
    </div>
  );
};

export default FreelancerManager;

