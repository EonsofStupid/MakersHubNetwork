import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1F2C] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:text-[#41f0db]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 bg-black/30 backdrop-blur-xl border border-white/10">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                extend: true,
                variables: {
                  default: {
                    colors: {
                      brand: '#41f0db',
                      brandAccent: '#ff0abe',
                      brandButtonText: 'white',
                      defaultButtonBackground: 'rgba(65, 240, 219, 0.1)',
                      defaultButtonBackgroundHover: 'rgba(65, 240, 219, 0.2)',
                      defaultButtonBorder: '#41f0db',
                      defaultButtonText: '#41f0db',
                      inputBackground: 'rgba(0, 0, 0, 0.3)',
                      inputBorder: 'rgba(65, 240, 219, 0.2)',
                      inputBorderHover: 'rgba(65, 240, 219, 0.4)',
                      inputBorderFocus: '#41f0db',
                      inputText: 'white',
                      inputPlaceholder: 'rgba(255, 255, 255, 0.4)',
                    },
                  },
                },
                className: {
                  container: 'space-y-4',
                  button: 'w-full h-12 rounded-lg transition-all duration-300',
                  label: 'text-sm font-medium text-[#41f0db]',
                  input: 'h-12 w-full rounded-lg px-4',
                  message: 'text-red-400 text-sm',
                  anchor: 'text-[#41f0db] hover:text-[#ff0abe] transition-colors',
                },
              }}
              theme="dark"
              providers={['github', 'google']}
              redirectTo={`${window.location.origin}/`}
            />
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;