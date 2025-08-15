import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "../../libraries/supabase";
import { useEffect, useState } from "react";

const Header: React.FC = () => {
const [userData, setUserData] = useState<{ gender?: string } | null>(null);

useEffect(() => {
const fetchUser = async () => {
const { data: { user } } = await supabase.auth.getUser();
if (user) {
const { data } = await supabase
  .from("users")
  .select("gender")
  .eq("email", user.email)
  .single();
  setUserData(data || null);
}
 };
 fetchUser();
}, []);

const avatarSrc = userData?.gender === "male" ? "/male-avatar.png" : "/female-avatar.png";

return (
 <header className="bg-transparent border-b border-purple-500/50 px-6 py-4 flex items-center justify-between shadow-lg shadow-purple-500/10 sticky top-0 z-50">
  <h1 className="text-3xl font-semibold text-purple-400">TeamEngine</h1>
  <nav className="flex space-x-8">
   <Link to="/team" className="text-purple-300 hover:text-white transition-colors font-medium">
    Task
   </Link>
   <Link to="/project" className="text-purple-300 hover:text-white transition-colors font-medium">
    Project
   </Link>
   <Link to="/dashboard" className="text-purple-300 hover:text-white transition-colors font-medium">
    Dashboard
   </Link>
  </nav>
  <Avatar className="w-12 h-12 border-2 border-purple-500">
   <AvatarImage src={avatarSrc} alt="User Avatar" />
   <AvatarFallback className="text-purple-400 bg-gray-800">
    {userData?.gender?.[0] || "U"}
   </AvatarFallback>
  </Avatar>
 </header>
);
};

export default Header;