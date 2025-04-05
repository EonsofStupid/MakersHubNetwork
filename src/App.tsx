
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import LoginPage from "./pages/Login";
import { AdminLayout } from "./admin/components/layouts/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import { ThemeInitializer } from "@/components/theme/ThemeInitializer";
import { DebugProvider } from "@/admin/providers/DebugProvider";

function App() {
  return (
    <ThemeInitializer>
      <DebugProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </DebugProvider>
    </ThemeInitializer>
  );
}

export default App;
