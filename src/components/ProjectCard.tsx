import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CommentsSection from "@/components/CommentsSection";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    status: "planned" | "in-progress" | "completed";
  };
  onEdit: () => void;
  onDelete: () => void;
}

const statusColors = {
  planned: "bg-blue-600",
  "in-progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ project, onEdit, onDelete }) => {
  return (
    <Card className="
      bg-gray-900 
      border border-purple-600/50 
      rounded-xl 
      shadow-xl 
      shadow-purple-900/40 
      hover:shadow-purple-700/60 
      transition-all duration-300 
      hover:scale-[1.02]
      flex flex-col h-full
      w-full
      max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl
      mx-auto
      cursor-pointer
    ">
      <CardHeader className="p-3 sm:p-4 border-b border-purple-700/30">
        <CardTitle className="text-base sm:text-lg font-semibold text-purple-300">
          {project.name}
        </CardTitle>
        <CardDescription className="text-gray-400 text-xs sm:text-sm overflow-hidden text-ellipsis max-h-12 sm:max-h-16 leading-tight">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-2">
          <Badge className={`${statusColors[project.status]} text-white capitalize px-2 sm:px-3 py-1 text-xs rounded-full font-medium shrink-0`}>
            {project.status}
          </Badge>
          <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-md w-full sm:w-auto text-xs sm:text-sm py-2"
              onClick={onEdit}
            >
              Edit
            </Button>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white rounded-md w-full sm:w-auto text-xs sm:text-sm py-2"
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
        </div>
                
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700/50">
          <CommentsSection parentId={project.id} parentType="project" />
        </div>
      </CardContent>
    </Card>
  );
});

export default ProjectCard;