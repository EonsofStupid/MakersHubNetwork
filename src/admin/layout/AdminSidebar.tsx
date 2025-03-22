
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { 
  hoveredIconAtom, 
  dragSourceAtom, 
  showDragOverlayAtom 
} from "../store/atoms";
import { useAdminUI } from "../store/admin-ui";
import { SidebarIcon } from "../components/SidebarIcon";

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
  const { 
    sidebarExpanded, 
    scrollY, 
    activeSection, 
    setSidebar 
  } = useAdminUI();
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
          <SidebarIcon
            key={icon.id}
            id={icon.id}
            label={icon.label}
            icon={icon.icon}
            active={activeSection === icon.id}
            expanded={sidebarExpanded}
            onClick={() => handleIconClick(icon.id)}
            onDragStart={(e) => handleDragStart(icon.id, e)}
          />
        ))}
      </div>
    </aside>
  );
};
