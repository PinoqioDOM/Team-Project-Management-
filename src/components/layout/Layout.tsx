import { Outlet } from 'react-router-dom'

const Layout = () => {
 return (
   <div className="min-h-screen bg-black grid grid-rows-[auto_1fr] lg:grid-cols-[250px_1fr] lg:grid-rows-1">
     {/* Header */}
     <header className="bg-black border-b border-slate-800 p-4 lg:col-span-2 shadow-lg">
       Header
     </header>
     
     {/* Sidebar - hidden on mobile, visible on desktop */}
     <aside className="hidden lg:block bg-black border-r border-slate-800 p-4 shadow-lg">
       Sidebar
     </aside>
     
     {/* Main content */}
     <main className="p-4 bg-black text-white">
       <Outlet />
     </main>
   </div>
 )
}

export default Layout