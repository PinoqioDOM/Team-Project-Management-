import { useState } from "react";
import { supabase } from "../libraries/supabase";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePermissions } from "../hooks/usePermissions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; 
import { Calendar } from "@/components/ui/calendar"; 
import { format } from "date-fns"; 
import { CalendarIcon } from "lucide-react"; 
import { cn } from "@/libraries/utils"

interface CreateProjectProps {
  onProjectCreated: (projectId: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({ onProjectCreated, onOpenChange, open }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined); 

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
        .insert([{ name, description, due_date: dueDate }])
        .select('id'); 
      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const newProjectId = data[0].id; 
        setSuccess("Project created successfully!");
        setName("");
        setDescription("");
        setDueDate(undefined); 
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
            <label className="block text-sm font-medium text-purple-300">
              ბოლო ვადა
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal bg-gray-800 text-purple-200 border-purple-500 mt-1",
                    !dueDate && "text-purple-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>აირჩიე თარიღი</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 text-purple-200 border-purple-500">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                />
              </PopoverContent>
            </Popover>
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