
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { showDragOverlayAtom, dragTargetAtom } from "../store/atoms";
import { useAdminUI } from "../store/admin-ui";

type IconMapping = {
  [key: string]: string;
}

// Map of icon IDs to icon elements - could be replaced with actual icons
const iconMap: IconMapping = {
  dashboard: "📊",
  users: "👥",
  settings: "⚙️",
  themes: "🎨",
  content: "📝",
  analytics: "📈"
};

export const AdminTopNav = () => {
  const { scrollY, pinnedIcons, setSidebar } = useAdminUI();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDragOverlay] = useAtom(showDragOverlayAtom);
  const [dragTarget] = useAtom(dragTargetAtom);
  const navigate = useNavigate();

  useEffect(() => {
    setIsScrolled(scrollY > 50);
  }, [scrollY]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Logic for handling the drop would be implemented here
    console.log("Item dropped in top nav");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const toggleSidebar = () => {
    setSidebar(!useAdminUI.getState().sidebarExpanded);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 flex items-center justify-between
        ${isScrolled ? "bg-[var(--admin-accent)] shadow-lg h-14" : "bg-transparent h-16"} 
        ${isScrolled ? "clip-trapezoid" : ""}`}
    >
      <div className="flex items-center px-4">
        <button
          onClick={toggleSidebar}
          className="w-8 h-8 flex items-center justify-center hover:bg-[rgba(255,255,255,0.2)] rounded-full mr-4"
        >
          {/* Menu icon */}
          <span className="text-white">☰</span>
        </button>
        
        <div 
          className="flex gap-3 items-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {pinnedIcons.map((iconId) => (
            <div
              key={iconId}
              className="h-10 w-10 bg-[var(--admin-accent-2)] rounded-full hover:scale-105 hover-glow flex items-center justify-center cursor-pointer transition-all duration-300"
              onClick={() => navigate(`/admin/${iconId}`)}
            >
              <span className="text-lg">{iconMap[iconId] || '🔍'}</span>
            </div>
          ))}
          
          {showDragOverlay && (
            <div className={`h-10 w-10 border-2 border-dashed rounded-full ${dragTarget ? 'pulse-border' : ''}`}>
              <span className="flex items-center justify-center h-full text-sm">+</span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => navigate("/")}
        className="text-sm font-bold text-white hover:text-[var(--admin-accent-2)] px-4 py-2 mr-4 transition-all duration-300"
      >
        Return to Site
      </button>
    </div>
  );
};
