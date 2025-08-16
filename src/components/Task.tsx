import { useState, useEffect, useCallback } from "react";
import { supabase } from "../libraries/supabase";
import { Button } from "./ui/button";
import CreateTask from "./CreateTask";
import EditTask from "./EditTask";
import { Dialog } from "@/components/ui/dialog";

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
  userRole: string;
  currentUserId: string;
}

const Tasks: React.FC<TasksProps> = ({ projectId, userRole, currentUserId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (userRole === "member") {
        query = query.eq("assigned_to", currentUserId);
      }

      const { data, error } = await query;

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
  }, [projectId, userRole, currentUserId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskCreated = (taskId: string) => {
    console.log("Task Created/Updated, ID:", taskId);
    fetchTasks();
    setIsCreateModalOpen(false);
  };

  const handleOpenChangeCreateModal = (open: boolean) => {
    setIsCreateModalOpen(open);
  };

  const handleOpenChangeEditModal = (open: boolean) => {
    setIsEditModalOpen(open);
    if (!open) {
      setSelectedTask(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (userRole !== "admin") {
      setError("You do not have permission to delete tasks.");
      return;
    }
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

  const handleEditTask = (task: Task) => {
    if (userRole !== "admin") {
      setError("You do not have permission to edit tasks.");
      return;
    }
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleTaskUpdated = () => { // Removed taskId parameter
    setIsEditModalOpen(false);
    fetchTasks();
  };

  if (loading) {
    return <div className="text-center text-purple-400 mt-4">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">Error: {error}</div>;
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold text-purple-400">Tasks</h3>
        {userRole === "admin" && (
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
            Create Task
          </Button>
        )}
      </div>

      {tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-gray-900 border border-purple-600 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold text-purple-300">{task.title}</h4>
                  <p className="text-purple-400 text-sm mt-1">{task.description}</p>
                </div>
                {userRole === "admin" && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleEditTask(task)}
                      variant="ghost"
                      className="p-1 text-blue-400 hover:text-blue-500"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteTask(task.id)}
                      variant="ghost"
                      className="p-1 text-red-400 hover:text-red-500"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 mt-2 text-sm text-purple-500">
                <span>Status: {task.status}</span>
                <span>Assigned To: {task.assigned_to.substring(0, 8)}...</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-purple-400">No tasks found for this project.</p>
      )}

      <Dialog open={isCreateModalOpen} onOpenChange={handleOpenChangeCreateModal}>
        <CreateTask
          projectId={projectId}
          open={isCreateModalOpen}
          onOpenChange={handleOpenChangeCreateModal}
          onTaskCreated={handleTaskCreated}
        />
      </Dialog>

      {selectedTask && (
        <Dialog open={isEditModalOpen} onOpenChange={handleOpenChangeEditModal}>
          <EditTask
            task={selectedTask}
            open={isEditModalOpen}
            onOpenChange={handleOpenChangeEditModal}
            onTaskUpdated={handleTaskUpdated}
          />
        </Dialog>
      )}
    </div>
  );
};

export default Tasks;