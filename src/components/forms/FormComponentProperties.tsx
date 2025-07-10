import { useFormStore } from '@/stores/useFormStore';
import { useMemo } from 'react';

export default function FormComponentProperties() {
  const { components, selectedId, updateComponent } = useFormStore();
  const comp = useMemo(() => components.find(c => c.id === selectedId), [components, selectedId]);
  if (!comp) {
    return <div style={{ color: '#bbb', fontSize: 16 }}>Pilih komponen untuk edit properti</div>;
  }
  // Field umum: label, placeholder (jika ada), dsb
  return (
    <div>
      <h4>Edit Properti</h4>
      <div style={{ marginBottom: 12 }}>
        <label>Label</label>
        <input
          type="text"
          value={comp.props.label || ''}
          onChange={e => updateComponent(comp.id, { label: e.target.value })}
          style={{ width: '100%', marginTop: 4, marginBottom: 8, padding: 6, borderRadius: 4, border: '1px solid #ddd' }}
        />
      </div>
      {['text', 'textarea', 'dropdown', 'multiselect', 'richtext', 'file', 'date', 'number'].includes(comp.type) && (
        <div style={{ marginBottom: 12 }}>
          <label>Placeholder</label>
          <input
            type="text"
            value={comp.props.placeholder || ''}
            onChange={e => updateComponent(comp.id, { placeholder: e.target.value })}
            style={{ width: '100%', marginTop: 4, marginBottom: 8, padding: 6, borderRadius: 4, border: '1px solid #ddd' }}
          />
        </div>
      )}
      {/* Opsi untuk dropdown/multiselect/radio/checkbox */}
      {['dropdown', 'multiselect', 'radio', 'checkbox'].includes(comp.type) && (
        <div style={{ marginBottom: 12 }}>
          <label>Opsi (pisahkan dengan koma)</label>
          <input
            type="text"
            value={comp.props.options ? comp.props.options.map((o: string) => o).join(',') : ''}
            onChange={e => updateComponent(comp.id, { options: e.target.value.split(',').map((v: string) => ({ label: v.trim(), value: v.trim() })) })}
            style={{ width: '100%', marginTop: 4, marginBottom: 8, padding: 6, borderRadius: 4, border: '1px solid #ddd' }}
          />
        </div>
      )}
    </div>
  );
} 