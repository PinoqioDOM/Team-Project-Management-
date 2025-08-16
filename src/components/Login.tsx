import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "../libraries/supabase";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsOpen(true);
      } else {
        navigate("/home");
      }
    };
    checkUserSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setIsOpen(false);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError((err as Error).message || "Invalid credentials");
    }
  };

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/", { replace: true });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-6 bg-black border border-purple-500 rounded-md shadow-2xl shadow-purple-500/50 [&>button>svg]:w-6 [&>button>svg]:h-6 [&>button]:text-white [&>button]:hover:text-purple-400 [&>button]:cursor-pointer">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-purple-400">Login</DialogTitle>
          <DialogDescription className="text-purple-300">
            Enter your information to access your dashboard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="grid gap-4 py-4">
          {error && <p className="text-red-400 text-center bg-red-900/50 p-2 rounded-md border border-red-500">{error}</p>}
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium text-purple-400">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 text-purple-200 placeholder:text-purple-400 border-purple-500"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium text-purple-400">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 text-purple-200 placeholder:text-purple-400 border-purple-500"
            />
          </div>
          <Button type="submit" className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer">
            შესვლა
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Login;