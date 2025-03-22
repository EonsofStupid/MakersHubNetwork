
import { useState } from "react";
import { useAtom } from "jotai";
import { dragTargetAtom } from "../store/atoms";

interface DraggableSlotProps {
  iconId?: string;
  icon?: string;
  onDrop: (id: string) => void;
  onRemove?: (id: string) => void;
}

export const DraggableSlot = ({ 
  iconId, 
  icon = '🔍',
  onDrop,
  onRemove
}: DraggableSlotProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [_, setDragTarget] = useAtom(dragTargetAtom);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragTarget(iconId || 'slot');
  };

  const handleDragLeave = () => {
    setDragTarget(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedIconId = e.dataTransfer.getData('text/plain');
    if (droppedIconId) {
      onDrop(droppedIconId);
    }
    setDragTarget(null);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative h-10 w-10 rounded-full flex items-center justify-center
        transition-all duration-300 cursor-pointer
        ${iconId 
          ? 'bg-[var(--admin-accent-2)] hover:bg-[var(--admin-accent)] hover-glow' 
          : 'border-2 border-dashed border-[var(--admin-accent-2)]'}
      `}
    >
      {iconId ? (
        <>
          <span className="text-lg">{icon}</span>
          {isHovered && onRemove && (
            <button
              onClick={() => onRemove(iconId)}
              className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
            >
              ×
            </button>
          )}
        </>
      ) : (
        <span className="text-[var(--admin-accent-2)] text-sm">+</span>
      )}
    </div>
  );
};
