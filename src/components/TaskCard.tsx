import React from "react"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePermissions } from "../hooks/usePermissions";
import { Task } from "../services/taskService";
import CommentsSection from "./CommentsSection";

interface TaskCardProps {
 task: Task;
 onStatusUpdate: (taskId: string, status: Task['status']) => void;
 onAssign: (taskId: string) => void;
 onDelete: (taskId: string) => void; 
}

export const TaskCard: React.FC<TaskCardProps> = React.memo(({ task, onStatusUpdate, onAssign, onDelete }) => {
 const { canEditTask, canUpdateTaskStatus } = usePermissions();

 const getStatusColor = (status: string) => {
  switch (status) {
   case 'todo': return 'bg-gray-600 text-white'; 
   case 'in_progress': return 'bg-blue-600 text-white'; 
   case 'completed': return 'bg-green-600 text-white'; 
   default: return 'bg-gray-600 text-white';
  }
 };

 return (
  <Card className="
   bg-gray-900 
   border border-purple-600/50 
   rounded-lg 
   shadow-xl 
   shadow-purple-900/40 
   hover:shadow-purple-700/60 
   transition-all duration-300 
   hover:scale-[1.02]
   flex  h-full
   w-full
   max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl
   mx-auto
  ">
   <CardHeader className="p-3 sm:p-4 border-b border-purple-700/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
    <CardTitle className="text-base sm:text-lg font-semibold text-purple-300 truncate cursor-pointer w-full sm:w-auto sm:mr-2">
     {task.title}
    </CardTitle>
    <Badge className={`${getStatusColor(task.status)} px-2 sm:px-3 py-1 text-xs rounded-full font-medium cursor-pointer shrink-0`}>
     {task.status.replace('_', ' ')}
    </Badge>
   </CardHeader>
   <CardContent className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
    <div>
     <p className="text-gray-400 text-xs sm:text-sm mb-3 overflow-hidden text-ellipsis max-h-12 sm:max-h-16 cursor-pointer leading-tight">
      {task.description}
     </p>
     <p className="text-gray-400 text-xs mb-4 cursor-pointer">
      Assigned: {task.assigned_user?.name || task.assigned_to || 'Unassigned'}
     </p>
    </div>
    
    {canUpdateTaskStatus && (
     <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 mt-auto pt-2 border-t border-gray-700/50">
      <Button
       size="sm"
       className="bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600 rounded-md flex-1 min-w-0 cursor-pointer text-xs sm:text-sm py-2"
       onClick={() => onStatusUpdate(task.id, 'todo')}
       disabled={task.status === 'todo'}
      >
       Todo
      </Button>
      <Button
       size="sm"
       className="bg-blue-700 hover:bg-blue-600 text-white rounded-md flex-1 min-w-0 cursor-pointer text-xs sm:text-sm py-2"
       onClick={() => onStatusUpdate(task.id, 'in_progress')}
       disabled={task.status === 'in_progress'}
      >
       Progress
      </Button>
      <Button
       size="sm"
       className="bg-green-700 hover:bg-green-600 text-white rounded-md flex-1 min-w-0 cursor-pointer text-xs sm:text-sm py-2"
       onClick={() => onStatusUpdate(task.id, 'completed')}
       disabled={task.status === 'completed'}
      >
       Done
      </Button>
     </div>
    )}
    
    {canEditTask && (
     <div className="mt-2 flex flex-col gap-1 sm:gap-2 pt-2 border-t border-gray-700/50"> 
      <Button
       size="sm"
       className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md cursor-pointer text-xs sm:text-sm py-2"
       onClick={() => onAssign(task.id)}
      >
       Assign
      </Button>
      <Button
       size="sm"
       variant="destructive" 
       className="w-full bg-red-600 hover:bg-red-700 text-white rounded-md cursor-pointer text-xs sm:text-sm py-2"
       onClick={() => onDelete(task.id)} 
      >
       Delete
      </Button>
     </div>
    )}

    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700/50 cursor-pointer">
     <CommentsSection parentId={task.id} parentType="task" />
    </div>
   </CardContent>
  </Card>
 );
});

export default TaskCard;