import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../libraries/supabase";
import ProjectCard from "../components/ProjectCard";
import CreateProject from "../components/CreateProject";
import EditProject from "../components/EditProject";
import { Button } from "../components/ui/button";
import { usePermissions } from "../hooks/usePermissions";
import { useAuth } from "../hooks/useAuth";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "planned" | "in-progress" | "completed";
}

const ProjectsPage: React.FC = React.memo(() => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { isAdmin } = usePermissions();
  const { userData } = useAuth();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, description, status")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setProjects([]);
    } else {
      setProjects(data as Project[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (userData) {
      fetchProjects();
    }
  }, [userData, fetchProjects]);

  const handleCreateProject = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    const confirmed = true;
    if (confirmed) {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) {
        setError(error.message);
      } else {
        fetchProjects();
      }
    }
  };

  if (loading) {
    return <div className="text-white">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        {isAdmin && (
          <Button onClick={handleCreateProject} className="bg-purple-600 hover:bg-purple-700 text-white">
            Create New Project
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => handleEditProject(project)}
              onDelete={() => handleDeleteProject(project.id)}
            />
          ))
        ) : (
          <p className="text-gray-400">No projects found...</p>
        )}
      </div>

      <CreateProject
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onProjectCreated={fetchProjects}
      />

      {selectedProject && (
        <EditProject
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          project={selectedProject}
          onProjectUpdated={fetchProjects}
        />
      )}
    </div>
  );
});

export default ProjectsPage;