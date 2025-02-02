import React, { useState } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import EditorCore from './editor/EditorCore';
import EditorTabs from './editor/EditorTabs';
import SEOSection from './editor/SEOSection';
import TagsManager from './editor/TagsManager';
import { Database } from "@/integrations/supabase/types";

type PostCategory = Database["public"]["Enums"]["post_category"];

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onCategoryChange?: (category: PostCategory) => void;
  onTagsChange?: (tags: string[]) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  content, 
  onChange,
  onCategoryChange,
  onTagsChange 
}) => {
  const [activeTab, setActiveTab] = useState('visual');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const handleCategorySelect = (category: PostCategory) => {
    setSelectedCategory(category);
    onCategoryChange?.(category);
  };

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
    onTagsChange?.(newTags);
  };

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-black/40 backdrop-blur-xl">
      <EditorTabs activeTab={activeTab} onTabChange={setActiveTab}>
        <TabsContent value="visual" className="mt-0">
          <EditorCore content={content} onChange={onChange} />
        </TabsContent>

        <TabsContent value="code" className="mt-0">
          <div className="p-4">
            <textarea
              value={content}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-[400px] bg-black/20 text-white/90 p-4 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
            />
          </div>
        </TabsContent>

        <TabsContent value="seo" className="mt-0">
          <div className="space-y-6">
            <SEOSection
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
            <div className="px-6 pb-6">
              <TagsManager
                tags={tags}
                onTagsChange={handleTagsChange}
              />
            </div>
          </div>
        </TabsContent>
      </EditorTabs>
    </div>
  );
};

export default RichTextEditor;