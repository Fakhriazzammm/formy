import React from 'react';

type CheckboxGroupProps = {
  label?: string;
  options: { label: string; value: string }[];
  value: string[];
  onChange: (v: string[]) => void;
};

export default function CheckboxGroup({ label, options, value, onChange }: CheckboxGroupProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
      <div>
        {options.map(opt => (
          <label key={opt.value} style={{ marginRight: 16 }}>
            <input
              type="checkbox"
              checked={value.includes(opt.value)}
              onChange={e => {
                if (e.target.checked) {
                  onChange([...value, opt.value]);
                } else {
                  onChange(value.filter(v => v !== opt.value));
                }
              }}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
} 