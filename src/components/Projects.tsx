import { useState, useEffect } from "react";
import { supabase } from "../libraries/supabase";
import Tasks from "./Task";
import { Button } from "./ui/button";
import EditProject from "./EditProject"; 

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
}

interface ProjectsProps {
    shouldRefresh: boolean;
}

const Projects: React.FC<ProjectsProps> = ({ shouldRefresh }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); 

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("projects")
          .select("id, name, description, status");

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
    };

    fetchProjects();
  }, [shouldRefresh]);

  const handleDelete = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) {
        throw error;
      }

      setProjects(projects.filter(project => project.id !== projectId));
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };
  

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };
  

  const handleProjectUpdated = () => {
    setIsModalOpen(false);
    
    fetchProjects(); 
  };
  
  const fetchProjects = async () => {};

  if (loading) {
    return <div className="text-center text-purple-400">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-purple-400">My Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-black border border-purple-500 rounded-lg p-6 shadow-md shadow-purple-500/20">
            <h3 className="text-xl font-bold text-purple-400 mb-2">{project.name}</h3>
            <p className="text-purple-300 mb-4">{project.description}</p>
            <span className="inline-block bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {project.status}
            </span>
            
            <Tasks projectId={project.id} />

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
            </div>
            
          </div>
        ))}
      </div>
      {selectedProject && (
        <EditProject 
          project={selectedProject} 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen} 
          onProjectUpdated={handleProjectUpdated} 
        />
      )}
    </div>
  );
};

export default Projects;