
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LoginSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginSheet = ({ isOpen, onOpenChange }: LoginSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="cyber-gradient-text">Sign In</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm">Email</label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm">Password</label>
            <Input id="password" type="password" placeholder="Enter your password" />
          </div>
          <Button className="w-full mt-6 cyber-button electric-text">
            Sign In
          </Button>
          <div className="text-center mt-4">
            <span className="text-sm text-muted-foreground">Don't have an account? </span>
            <Button variant="link" className="text-sm p-0 h-auto">Register</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
