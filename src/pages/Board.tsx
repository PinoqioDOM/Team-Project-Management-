// src/pages/Board.tsx
import { useState } from "react";
import Projects from "../components/Projects";
import CreateProject from "../components/CreateProject";

const Board = () => {
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const handleProjectCreated = () => {
    setShouldRefresh(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="p-8">
        <h1 className="text-4xl font-bold text-center text-purple-400 mb-8">Projects Dashboard</h1>
        
        <CreateProject onProjectCreated={handleProjectCreated} />

        <Projects shouldRefresh={shouldRefresh} />

      </main>
    </div>
  );
};

export default Board;