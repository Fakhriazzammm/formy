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
        const newComponents = [...components];
        newComponents.splice(targetIndex, 0, { type: componentType, id: Date.now().toString() });
        moveComponent(newComponents);
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
          const newComponents = [...components];
          newComponents.push({ type: componentType, id: Date.now().toString() });
          moveComponent(newComponents);
        }
      }}
    >
      {components.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p className="mb-2">Drag and drop components here</p>
          <p className="text-sm">or click on components from the palette</p>
        </div>
      ) : (
        <AnimatePresence>
          {components.map((component, index) => {
            const Component = componentMap[component.type as keyof typeof componentMap];
            if (!Component) return null;

            return (
              <motion.div
                key={component.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "relative group",
                  dropTarget === index && "mt-8"
                )}
              >
                <Card
                  className={cn(
                    "border border-border hover:border-primary/30 transition-colors",
                    !readOnly && "hover:shadow-md",
                    draggedIndex === index && "opacity-50",
                    onSelectComponent && "cursor-pointer"
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
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    )}
                    
                    <Component {...component} />
                    
                    {!readOnly && (
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => duplicateComponent(index)}
                          className="bg-background hover:bg-primary/5"
                        >
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeComponent(index)}
                          className="bg-background hover:bg-destructive/5 hover:text-destructive"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
                
                {dropTarget === index && (
                  <div className="absolute -top-4 left-0 right-0 h-8 bg-primary/10 rounded-lg border-2 border-primary border-dashed pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
} 