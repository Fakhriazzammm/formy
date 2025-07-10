import React from 'react';

type DropdownProps = {
  label?: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
};

export default function Dropdown({ label, options, value, onChange }: DropdownProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
      >
        <option value="">Pilih...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
} 