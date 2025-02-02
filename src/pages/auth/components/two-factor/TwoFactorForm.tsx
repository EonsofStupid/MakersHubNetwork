import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface TwoFactorFormProps {
  code: string;
  isLoading: boolean;
  error: string | null;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => void;
}

export const TwoFactorForm = ({
  code,
  isLoading,
  error,
  onChange,
  onSubmit,
  onResend
}: TwoFactorFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          maxLength={6}
          className="text-center text-2xl tracking-widest"
          disabled={isLoading}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={isLoading || code.length !== 6}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Verify"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onResend}
          disabled={isLoading}
        >
          Resend Code
        </Button>
      </div>
    </form>
  );
};