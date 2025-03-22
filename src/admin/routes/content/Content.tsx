
import { useEffect } from "react";
import { useAdminUI } from "../../store/admin-ui";

const Content = () => {
  const { setActiveSection } = useAdminUI();
  
  useEffect(() => {
    setActiveSection("content");
  }, [setActiveSection]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--admin-accent)]">Content Management</h1>
      
      <div className="bg-[var(--admin-border)] rounded-lg p-4 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Printer Parts</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--admin-accent-2)]/20">
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Category</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="border-b border-[var(--admin-accent-2)]/10">
                <td className="py-2">Part #{i}</td>
                <td className="py-2">Category #{i % 3 + 1}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded text-xs ${i % 2 === 0 ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                    {i % 2 === 0 ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <button className="px-2 py-1 bg-[var(--admin-accent-2)]/20 rounded text-xs">Edit</button>
                    <button className="px-2 py-1 bg-red-500/20 rounded text-xs">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Content;
