import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Code, 
  Image as ImageIcon,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2
} from 'lucide-react';
import { Editor } from '@tiptap/react';

interface EditorToolbarProps {
  editor: Editor;
  onImageAdd: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor, onImageAdd }) => {
  return (
    <div className="border-b border-white/10 p-2 flex gap-2 flex-wrap bg-white/5">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`text-white hover:text-[#41f0db] ${editor.isActive('bold') ? 'bg-white/10' : ''}`}
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`text-white hover:text-[#41f0db] ${editor.isActive('italic') ? 'bg-white/10' : ''}`}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`text-white hover:text-[#41f0db] ${editor.isActive('codeBlock') ? 'bg-white/10' : ''}`}
      >
        <Code className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`text-white hover:text-[#41f0db] ${editor.isActive('heading', { level: 1 }) ? 'bg-white/10' : ''}`}
      >
        <Heading1 className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`text-white hover:text-[#41f0db] ${editor.isActive('heading', { level: 2 }) ? 'bg-white/10' : ''}`}
      >
        <Heading2 className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`text-white hover:text-[#41f0db] ${editor.isActive('bulletList') ? 'bg-white/10' : ''}`}
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`text-white hover:text-[#41f0db] ${editor.isActive('orderedList') ? 'bg-white/10' : ''}`}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`text-white hover:text-[#41f0db] ${editor.isActive('blockquote') ? 'bg-white/10' : ''}`}
      >
        <Quote className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onImageAdd}
        className="text-white hover:text-[#41f0db]"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};