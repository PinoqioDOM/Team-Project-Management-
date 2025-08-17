import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePermissions } from "../hooks/usePermissions";
import { Task } from "../services/taskService";

interface TaskCardProps {
  task: Task;
  onStatusUpdate: (taskId: string, status: Task['status']) => void;
  onAssign: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusUpdate, onAssign }) => {
  const { canEditTask, canUpdateTaskStatus } = usePermissions();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-500';
      case 'in_progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white text-sm">{task.title}</CardTitle>
        <Badge className={getStatusColor(task.status)}>
          {task.status.replace('_', ' ')}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 text-xs mb-2">{task.description}</p>
        <p className="text-gray-400 text-xs">
          Assigned: {task.assigned_user?.name || 'Unassigned'}
        </p>
        
        {canUpdateTaskStatus && (
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusUpdate(task.id, 'todo')}
              disabled={task.status === 'todo'}
            >
              To Do
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusUpdate(task.id, 'in_progress')}
              disabled={task.status === 'in_progress'}
            >
              In Progress
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusUpdate(task.id, 'completed')}
              disabled={task.status === 'completed'}
            >
              Completed
            </Button>
          </div>
        )}
        
        {canEditTask && (
          <Button
            size="sm"
            className="mt-2 w-full"
            onClick={() => onAssign(task.id)}
          >
            Assign
          </Button>
        )}
      </CardContent>
    </Card>
  );
};