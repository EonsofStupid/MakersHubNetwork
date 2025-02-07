
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from "@/features/admin/pages/dashboard";
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/components/auth/AuthProvider';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
