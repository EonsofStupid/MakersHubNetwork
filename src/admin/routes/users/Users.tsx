
import { useEffect } from "react";
import { useAdminUI } from "../../store/admin-ui";

const Users = () => {
  const { setActiveSection } = useAdminUI();
  
  useEffect(() => {
    setActiveSection("users");
  }, [setActiveSection]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--admin-accent)]">Users Management</h1>
      
      <div className="bg-[var(--admin-border)] rounded-lg p-4 shadow-lg">
        <h2 className="text-xl font-bold mb-4">User List</h2>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between border-b border-[var(--admin-accent-2)]/20 py-2">
              <div>
                <p className="font-medium">User #{i}</p>
                <p className="text-xs text-[var(--admin-text-secondary)]">user{i}@example.com</p>
              </div>
              <div className="flex gap-2">
                <button className="px-2 py-1 bg-[var(--admin-accent-2)]/20 rounded text-xs">Edit</button>
                <button className="px-2 py-1 bg-red-500/20 rounded text-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
