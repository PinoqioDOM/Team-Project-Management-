import { createContext } from "react";
import { Session } from "@supabase/supabase-js";

interface UserData {
  name?: string;
  role?: string;
  id?: string;
}
interface AuthContextType {
  session: Session | null;
  userData: UserData | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  userData: null, 
  loading: true 
});