
import { Toaster } from "@/shared/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { PublicRoutes } from "./routes/PublicRoutes";
import { AuthProvider } from "@/auth/context/AuthContext";
import { ThemeProvider } from "@/shared/ui/theme-provider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <BrowserRouter>
          <PublicRoutes />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
