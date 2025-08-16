import { useState, useEffect } from "react";
import { supabase } from "../libraries/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

interface EditTaskProps {
  task: Task;
  onOpenChange: (open: boolean) => void;
  // Changed: onTaskUpdated now expects taskId (string) as an argument
  onTaskUpdated: (taskId: string) => void;
  open: boolean;
}

const EditTask: React.FC<EditTaskProps> = ({ task, onOpenChange, onTaskUpdated, open }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update local state when the 'task' prop changes
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ title, description, status })
        .eq("id", task.id); // Update the specific task by its ID

      if (error) {
        throw error;
      }

      onTaskUpdated(task.id); // Pass the updated task's ID back to the parent
      onOpenChange(false); // Close the dialog on successful update
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white border-purple-500">
        <DialogHeader>
          <DialogTitle className="text-purple-400">Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-purple-300">
              Task Title
            </label>
            <Input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-gray-800 text-purple-200 border-purple-500 mt-1"
            />
          </div>
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-purple-300">
              Description
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
              className="w-full bg-gray-800 text-purple-200 border border-purple-500 rounded-md p-2 mt-1"
            />
          </div>
          <div>
            <label htmlFor="edit-status" className="block text-sm font-medium text-purple-300">
              Status
            </label>
            <select
              id="edit-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-gray-800 text-purple-200 border border-purple-500 rounded-md p-2 mt-1"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTask;