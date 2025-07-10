import React from 'react';

type NumberInputProps = {
  label?: string;
  value: number;
  onChange: (v: number) => void;
};

export default function NumberInput({ label, value, onChange }: NumberInputProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
      />
    </div>
  );
} 