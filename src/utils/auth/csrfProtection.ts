import { supabase } from "@/integrations/supabase/client";

const CSRF_TOKEN_KEY = 'csrf_token';

export const generateCSRFToken = (): string => {
  const token = crypto.randomUUID();
  sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  return token;
};

export const validateCSRFToken = (token: string): boolean => {
  const storedToken = sessionStorage.getItem(CSRF_TOKEN_KEY);
  return token === storedToken;
};

export const clearCSRFToken = (): void => {
  sessionStorage.removeItem(CSRF_TOKEN_KEY);
};

export const attachCSRFToken = async () => {
  const token = generateCSRFToken();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    await supabase.functions.invoke('validate-csrf', {
      body: { token }
    });
  }
  
  return token;
};