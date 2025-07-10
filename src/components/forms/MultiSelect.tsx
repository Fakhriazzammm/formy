import React from 'react';

type MultiSelectProps = {
  label?: string;
  options: { label: string; value: string }[];
  value: string[];
  onChange: (v: string[]) => void;
};

export default function MultiSelect({ label, options, value, onChange }: MultiSelectProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
      <select
        multiple
        value={value}
        onChange={e => {
          const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
          onChange(selected);
        }}
        style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', minHeight: 80 }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
} 