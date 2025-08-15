import { useState, useEffect } from "react";
import { supabase } from "../libraries/supabase";
import { Session } from "@supabase/supabase-js";

interface UserData {
  gender?: string;
  name?: string;
  role?: string;
}

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndUser = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        const { data } = await supabase
          .from("users")
          .select("name, role")
          .eq("id", session.user.id) 
          .single();
        setUserData(data || null);
      } else {
        setUserData(null);
      }
      setLoading(false);
    };

    fetchSessionAndUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          fetchSessionAndUser();
        } else {
          setUserData(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { session, userData, loading };
};