import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Login from "@/pages/Login";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginModal = ({ isOpen, onOpenChange }: LoginModalProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button className="mad-scientist-hover">
          Login
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[400px] backdrop-blur-xl bg-background/80 border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)] transform-gpu"
        style={{
          clipPath: "polygon(0 0, 100% 0, 95% 15%, 100% 30%, 95% 85%, 100% 100%, 0 100%)",
          transform: "translateX(0) skew(-5deg)",
          transformOrigin: "100% 50%",
        }}
      >
        <Login onSuccess={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
};