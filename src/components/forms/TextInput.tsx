import React from 'react';

type TextInputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
};

export default function TextInput({ label, placeholder, value, onChange }: TextInputProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
      />
    </div>
  );
} 