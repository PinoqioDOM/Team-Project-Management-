import React from 'react';
import ProjectsPage from '../pages/ProjectsPage';
import TaskPage from '../pages/TaskPage';

const Board: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-extrabold text-center text-purple-400 mb-10">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900 rounded-lg shadow-xl p-6 shadow-purple-900/100"> 
          <h2 className="text-2xl font-bold text-purple-300 mb-6 border-b border-gray-700 pb-3">Your Projects</h2>
          <ProjectsPage />
        </div>

        <div className="bg-gray-900 rounded-lg shadow-xl p-6 shadow-purple-900/100"> 
          <h2 className="text-2xl font-bold text-purple-300 mb-6 border-b border-gray-700 pb-3">Your Tasks</h2>
          <TaskPage />
        </div>
      </div>
    </div>
  );
};

export default Board;
