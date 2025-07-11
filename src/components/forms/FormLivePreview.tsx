import { useFormStore } from '@/stores/useFormStore';
import TextInput from './TextInput';
import NumberInput from './NumberInput';
import Textarea from './Textarea';
import Dropdown from './Dropdown';
import RadioGroup from './RadioGroup';
import CheckboxGroup from './CheckboxGroup';
import MultiSelect from './MultiSelect';
import DatePicker from './DatePicker';
import FileUpload from './FileUpload';
import RichTextEditor from './RichTextEditor';
import ConditionalField from './ConditionalField';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GripVertical, Trash, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const componentMap = {
  text: TextInput,
  number: NumberInput,
  textarea: Textarea,
  select: Dropdown,
  radio: RadioGroup,
  checkbox: CheckboxGroup,
  multiselect: MultiSelect,
  date: DatePicker,
  file: FileUpload,
  'rich-text': RichTextEditor,
  conditional: ConditionalField,
};

interface FormLivePreviewProps {
  readOnly?: boolean;
  onSelectComponent?: (id: string) => void;
}

export default function FormLivePreview({ readOnly = false, onSelectComponent }: FormLivePreviewProps) {
  const { components, moveComponent, removeComponent, duplicateComponent } = useFormStore();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    
    // Create a custom drag image
    const dragPreview = document.createElement('div');
    dragPreview.className = 'bg-primary/10 border-2 border-primary rounded-lg p-4 w-64';
    dragPreview.textContent = `Moving ${components[index].type} component`;
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 32, 32);
    setTimeout(() => document.body.removeChild(dragPreview), 0);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget(index);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = draggedIndex;
    
    if (sourceIndex === null) {
      // New component being added
      const componentType = e.dataTransfer.getData('componentType');
      if (componentType) {
        const newComponent = { type: componentType, id: Date.now().toString(), props: {} };
        const newIndex = targetIndex;
        const newComponents = [...components];
        newComponents.splice(newIndex, 0, newComponent);
        // Jika komponen baru ditambahkan, gunakan indeks terakhir sebagai 'from'
        moveComponent(components.length, newIndex);
      }
    } else {
      // Existing component being moved
      moveComponent(sourceIndex, targetIndex);
    }
    
    setDraggedIndex(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropTarget(null);
  };

  return (
    <div 
      className={cn(
        "space-y-4",
        components.length === 0 && "min-h-[200px] flex items-center justify-center border-2 border-dashed border-border rounded-lg"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }}
      onDrop={(e) => {
        e.preventDefault();
        const componentType = e.dataTransfer.getData('componentType');
        if (componentType) {
          // Tambahkan komponen baru di akhir daftar
          const newIndex = components.length;
          // Jika komponen baru ditambahkan di akhir, gunakan indeks terakhir sebagai 'from'
          moveComponent(newIndex, newIndex);
        }
      }}
    >
      {components.length === 0 ? (
        <div className="text-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-200 shadow-inner">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <path d="M12 2v8"></path>
                <path d="m16 6-4-4-4 4"></path>
                <path d="M8 10H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-4"></path>
              </svg>
            </div>
            <div>
              <p className="text-lg font-cal font-semibold text-slate-700 mb-1">Tarik & Letakkan Komponen Di Sini</p>
              <p className="text-sm text-slate-500">atau klik komponen dari panel sebelah kiri</p>
            </div>
          </div>
        </div>
      ) : (
        <AnimatePresence>
          {components.map((component, index) => {
            const Component = componentMap[component.type as keyof typeof componentMap];
            if (!Component) return null;
            
            // Komponen akan dirender berdasarkan tipenya

            return (
              <motion.div
                key={component.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25,
                    delay: index * 0.05 
                  } 
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.95, 
                  transition: { duration: 0.2 } 
                }}
                whileHover={{ 
                  y: -2,
                  transition: { duration: 0.2 } 
                }}
                className={cn(
                  "relative group",
                  dropTarget === index && "mt-8"
                )}
              >
                <Card
                  className={cn(
                    "border border-slate-200 hover:border-blue-300 transition-all duration-200",
                    !readOnly && "hover:shadow-lg hover:shadow-blue-100/50",
                    draggedIndex === index && "opacity-50",
                    onSelectComponent && "cursor-pointer",
                    "bg-white/80 backdrop-blur-sm"
                  )}
                  onClick={() => onSelectComponent?.(component.id)}
                  draggable={!readOnly}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="p-4">
                    {!readOnly && (
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0 -translate-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="cursor-grab active:cursor-grabbing bg-white rounded-full shadow-md hover:shadow-lg hover:bg-blue-50 border border-slate-200 w-8 h-8 p-0"
                        >
                          <GripVertical className="w-4 h-4 text-blue-500" />
                        </Button>
                      </div>
                    )}
                    
                    {(() => {
                      // Mendapatkan properti umum yang akan diteruskan ke semua komponen
                      const commonProps = { ...component.props };
                      
                      // Menghapus properti value dan defaultValue dari commonProps
                      // karena akan ditangani secara terpisah berdasarkan tipe komponen
                      delete commonProps.value;
                      delete commonProps.defaultValue;
                      
                      // Render komponen berdasarkan tipenya
                      switch(component.type) {
                        case 'number':
                          return (
                            <NumberInput 
                              {...commonProps} 
                              value={component.props.value !== undefined ? Number(component.props.value) : 
                                    component.props.defaultValue !== undefined ? Number(component.props.defaultValue) : 0} 
                              onChange={() => {}} 
                            />
                          );
                        case 'checkbox':
                          if (Array.isArray(component.props.options)) {
                            return (
                              <CheckboxGroup 
                                {...commonProps} 
                                options={component.props.options.map(opt => ({ label: opt, value: opt }))} 
                                value={component.props.value !== undefined ? [String(component.props.value)] : 
                                      component.props.defaultValue !== undefined ? [String(component.props.defaultValue)] : []} 
                                onChange={() => {}} 
                              />
                            );
                          }
                          return null;
                        case 'radio':
                          if (Array.isArray(component.props.options)) {
                            return (
                              <RadioGroup 
                                {...commonProps} 
                                options={component.props.options.map(opt => ({ label: opt, value: opt }))} 
                                value={component.props.value !== undefined ? String(component.props.value) : 
                                      component.props.defaultValue !== undefined ? String(component.props.defaultValue) : ''} 
                                onChange={() => {}} 
                              />
                            );
                          }
                          return null;
                        default:
                          return (
                            <TextInput 
                              {...commonProps} 
                              value={component.props.value !== undefined ? String(component.props.value) : 
                                    component.props.defaultValue !== undefined ? String(component.props.defaultValue) : ''} 
                              onChange={() => {}} 
                            />
                          );
                      }
                    })()}
                    
                    {!readOnly && (
                      <div className="absolute -right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0 translate-x-2 flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => duplicateComponent(component.id)}
                          className="bg-white rounded-full shadow-md hover:shadow-lg hover:bg-green-50 border border-slate-200 w-8 h-8 p-0"
                          title="Duplikat Komponen"
                        >
                          <Copy className="w-4 h-4 text-green-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeComponent(component.id)}
                          className="bg-white rounded-full shadow-md hover:shadow-lg hover:bg-red-50 border border-slate-200 w-8 h-8 p-0"
                          title="Hapus Komponen"
                        >
                          <Trash className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
                
                {dropTarget === index && (
                  <div className="absolute -top-4 left-0 right-0 h-8 bg-gradient-to-r from-blue-100/80 via-blue-200/80 to-blue-100/80 backdrop-blur-sm rounded-lg border-2 border-blue-300 border-dashed pointer-events-none animate-pulse shadow-inner" />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
}