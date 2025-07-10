import React, { useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

type RichTextEditorProps = {
  label?: string;
  value: string;
  onChange: (v: string) => void;
};

export default function RichTextEditor({ label, value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Sync external value to editor
  const prevValue = useRef(value);
  useEffect(() => {
    if (editor && value !== prevValue.current) {
      editor.commands.setContent(value || '', false);
      prevValue.current = value;
    }
  }, [value, editor]);

  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
      {editor ? (
        <div style={{ border: '1px solid #ddd', borderRadius: 6, minHeight: 100, padding: 8 }}>
          <EditorContent editor={editor} />
        </div>
      ) : (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ width: '100%', minHeight: 100, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
          placeholder="Rich text editor (Tiptap) akan di sini"
        />
      )}
    </div>
  );
} 