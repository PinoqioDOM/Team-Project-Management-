import React from 'react';
import ProjectsPage from '@/pages/ProjectsPage'; 
import TaskPage from '@/pages/TaskPage';     

const Board: React.FC = React.memo(() => {
  return (
    <div className="min-h-screen bg-black text-white p-3 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-purple-400 mb-6 sm:mb-8 lg:mb-10">Dashboard</h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
        <div className="bg-gray-900 rounded-lg shadow-xl p-3 sm:p-4 lg:p-6 shadow-purple-900/100 border border-purple-600/50"> 
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-300 mb-4 sm:mb-6 border-b border-gray-700 pb-2 sm:pb-3">Your Projects</h2>
          <ProjectsPage />
        </div>

        <div className="bg-gray-900 rounded-lg shadow-xl p-3 sm:p-4 lg:p-6 shadow-purple-900/100 border border-purple-600/50"> 
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-300 mb-4 sm:mb-6 border-b border-gray-700 pb-2 sm:pb-3">Your Tasks</h2>
          <TaskPage />
        </div>
      </div>
    </div>
  );
});

export default Board;