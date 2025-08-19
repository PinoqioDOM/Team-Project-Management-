import { useState, useEffect, useCallback } from "react";
import { supabase } from "../libraries/supabase";
import { Button } from "../components/ui/button";
import { TaskCard } from "../components/TaskCard";
import CreateTask from "../components/CreateTask";
import EditTask from "../components/EditTask";
import { useAuth } from "../hooks/useAuth";
import { usePermissions } from "../hooks/usePermissions";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
  project_id: string;
  created_by: string;
  assigned_to: string;
  created_at: string;
  updated_at: string;
}

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { userData } = useAuth();
  const { isAdmin } = usePermissions();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!isAdmin) {
      if (userData?.id) {
        query = query.eq("assigned_to", userData.id);
      } else {
        setTasks([]);
        setLoading(false);
        return;
      }
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
      setTasks([]);
    } else {
      setTasks(data as Task[]);
    }
    setLoading(false);
  }, [isAdmin, userData]);

  useEffect(() => {
    if (userData) {
      fetchTasks();
    }
  }, [userData, fetchTasks, isCreateModalOpen, isEditModalOpen]);

  const handleCreateTask = () => {
    setIsCreateModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    // Replace window.confirm with a custom modal UI
    const confirmed = true; // Placeholder for custom modal confirmation
    if (confirmed) {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) {
        setError(error.message);
      } else {
        fetchTasks();
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleStatusUpdate = async (taskId: string, status: Task['status']) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status })
        .eq("id", taskId);

      if (error) {
        console.error("Error updating task status:", error.message);
        setError(error.message); 
      } else {
        fetchTasks(); 
      }
    } catch (err: unknown) {
      console.error("Error updating task status:", err);
      setError((err as Error).message);
    }
  };

  const handleTaskUpdated = () => {
    fetchTasks();
    setIsEditModalOpen(false);
  };

  if (loading) {
    return <div className="text-white text-center mt-20">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-20">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Tasks</h1>
        {isAdmin && (
          <Button onClick={handleCreateTask} className="bg-purple-600 hover:bg-purple-700 text-white">
            Create New Task
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusUpdate={handleStatusUpdate}
              onAssign={() => handleEditTask(task)}
              onDelete={() => handleDeleteTask(task.id)}
            />
          ))
        ) : (
          <p className="text-gray-400">No tasks found.</p>
        )}
      </div>

      <CreateTask
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onTaskCreated={fetchTasks}
        projectId=""
      />

      {selectedTask && (
        <EditTask
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen} 
          task={selectedTask}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </div>
  );
};

export default TaskPage;