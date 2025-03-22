
import { useEffect } from "react";
import { useAdminUI } from "../../store/admin-ui";

const Analytics = () => {
  const { setActiveSection } = useAdminUI();
  
  useEffect(() => {
    setActiveSection("analytics");
  }, [setActiveSection]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--admin-accent)]">Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[var(--admin-border)] rounded-lg p-4 shadow-lg">
          <h3 className="text-lg font-medium mb-4">Site Visitors</h3>
          <div className="h-40 flex items-end justify-between gap-1">
            {[30, 45, 25, 60, 40, 80, 65].map((value, i) => (
              <div 
                key={i} 
                className="bg-gradient-to-t from-[var(--admin-accent)] to-[var(--admin-accent-2)] rounded-t"
                style={{ height: `${value}%`, width: '12%' }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-[var(--admin-text-secondary)]">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
        
        <div className="bg-[var(--admin-border)] rounded-lg p-4 shadow-lg">
          <h3 className="text-lg font-medium mb-4">Top Categories</h3>
          <div className="space-y-3">
            {[70, 55, 40, 25, 10].map((value, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Category #{i+1}</span>
                  <span>{value}%</span>
                </div>
                <div className="h-2 bg-[var(--admin-bg)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[var(--admin-accent)] to-[var(--admin-accent-2)]"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
