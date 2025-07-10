import { useFormStore } from '@/stores/useFormStore';
import TextInput from './TextInput';
import Textarea from './Textarea';
import Dropdown from './Dropdown';
import MultiSelect from './MultiSelect';
import DatePicker from './DatePicker';
import NumberInput from './NumberInput';
import RadioGroup from './RadioGroup';
import CheckboxGroup from './CheckboxGroup';
import ConditionalField from './ConditionalField';
import RichTextEditor from './RichTextEditor';
import FileUpload from './FileUpload';
import {
  DndContext,
  useDroppable,
  closestCenter,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { FormComponent } from '@/types/form';

const componentMap: Record<string, React.ComponentType<any>> = {
  text: TextInput,
  textarea: Textarea,
  dropdown: Dropdown,
  multiselect: MultiSelect,
  date: DatePicker,
  number: NumberInput,
  radio: RadioGroup,
  checkbox: CheckboxGroup,
  conditional: ConditionalField,
  richtext: RichTextEditor,
  file: FileUpload,
};

function SortableFormItem({ c, idx, selectedId, selectComponent, removeComponent }: { c: FormComponent; idx: number; selectedId: string | null; selectComponent: (id: string | null) => void; removeComponent: (id: string) => void; }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: c.id });
  const Comp = componentMap[c.type] || (() => <div>Unknown</div>);
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        border: c.id === selectedId ? '2px solid #0070f3' : '1px solid #eee',
        borderRadius: 8,
        marginBottom: 16,
        padding: 12,
        background: c.id === selectedId ? '#f0f8ff' : '#fff',
        position: 'relative',
        cursor: 'pointer',
        opacity: isDragging ? 0.5 : 1,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
      }}
      onClick={() => selectComponent(c.id)}
    >
      <div style={{ position: 'absolute', right: 8, top: 8, display: 'flex', gap: 4 }}>
        <button onClick={e => { e.stopPropagation(); removeComponent(c.id); }} title="Hapus" style={{ color: 'red', fontSize: 14 }}>🗑️</button>
      </div>
      <Comp {...c.props} />
    </div>
  );
}

export default function FormLivePreview() {
  const { components, selectedId, selectComponent, removeComponent, moveComponent, addComponent } = useFormStore();
  const { setNodeRef } = useDroppable({ id: 'preview-drop' });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    // Drag dari palette
    if (active.data.current?.fromPalette && over?.id === 'preview-drop') {
      addComponent(active.data.current.type);
      return;
    }
    // Sortable antar komponen
    if (over && active.id !== over.id) {
      const oldIdx = components.findIndex(c => c.id === active.id);
      const newIdx = components.findIndex(c => c.id === over.id);
      if (oldIdx !== -1 && newIdx !== -1) {
        moveComponent(oldIdx, newIdx);
      }
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div ref={setNodeRef} id="preview-drop" style={{ minHeight: 400, padding: 8, border: '2px dashed #eee', borderRadius: 12 }}>
        <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {components.length === 0 ? (
            <div style={{ color: '#bbb', fontSize: 20, textAlign: 'center', marginTop: 80 }}>
              Drag komponen ke sini atau klik dari palette untuk mulai membangun form
            </div>
          ) : (
            components.map((c, idx) => (
              <SortableFormItem
                key={c.id}
                c={c}
                idx={idx}
                selectedId={selectedId}
                selectComponent={selectComponent}
                removeComponent={removeComponent}
              />
            ))
          )}
        </SortableContext>
      </div>
    </DndContext>
  );
} 