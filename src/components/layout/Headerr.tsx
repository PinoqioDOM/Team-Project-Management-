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
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loading) {
    return (
      <header className="bg-transparent border-b border-purple-500/50 px-6 py-4 flex items-center justify-between shadow-lg shadow-purple-500/10 sticky top-0 z-50">
        <h1 className="text-3xl font-semibold text-purple-400">TeamEngine</h1>
      </header>
    );
  }

  return (
    <header className="bg-transparent border-b border-purple-500/50 px-6 py-4 flex items-center justify-between shadow-lg shadow-purple-500/10 sticky top-0 z-50">
      <h1 className="text-3xl font-semibold text-purple-400">OctariNox</h1>
      <nav className="flex space-x-8">
        {session && (
          <>
            <Link to="/team" className="text-purple-300 hover:text-white transition-colors font-medium">
              Task
            </Link>
            <Link to="/project" className="text-purple-300 hover:text-white transition-colors font-medium">
              Project
            </Link>
            <Link to="/dashboard" className="text-purple-300 hover:text-white transition-colors font-medium">
              Dashboard
            </Link>
          </>
        )}
      </nav>
      {session ? (
        <div className="flex items-center space-x-4 relative">
          <div className="flex flex-col items-end">
            <span className="text-purple-300 font-medium">{userData?.name || "User"}</span>
            <span className="text-sm text-purple-500">{userData?.role || "Member"}</span>
          </div>
          <div
            onClick={toggleMenu}
            className="w-10 h-10 bg-purple-600 rounded-full cursor-pointer flex items-center justify-center text-white font-bold"
          >
            {userData?.name ? userData.name.charAt(0) : "U"}
          </div>
          {isMenuOpen && (
            <div className="absolute top-12 right-0 bg-gray-800 rounded-md shadow-lg p-2 z-10">
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-purple-300 hover:text-white transition-colors w-full text-left cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link to="/login" className="text-purple-300 hover:text-white transition-colors font-medium">
          Login
        </Link>
      )}
    </header>
  );
};

export default Header;