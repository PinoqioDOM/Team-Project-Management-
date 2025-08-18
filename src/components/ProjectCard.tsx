import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "./ui/badge";
import CommentsSection from "./CommentsSection"; 

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
  planned: "bg-blue-500",
  "in-progress": "bg-yellow-500",
  completed: "bg-green-500",
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  return (
    <Card className="bg-black text-white border-purple-500 shadow-md shadow-purple-500/20">
      <CardHeader>
        <CardTitle className="text-purple-400">{project.name}</CardTitle>
        <CardDescription className="text-gray-400">{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Badge className={`${statusColors[project.status]} text-white capitalize`}>{project.status}</Badge>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="text-white border-purple-500 hover:bg-purple-600"
              onClick={onEdit}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              className="text-white border-red-500 hover:bg-red-600"
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
        </div>
        
        <div className="mt-4">
          <CommentsSection parentId={project.id} parentType="project" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;