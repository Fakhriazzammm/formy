import React from 'react';

type RadioGroupProps = {
  label?: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
};

export default function RadioGroup({ label, options, value, onChange }: RadioGroupProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
      <div>
        {options.map(opt => (
          <label key={opt.value} style={{ marginRight: 16 }}>
            <input
              type="radio"
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
} 