import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePermissions } from "../hooks/usePermissions";
import { Task } from "../services/taskService";

interface TaskCardProps {
 task: Task;
 onStatusUpdate: (taskId: string, status: Task['status']) => void;
 onAssign: (taskId: string) => void;
 onDelete: (taskId: string) => void; 
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusUpdate, onAssign, onDelete }) => {
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
     Assigned: {task.assigned_user?.name || task.assigned_to || 'Unassigned'}
    </p>
   
    {canUpdateTaskStatus && (
     <div className="flex gap-2 mt-3">
      <Button
       size="sm"
       variant="outline"
       onClick={() => onStatusUpdate(task.id, 'todo')}
       disabled={task.status === 'todo'}
      >
       Todo
      </Button>
      <Button
       size="sm"
       variant="outline"
       onClick={() => onStatusUpdate(task.id, 'in_progress')}
       disabled={task.status === 'in_progress'}
      >
       Progress
      </Button>
      <Button
       size="sm"
       variant="outline"
       onClick={() => onStatusUpdate(task.id, 'completed')}
       disabled={task.status === 'completed'}
      >
       Done
      </Button>
     </div>
    )}
   
    {canEditTask && (
     <div className="mt-2 flex gap-2"> {/* ღილაკების კონტეინერი */}
      <Button
       size="sm"
       className="w-full"
       onClick={() => onAssign(task.id)}
      >
       Assign
      </Button>
      <Button
       size="sm"
       variant="destructive" 
       className="w-full"
       onClick={() => onDelete(task.id)} 
      >
       Delete
      </Button>
     </div>
    )}
   </CardContent>
  </Card>
 );
};