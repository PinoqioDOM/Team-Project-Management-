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
    return <div className="text-white text-center mt-10 sm:mt-20 text-sm sm:text-base">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10 sm:mt-20 text-sm sm:text-base px-4">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-3 sm:p-4 lg:p-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Projects</h1>
        {isAdmin && (
          <Button 
            onClick={handleCreateProject} 
            className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto text-sm sm:text-base py-2 px-4"
          >
            Create New Project
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
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
          <div className="col-span-full text-center py-8 sm:py-12">
            <p className="text-gray-400 text-sm sm:text-base">No projects found...</p>
          </div>
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