import { useState, useEffect, useCallback } from "react";
import { supabase } from "../libraries/supabase";
import Tasks from "./Task";
import { Button } from "./ui/button";
import EditProject from "./EditProject";
import { Dialog } from "@/components/ui/dialog"; // Only import Dialog, as DialogTrigger is not used directly here

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
}

interface ProjectsProps {
  projects: Project[];
  userRole: string;
  currentUserId: string;
  openCreateTaskModal: (projectId: string) => void;
}

const Projects: React.FC<ProjectsProps> = ({ projects: initialProjects, userRole, currentUserId, openCreateTaskModal }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, description, status")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setProjects(data as Project[]);
      }
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (projectId: string) => {
    if (userRole !== "admin") {
      setError("You do not have permission to delete projects.");
      return;
    }
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) {
        throw error;
      }

      fetchProjects();
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const handleEdit = (project: Project) => {
    if (userRole !== "admin") {
      setError("You do not have permission to edit projects.");
      return;
    }
    setSelectedProject(project);
    setIsEditProjectModalOpen(true);
  };

  const handleProjectUpdated = () => {
    setIsEditProjectModalOpen(false);
    fetchProjects();
  };

  if (loading) {
    return <div className="text-center text-purple-400">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-purple-400">
        {userRole === "admin" ? "All Projects" : "My Projects"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className="bg-black border border-purple-500 rounded-lg p-6 shadow-md shadow-purple-500/20">
              <h3 className="text-xl font-bold text-purple-400 mb-2">{project.name}</h3>
              <p className="text-purple-300 mb-4">{project.description}</p>
              <span className="inline-block bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {project.status}
              </span>

              <Tasks projectId={project.id} userRole={userRole} currentUserId={currentUserId} />

              {userRole === "admin" && (
                <div className="flex space-x-2 mt-4">
                  <Button onClick={() => handleEdit(project)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(project.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold"
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => openCreateTaskModal(project.id)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold"
                  >
                    Add Task
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-purple-300 col-span-full">No projects found.</p>
        )}
      </div>

      {selectedProject && (
        <Dialog open={isEditProjectModalOpen} onOpenChange={setIsEditProjectModalOpen}>
          <EditProject
            project={selectedProject}
            open={isEditProjectModalOpen}
            onOpenChange={setIsEditProjectModalOpen}
            onProjectUpdated={handleProjectUpdated}
          />
        </Dialog>
      )}
    </div>
  );
};

export default Projects;