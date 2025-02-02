export type PinVerificationResponse = {
  success: boolean;
  message?: string;
  locked_until?: string | null;
};

export type PinSetupResponse = {
  success: boolean;
  message: string;
  locked_until?: string | null;
};