
import { useEffect } from "react";
import { useAdminUI } from "../../store/admin-ui";

const Settings = () => {
  const { setActiveSection } = useAdminUI();
  
  useEffect(() => {
    setActiveSection("settings");
  }, [setActiveSection]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--admin-accent)]">Admin Settings</h1>
      
      <div className="bg-[var(--admin-border)] rounded-lg p-4 shadow-lg space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">General Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Site Name</label>
              <input 
                type="text" 
                className="w-full bg-[var(--admin-bg)] border border-[var(--admin-accent-2)]/30 rounded p-2"
                defaultValue="MakersImpulse"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Support Email</label>
              <input 
                type="email" 
                className="w-full bg-[var(--admin-bg)] border border-[var(--admin-accent-2)]/30 rounded p-2"
                defaultValue="support@makersimpulse.com"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Security</h3>
          <div className="flex items-center gap-2 mb-2">
            <input type="checkbox" defaultChecked id="2fa" />
            <label htmlFor="2fa">Require 2FA for admins</label>
          </div>
          
          <div className="flex items-center gap-2">
            <input type="checkbox" id="auto-logout" />
            <label htmlFor="auto-logout">Auto-logout after 30 minutes</label>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-[var(--admin-accent)] rounded hover:bg-[var(--admin-accent-2)] transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
