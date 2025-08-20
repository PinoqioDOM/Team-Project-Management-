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
    ">
      <CardHeader className="p-4 border-b border-purple-700/30">
        <CardTitle className="text-lg font-semibold text-purple-300">
          {project.name}
        </CardTitle>
        <CardDescription className="text-gray-400 text-sm overflow-hidden text-ellipsis max-h-16">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <Badge className={`${statusColors[project.status]} text-white capitalize px-3 py-1 text-xs rounded-full font-medium`}>
            {project.status}
          </Badge>
          <div className="flex space-x-2">
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-md"
              onClick={onEdit}
            >
              Edit
            </Button>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white rounded-md"
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <CommentsSection parentId={project.id} parentType="project" />
        </div>
      </CardContent>
    </Card>
  );
});

export default ProjectCard;