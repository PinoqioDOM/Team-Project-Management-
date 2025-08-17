import { useState, useEffect, useCallback } from "react";
import { supabase } from "../libraries/supabase";
import { TaskCard } from "./TaskCard";
import { Task } from "../services/taskService";

interface TasksProps {
  projectId: string;
  userRole: string;
  currentUserId: string;
}

const Tasks: React.FC<TasksProps> = ({ projectId, userRole, currentUserId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          assigned_user:users!tasks_assigned_to_fkey(name)
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

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
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusUpdate = async (taskId: string, status: Task['status']) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status })
        .eq("id", taskId);

      if (error) {
        throw error;
      }

      fetchTasks();
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const handleAssign = async (taskId: string) => {
    console.log("Assign task:", taskId, "Current user:", currentUserId, "User role:", userRole);
  };
  
  const handleDelete = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);
      
      if (error) {
        throw error;
      }
      
      fetchTasks();

    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  if (loading) {
    return <div className="text-purple-300 text-sm mt-4">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-sm mt-4">Error loading tasks: {error}</div>;
  }

  if (tasks.length === 0) {
    return <div className="text-purple-300 text-sm mt-4">No tasks found for this project.</div>;
  }

  return (
    <div className="mt-4">
      <h4 className="text-purple-400 font-semibold mb-3">Tasks ({tasks.length})</h4>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusUpdate={handleStatusUpdate}
            onAssign={handleAssign}
            onDelete={() => handleDelete(task.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Tasks;