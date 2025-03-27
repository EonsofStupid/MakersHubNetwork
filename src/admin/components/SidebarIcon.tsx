
import { useState } from "react";
import { useAtom } from "jotai";
import { hoveredIconAtom } from "../store/atoms";

interface SidebarIconProps {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
  expanded?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export const SidebarIcon = ({
  id,
  label,
  icon,
  active = false,
  expanded = true,
  onClick,
  onDragStart,
  onDragEnd
}: SidebarIconProps) => {
  const [hoveredIcon, setHoveredIcon] = useAtom(hoveredIconAtom);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      draggable
      onClick={onClick}
      onMouseEnter={() => setHoveredIcon(id)}
      onMouseLeave={() => setHoveredIcon(null)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`
        flex items-center gap-3 px-2 py-2 cursor-pointer
        transition-all duration-300 rounded-md 
        ${active ? 'bg-[var(--admin-accent)]' : hoveredIcon === id ? 'bg-[rgba(255,60,172,0.2)]' : ''}
        ${expanded ? "justify-start w-full" : "justify-center w-auto"}
        ${isPressed ? 'scale-95' : 'scale-100'}
      `}
    >
      <div className={`
        h-8 w-8 rounded-full flex items-center justify-center
        transition-all duration-300
        ${active ? 'bg-[rgba(255,255,255,0.2)]' : 'bg-[var(--admin-accent-2)]'}
        ${isPressed ? 'scale-95' : hoveredIcon === id ? 'scale-110' : 'scale-100'}
      `}>
        <span>{icon}</span>
      </div>
      
      {expanded && (
        <span className="text-white text-sm truncate">{label}</span>
      )}
    </div>
  );
};
