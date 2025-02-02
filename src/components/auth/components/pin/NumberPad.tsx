import React from "react";
import { Button } from "@/components/ui/button";

interface NumberPadProps {
  onDigitPress: (digit: string) => void;
  disabled?: boolean;
}

export const NumberPad = ({ onDigitPress, disabled }: NumberPadProps) => {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <div className="grid grid-cols-3 gap-4">
      {digits.map((digit, index) => (
        <Button
          key={index}
          variant={digit === 'del' ? "destructive" : "outline"}
          className={`h-16 text-2xl font-bold ${!digit && 'invisible'}`}
          onClick={() => digit && onDigitPress(digit)}
          disabled={disabled}
        >
          {digit === 'del' ? '⌫' : digit}
        </Button>
      ))}
    </div>
  );
};