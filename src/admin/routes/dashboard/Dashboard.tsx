
import { useEffect } from "react";
import { useAdminUI } from "../../store/admin-ui";

const Dashboard = () => {
  const { setActiveSection } = useAdminUI();
  
  useEffect(() => {
    setActiveSection("dashboard");
  }, [setActiveSection]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--admin-accent)]">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Stats Cards */}
        <div className="bg-[var(--admin-border)] rounded-lg p-4 shadow-lg">
          <h3 className="text-[var(--admin-accent-2)] font-medium">Total Users</h3>
          <p className="text-3xl font-bold">1,234</p>
        </div>
        
        <div className="bg-[var(--admin-border)] rounded-lg p-4 shadow-lg">
          <h3 className="text-[var(--admin-accent-2)] font-medium">Active Projects</h3>
          <p className="text-3xl font-bold">56</p>
        </div>
        
        <div className="bg-[var(--admin-border)] rounded-lg p-4 shadow-lg">
          <h3 className="text-[var(--admin-accent-2)] font-medium">Printer Parts</h3>
          <p className="text-3xl font-bold">789</p>
        </div>
      </div>
      
      <div className="bg-[var(--admin-border)] rounded-lg p-4 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border-b border-[var(--admin-accent-2)]/20 pb-2">
              <p className="text-sm">User action #{i}</p>
              <p className="text-xs text-[var(--admin-text-secondary)]">2 hours ago</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
