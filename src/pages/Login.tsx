
import { LoginSheet } from "@/components/MainNav/components/LoginSheet";
import { useState } from "react";

const Login = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginSheet isOpen={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
};

export default Login;
