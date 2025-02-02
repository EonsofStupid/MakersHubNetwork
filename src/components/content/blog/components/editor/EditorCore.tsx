import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { EditorToolbar } from './EditorToolbar';
import { EditorStyles } from './EditorStyles';

const lowlight = createLowlight(common);

interface EditorCoreProps {
  content: string;
  onChange: (content: string) => void;
}

const EditorCore: React.FC<EditorCoreProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none p-4 min-h-[300px] focus:outline-none text-white',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-black/40 backdrop-blur-xl">
      <EditorToolbar editor={editor} onImageAdd={addImage} />
      <EditorStyles>
        <EditorContent editor={editor} />
      </EditorStyles>
    </div>
  );
};

export default EditorCore;