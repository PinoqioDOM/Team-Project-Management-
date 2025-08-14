import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar"; 

const AvatarComponent: React.FC = () => {
  const [gender, setGender] = useState<"male" | "female" | null>(null);

  useEffect(() => {
    setGender("male");
  }, []);

  const avatarSrc = gender === "male" ? "/male-avatar.png" : "/female-avatar.png";

  return (
    <Avatar className="w-12 h-12">
      <AvatarImage src={avatarSrc} alt="User Avatar" />
      <AvatarFallback>{gender ? gender[0] : "U"}</AvatarFallback>
    </Avatar>
  );
};

export default AvatarComponent;