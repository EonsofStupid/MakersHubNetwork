import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RecoveryCode {
  id: string;
  code: string;
  used: boolean;
  used_at: string | null;
  created_at: string;
  expires_at: string;
  attempts: number;
  user_id: string;
}

export const RecoveryCodes = () => {
  const session = useSession();
  const { toast } = useToast();
  const [recoveryCodes, setRecoveryCodes] = useState<RecoveryCode[]>([]);

  useEffect(() => {
    if (session?.user) {
      loadRecoveryCodes();
    }
  }, [session]);

  const loadRecoveryCodes = async () => {
    try {
      const { data: codes, error } = await supabase
        .from('recovery_codes')
        .select('*')
        .eq('user_id', session?.user?.id)
        .eq('used', false);

      if (error) throw error;
      if (codes) setRecoveryCodes(codes);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load recovery codes",
      });
    }
  };

  const generateNewRecoveryCodes = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-backup-codes', {
        body: { user_id: session?.user?.id }
      });

      if (error) throw error;
      await loadRecoveryCodes();
      
      toast({
        title: "Success",
        description: "New recovery codes generated. Please save them securely.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate recovery codes",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Recovery Codes</h3>
          <p className="text-sm text-muted-foreground">Save these codes in a secure location</p>
        </div>
        <Button onClick={generateNewRecoveryCodes}>Generate New Codes</Button>
      </div>
      {recoveryCodes.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {recoveryCodes.map((codeObj) => (
            <code key={codeObj.id} className="bg-muted p-2 rounded">{codeObj.code}</code>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No recovery codes available.</p>
      )}
    </Card>
  );
};