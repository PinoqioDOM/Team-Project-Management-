import { useState, useEffect } from "react";
import { supabase } from "../libraries/supabase";

interface Task {
  id: string;
  created_at: string;
  title: string;
  description: string;
  status: string;
  created_by: string;
  assigned_to: string;
  project_id: string;
}

interface TasksProps {
  projectId: string;
}

const Tasks: React.FC<TasksProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("project_id", projectId);

        if (error) {
          throw error;
        }

        if (data) {
          setTasks(data as Task[]);
        }
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  if (loading) {
    return <div className="text-center text-purple-400 mt-4">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">Error: {error}</div>;
  }

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold text-purple-400 mb-2">Tasks for this Project</h3>
      {tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-gray-900 border border-purple-600 rounded-lg p-4">
              <h4 className="text-lg font-bold text-purple-300">{task.title}</h4>
              <p className="text-purple-400 text-sm mt-1">{task.description}</p>
              <div className="flex items-center space-x-2 mt-2 text-sm text-purple-500">
                <span>Status: {task.status}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-purple-400">No tasks found for this project.</p>
      )}
    </div>
  );
};

export default Tasks;