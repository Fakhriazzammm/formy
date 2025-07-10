import React from 'react';

type TextareaProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
};

export default function Textarea({ label, placeholder, value, onChange }: TextareaProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', minHeight: 80 }}
      />
    </div>
  );
} 