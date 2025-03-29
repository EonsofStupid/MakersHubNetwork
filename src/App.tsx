
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AdminProvider } from "@/admin/context/AdminContext";

// Import pages
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Login from "./pages/Login";

// Import UI components
import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";

import "./App.css";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <ThemeProvider defaultTheme="dark" storageKey="makers-impulse-theme">
      <AuthProvider>
        <AdminProvider>
          {!isAdminRoute && <MainNav />}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
          <Toaster />
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
