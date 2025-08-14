import Logo from '../../assets/Team.png'

const Header = () => {
  return (
    <header className="bg-black border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-lg">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img 
          src={Logo} 
          alt="Logo" 
          className="h-8 w-8 object-contain"
        />
        <span className="font-semibold text-lg hidden sm:block text-white">Company Name</span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6">
        <a href="#" className="text-slate-400 hover:text-white hover:shadow-md hover:bg-slate-800 px-3 py-2 rounded-lg border border-transparent hover:border-slate-700 transition-all duration-200">Dashboard</a>
        <a href="#" className="text-slate-400 hover:text-white hover:shadow-md hover:bg-slate-800 px-3 py-2 rounded-lg border border-transparent hover:border-slate-700 transition-all duration-200">Projects</a>
        <a href="#" className="text-slate-400 hover:text-white hover:shadow-md hover:bg-slate-800 px-3 py-2 rounded-lg border border-transparent hover:border-slate-700 transition-all duration-200">Tasks</a>
      </nav>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        {/* Theme toggle */}
        <button className="p-2 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-800 hover:shadow-md text-slate-400 hover:text-white transition-all duration-200">
          🌙
        </button>
        
        {/* Mobile menu button */}
        <button className="md:hidden p-2 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-800 hover:shadow-md text-slate-400 hover:text-white transition-all duration-200">
          ☰
        </button>

        {/* User avatar */}
        <div className="w-8 h-8 bg-slate-700 rounded-full border border-slate-800 hover:border-slate-600 hover:shadow-md transition-all duration-200 cursor-pointer"></div>
      </div>
    </header>
  )
}

export default Header