import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js"; 
import WelcomePng from "../assets/Hacker.png";
import { supabase } from "../libraries/supabase";

const Home = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-center p-4">
      <div className="mb-8">
        {user && (
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            გამარჯობა🤖
          </h1>
        )}
        <p className="text-xl sm:text-2xl text-purple-300">
          დავიწყოთ დამპლური თამაშები!
        </p>
      </div>

      <div className="relative">
        <img
          src={WelcomePng}
          alt="Welcome"
          className="w-full max-w-lg rounded-lg"
        />
      </div>
    </div>
  );
};

export default Home;