import { useState, useEffect } from "react";
import { supabase } from "../libraries/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "../hooks/useAuth";
import { usePermissions } from "../hooks/usePermissions";

interface CreateTaskProps {
  projectId: string;
  onOpenChange: (open: boolean) => void;
  onTaskCreated: (taskId: string) => void;
  open: boolean;
}

interface User {
  id: string;
  email: string;
}

const CreateTask: React.FC<CreateTaskProps> = ({ projectId, onOpenChange, onTaskCreated, open }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [assignedTo, setAssignedTo] = useState<string | undefined>(undefined); 

  const { userData } = useAuth();
  const { isAdmin } = usePermissions();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, email");

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data as User[]);
      }
    };

    if (open) {
      if (isAdmin) {
        fetchUsers();
      }
      if (userData?.id) { 
        setAssignedTo(userData.id);
      }
    }
  }, [open, isAdmin, userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!userData) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("tasks")
        .insert([{
          title,
          description,
          status: "todo",
          project_id: projectId,
          created_by: userData.id,
          assigned_to: assignedTo || userData.id,
        }])
        .select('id');

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const newTaskId = data[0].id;
        setTitle("");
        setDescription("");
        setAssignedTo(userData.id);
        onTaskCreated(newTaskId);
        onOpenChange(false);
      } else {
        throw new Error("Task creation failed: ID not returned.");
      }
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
          <DialogTitle className="text-purple-400">Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-purple-300">
              Task Title
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-gray-800 text-purple-200 border-purple-500 mt-1"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-purple-300">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
              className="w-full bg-gray-800 text-purple-200 border border-purple-500 rounded-md p-2 mt-1"
            />
          </div>
          {isAdmin && (
            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium text-purple-300">
                Assign To
              </label>
              <select
                id="assignedTo"
                value={assignedTo || ""}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-gray-800 text-purple-200 border border-purple-500 rounded-md p-2 mt-1"
              >
                <option value="">Select user...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
          >
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTask;