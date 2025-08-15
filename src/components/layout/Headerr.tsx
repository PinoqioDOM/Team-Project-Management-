import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../libraries/supabase";
import { useAuth } from "../../hooks/useAuth"; 

const Header: React.FC = () => {
  const { session, userData, loading } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
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
      <h1 className="text-3xl font-semibold text-purple-400">TeamEngine</h1>
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
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end">
            <span className="text-purple-300 font-medium">{userData?.name || "User"}</span>
            <span className="text-sm text-purple-500">{userData?.role || "Member"}</span>
          </div>
          <button 
            onClick={handleLogout} 
            className="text-purple-300 hover:text-white transition-colors font-medium cursor-pointer"
          >
            Logout
          </button>
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