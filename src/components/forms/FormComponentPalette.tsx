import { useFormStore } from '@/stores/useFormStore';
import { useDraggable } from '@dnd-kit/core';

const components = [
  { label: 'Text Input', type: 'text' },
  { label: 'Textarea', type: 'textarea' },
  { label: 'Dropdown', type: 'dropdown' },
  { label: 'Multi Select', type: 'multiselect' },
  { label: 'Rich Text Editor', type: 'richtext' },
  { label: 'File Upload', type: 'file' },
  { label: 'Date Picker', type: 'date' },
  { label: 'Number Input', type: 'number' },
  { label: 'Radio Group', type: 'radio' },
  { label: 'Checkbox Group', type: 'checkbox' },
  { label: 'Conditional Field', type: 'conditional' },
];

function DraggablePaletteItem({ c }: { c: { label: string; type: string } }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${c.type}`,
    data: { type: c.type, fromPalette: true },
  });
  const addComponent = useFormStore(s => s.addComponent);
  return (
    <li key={c.type} style={{ marginBottom: 12, opacity: isDragging ? 0.5 : 1 }}>
      <button
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', background: '#fafbfc', cursor: 'grab' }}
        onClick={() => addComponent(c.type)}
        type="button"
      >
        {c.label}
      </button>
    </li>
  );
}

export default function FormComponentPalette() {
  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Komponen Form</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {components.map((c) => (
          <DraggablePaletteItem key={c.type} c={c} />
        ))}
      </ul>
    </div>
  );
} 