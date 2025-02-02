import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TwoFactorSetup } from "./TwoFactorSetup";

export const MFASettings = () => {
  const session = useSession();
  const { toast } = useToast();
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  const handleToggleMFA = async () => {
    if (!mfaEnabled) {
      setShowSetup(true);
    } else {
      // Disable MFA
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            two_factor_enabled: false,
            two_factor_secret: null,
            backup_codes: null
          })
          .eq('id', session?.user?.id);

        if (error) throw error;

        setMfaEnabled(false);
        toast({
          title: "2FA Disabled",
          description: "Two-factor authentication has been disabled.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to disable 2FA. Please try again.",
        });
      }
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Two-Factor Authentication</h2>
          <p className="text-muted-foreground">
            Add an extra layer of security to your account
          </p>
        </div>
        <Switch
          checked={mfaEnabled}
          onCheckedChange={handleToggleMFA}
        />
      </div>

      {showSetup && !mfaEnabled && (
        <TwoFactorSetup />
      )}
    </Card>
  );
};