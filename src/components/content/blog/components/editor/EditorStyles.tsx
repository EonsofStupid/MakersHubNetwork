import React from 'react';

export const EditorStyles: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <style>{`
        .ProseMirror {
          min-height: 300px;
          outline: none;
          color: white;
        }
        .ProseMirror p {
          margin: 1em 0;
          color: white;
        }
        .ProseMirror h1 {
          font-size: 2em;
          color: white;
          margin: 1em 0;
        }
        .ProseMirror h2 {
          font-size: 1.5em;
          color: white;
          margin: 1em 0;
        }
        .ProseMirror code {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 0.25rem;
          padding: 0.2em 0.4em;
          color: #41f0db;
        }
        .ProseMirror pre {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
          padding: 1em;
          margin: 1em 0;
          color: white;
        }
        .ProseMirror pre code {
          background: none;
          color: white;
          padding: 0;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
        }
        .ProseMirror blockquote {
          border-left: 3px solid rgba(255, 255, 255, 0.2);
          padding-left: 1em;
          margin-left: 0;
          font-style: italic;
          color: rgba(255, 255, 255, 0.8);
        }
        .ProseMirror ul,
        .ProseMirror ol {
          color: white;
          margin: 1em 0;
          padding-left: 2em;
        }
        .ProseMirror li {
          margin: 0.5em 0;
        }
        .ProseMirror * {
          color: white;
        }
      `}</style>
    </>
  );
};