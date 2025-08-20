import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../libraries/supabase";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

const Header: React.FC = () => {
  const { session, userData, loading } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loading) {
    return (
      <header className="bg-black border-b border-purple-500/50 px-6 py-4 flex items-center justify-between shadow-lg shadow-purple-500/10 sticky top-0 z-50">
        <h1 className="text-3xl font-semibold text-purple-400">OctariNox</h1>
      </header>
    );
  }

  return (
    <header className="bg-black border-b border-purple-500/50 px-6 py-3 flex items-center justify-between shadow-lg shadow-purple-500/10 sticky top-0 z-50">
      <Link to="/home">
        <h1 className="text-3xl font-semibold text-purple-400">OctariNox</h1>
      </Link>

      {/* Desktop Navigation Links - Shown on md and above, hidden below md */}
      <nav className="hidden md:flex space-x-8">
        {session && (
          <>
            <Link to="/tasks" className="text-purple-300 hover:text-white transition-colors font-medium">
              Task
            </Link>
            <Link to="/projects" className="text-purple-300 hover:text-white transition-colors font-medium">
              Project
            </Link>
            <Link to="/dashboard" className="text-purple-300 hover:text-white transition-colors font-medium">
              Dashboard
            </Link>
          </>
        )}
      </nav>

      {/* User Info and Menu Toggle (Hamburger for mobile, User Initial for desktop) */}
      {session ? (
        <div className="flex items-center space-x-4 relative">
          {/* User Name and Role (Desktop only, shown on md and above) */}
          <div className="hidden md:flex flex-col items-end">
            <span className="text-purple-300 font-medium">{userData?.name || "User"}</span>
            <span className="text-sm text-purple-500">{userData?.role || "Member"}</span>
          </div>
          
          <button
            onClick={toggleMenu}
            className="w-10 h-10 bg-purple-600 rounded-full cursor-pointer flex items-center justify-center text-white font-bold text-xl"
            aria-label="Toggle menu"
          >
            <span className="hidden md:inline">{userData?.name ? userData.name.charAt(0) : "U"}</span>
            <span className="md:hidden">☰</span>
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute top-12 right-0 bg-gray-800 rounded-md shadow-lg p-2 z-10 w-48 flex flex-col items-start">
              {/* User Info in Mobile Menu (only shows on mobile/tablet screens) */}
              <div className="md:hidden flex flex-col items-start px-4 py-2 w-full">
                <span className="text-purple-300 font-medium">{userData?.name || "User"}</span>
                <span className="text-sm text-purple-500">{userData?.role || "Member"}</span>
                <hr className="border-t border-slate-700 w-full my-2" />
              </div>

              {session && ( 
                <div className="md:hidden flex flex-col items-start w-full"> 
                  <Link
                    to="/tasks"
                    className="block px-4 py-2 text-sm text-purple-300 hover:text-white transition-colors w-full text-left"
                    onClick={() => setIsMenuOpen(false)} 
                  >
                    Task
                  </Link>
                  <Link
                    to="/projects"
                    className="block px-4 py-2 text-sm text-purple-300 hover:text-white transition-colors w-full text-left"
                    onClick={() => setIsMenuOpen(false)} 
                  >
                    Project
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-purple-300 hover:text-white transition-colors w-full text-left"
                    onClick={() => setIsMenuOpen(false)} 
                  >
                    Dashboard
                  </Link>
                  <hr className="border-t border-slate-700 w-full my-2" />
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-purple-300 hover:text-white transition-colors w-full text-left cursor-pointer"
              >
                გამოსვლა
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link to="/login" className="text-purple-300 hover:text-white transition-colors font-medium">
          შესვლა
        </Link>
      )}
    </header>
  );
};

export default Header;