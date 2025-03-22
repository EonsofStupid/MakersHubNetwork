
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { hoveredIconAtom, dragSourceAtom, showDragOverlayAtom } from "../store/atoms";
import { useAdminUI } from "../store/admin-ui";

interface SidebarIcon {
  id: string;
  label: string;
  icon: string;
}

const sidebarIcons: SidebarIcon[] = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "users", label: "Users", icon: "👥" },
  { id: "settings", label: "Settings", icon: "⚙️" },
  { id: "themes", label: "Themes", icon: "🎨" },
  { id: "content", label: "Content", icon: "📝" },
  { id: "analytics", label: "Analytics", icon: "📈" }
];

export const AdminSidebar = () => {
  const { sidebarExpanded, scrollY, activeSection, setSidebar, pinIcon } = useAdminUI();
  const [hoveredIcon, setHoveredIcon] = useAtom(hoveredIconAtom);
  const [_, setDragSource] = useAtom(dragSourceAtom);
  const [__, setShowDragOverlay] = useAtom(showDragOverlayAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollY > 100 && sidebarExpanded) {
      setSidebar(false);
    }
  }, [scrollY, sidebarExpanded, setSidebar]);

  const handleIconClick = (id: string) => {
    navigate(`/admin/${id}`);
  };

  const handleDragStart = (id: string, e: React.DragEvent) => {
    setDragSource(id);
    setShowDragOverlay(true);
    
    // For better UX during drag, set a custom drag image
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', id);
      const dragImage = new Image();
      dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 1px transparent GIF
      e.dataTransfer.setDragImage(dragImage, 0, 0);
    }
  };

  const handleDragEnd = () => {
    setDragSource(null);
    setShowDragOverlay(false);
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-full transition-all duration-500 pt-16
        ${sidebarExpanded ? "w-48" : "w-[60px]"} 
        bg-[var(--admin-border)] shadow-[var(--admin-shadow)]`}
    >
      <div className="flex flex-col items-center gap-4 px-2 py-4">
        {sidebarIcons.map((icon) => (
          <div
            key={icon.id}
            draggable
            onClick={() => handleIconClick(icon.id)}
            onMouseEnter={() => setHoveredIcon(icon.id)}
            onMouseLeave={() => setHoveredIcon(null)}
            onDragStart={(e) => handleDragStart(icon.id, e)}
            onDragEnd={handleDragEnd}
            className={`w-full flex items-center gap-3 px-2 py-2 cursor-pointer
              transition-all duration-300 rounded-md sidebar-icon
              ${activeSection === icon.id ? 'active' : ''}
              ${hoveredIcon === icon.id ? 'bg-[rgba(255,60,172,0.2)]' : ''}
              ${sidebarExpanded ? "justify-start" : "justify-center"}`}
          >
            <div className="h-8 w-8 bg-[var(--admin-accent-2)] rounded-full flex items-center justify-center">
              <span>{icon.icon}</span>
            </div>
            
            {sidebarExpanded && (
              <span className="text-white text-sm truncate">{icon.label}</span>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};
