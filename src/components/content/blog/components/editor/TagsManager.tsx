import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

interface TagsManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagsManager: React.FC<TagsManagerProps> = ({ tags, onTagsChange }) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      const updatedTags = [...tags, newTag];
      onTagsChange(updatedTags);
      setNewTag('');
      toast.success(`Tag "${newTag}" added`);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    onTagsChange(updatedTags);
    toast.success(`Tag "${tagToRemove}" removed`);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="px-3 py-1 bg-white/5 hover:bg-white/10 transition-colors group animate-fade-in"
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-2 hover:text-neon-pink focus:outline-none"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add a tag..."
          className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTag();
            }
          }}
        />
        <button
          onClick={handleAddTag}
          className="p-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TagsManager;