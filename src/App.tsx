
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from "@/features/admin/pages/dashboard";
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;

