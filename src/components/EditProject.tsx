import { useState, useEffect } from "react";
import { supabase } from "../libraries/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
}

interface EditProjectProps {
  project: Project;
  onOpenChange: (open: boolean) => void;
  onProjectUpdated: () => void;
  open: boolean;
}

const EditProject: React.FC<EditProjectProps> = ({ project, onOpenChange, onProjectUpdated, open }) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [status, setStatus] = useState(project.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(project.name);
    setDescription(project.description);
    setStatus(project.status);
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("projects")
        .update({ name, description, status })
        .eq("id", project.id);

      if (error) {
        throw error;
      }

      onProjectUpdated();
      onOpenChange(false);
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
          <DialogTitle className="text-purple-400">Edit Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-purple-300">
              Project Name
            </label>
            <Input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              <option value="planned">Planned</option>
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

export default EditProject;