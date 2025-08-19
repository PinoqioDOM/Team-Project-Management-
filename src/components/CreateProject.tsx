import { useState } from "react";
import { supabase } from "../libraries/supabase";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePermissions } from "../hooks/usePermissions";

interface CreateProjectProps {
  onProjectCreated: (projectId: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({ onProjectCreated, onOpenChange, open }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("planned");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { isAdmin } = usePermissions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!isAdmin) {
      setError("You do not have permission to create projects.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("projects")
        .insert([{ name, description, status }])
        .select('id'); 
      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const newProjectId = data[0].id; 
        setSuccess("Project created successfully!");
        setName("");
        setDescription("");
        setStatus("planned");
        onProjectCreated(newProjectId);
        onOpenChange(false);
      } else {
        throw new Error("პროექტის შექმნა ვერ მოხერხდა: ID არ დაბრუნებულა.");
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
          <DialogTitle className="text-purple-400">Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-purple-300">
              Project Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-purple-300">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-gray-800 text-purple-200 border border-purple-500 rounded-md p-2 mt-1"
            >
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <Button
            type="submit"
            disabled={loading || !isAdmin}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
          >
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProject;