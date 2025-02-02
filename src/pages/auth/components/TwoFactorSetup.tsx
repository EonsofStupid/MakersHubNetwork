import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TOTPResponse {
  secret: string;
  qr_code: string;
}

export const TwoFactorSetup = () => {
  const [isSetup, setIsSetup] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [secret, setSecret] = useState('');
  const { toast } = useToast();

  const initiate2FA = async () => {
    try {
      const { data, error } = await supabase.functions.invoke<TOTPResponse>('generate-2fa-secret');
      if (error) throw error;
      
      setSecret(data.secret);
      setQrCode(data.qr_code);
      setIsSetup(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize 2FA setup",
        variant: "destructive",
      });
    }
  };

  const verify2FA = async () => {
    try {
      const { error } = await supabase.functions.invoke('verify-2fa-setup', {
        body: {
          secret_key: secret,
          token: verificationCode
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Two-factor authentication has been enabled",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid verification code",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Two-Factor Authentication Setup</h2>
          <p className="text-muted-foreground">
            Enhance your account security by enabling two-factor authentication
          </p>
        </div>

        {!isSetup ? (
          <Button onClick={initiate2FA}>
            Begin Setup
          </Button>
        ) : (
          <div className="space-y-4">
            {qrCode && (
              <div className="space-y-2">
                <Label>Scan QR Code</Label>
                <div className="flex justify-center">
                  <img src={qrCode} alt="2FA QR Code" className="max-w-[200px]" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="verification">Verification Code</Label>
              <Input
                id="verification"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                maxLength={6}
              />
            </div>

            <Button onClick={verify2FA} disabled={verificationCode.length !== 6}>
              Verify and Enable
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};