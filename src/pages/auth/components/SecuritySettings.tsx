import { SecurityAuditLog } from "./security/SecurityAuditLog";
import { RecoveryCodes } from "./security/RecoveryCodes";
import { TrustedDevices } from "./security/TrustedDevices";
import { ActiveSessions } from "./security/ActiveSessions";
import { PinSetup } from "@/components/auth/components/security/PinSetup";

export const SecuritySettings = () => {
  return (
    <div className="space-y-6">
      <PinSetup />
      <RecoveryCodes />
      <TrustedDevices />
      <ActiveSessions />
      <SecurityAuditLog />
    </div>
  );
};