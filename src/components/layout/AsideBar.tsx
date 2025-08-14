const AsideBar = () => {
 return (
   <aside className="bg-black border-r border-slate-800 h-full w-full lg:w-64">
     <div className="p-4">
       <nav className="space-y-2">
         <a href="/dashboard" className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200">
           <span>📊</span>
           <span>Dashboard</span>
         </a>
         <a href="/projects" className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200">
           <span>📁</span>
           <span>Projects</span>
         </a>
         <a href="/tasks" className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200">
           <span>✅</span>
           <span>Tasks</span>
         </a>
         <a href="/team" className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200">
           <span>👥</span>
           <span>Team</span>
         </a>
         <a href="/settings" className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200">
           <span>⚙️</span>
           <span>Settings</span>
         </a>
       </nav>
     </div>
   </aside>
 );
};

export default AsideBar;