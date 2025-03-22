
import { useEffect } from "react";
import { useAdminUI } from "../../store/admin-ui";

const Themes = () => {
  const { setActiveSection } = useAdminUI();
  
  useEffect(() => {
    setActiveSection("themes");
  }, [setActiveSection]);

  const themes = [
    { id: 1, name: "Cyberpunk", primary: "#ff3cac", secondary: "#5ee7df" },
    { id: 2, name: "Night Rider", primary: "#8A2BE2", secondary: "#00FFFF" },
    { id: 3, name: "Hacker Green", primary: "#00FF00", secondary: "#003300" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--admin-accent)]">Theme Manager</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map(theme => (
          <div key={theme.id} className="bg-[var(--admin-border)] rounded-lg p-4 shadow-lg">
            <h3 className="text-lg font-medium mb-2">{theme.name}</h3>
            <div className="flex gap-2 mb-3">
              <div 
                className="w-8 h-8 rounded-full" 
                style={{ backgroundColor: theme.primary }}
              />
              <div 
                className="w-8 h-8 rounded-full" 
                style={{ backgroundColor: theme.secondary }}
              />
            </div>
            <div className="flex justify-between">
              <button className="px-2 py-1 bg-[var(--admin-accent-2)]/20 rounded text-xs">Edit</button>
              <button className="px-2 py-1 bg-[var(--admin-accent)]/20 rounded text-xs">Apply</button>
            </div>
          </div>
        ))}
        
        <div className="bg-[var(--admin-border)] rounded-lg p-4 shadow-lg border-2 border-dashed border-[var(--admin-accent-2)]/30 flex items-center justify-center">
          <button className="text-[var(--admin-accent-2)]">+ Create New Theme</button>
        </div>
      </div>
    </div>
  );
};

export default Themes;
