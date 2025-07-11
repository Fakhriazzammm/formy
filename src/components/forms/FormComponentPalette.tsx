'use client';

import { useFormStore } from '@/stores/useFormStore';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  CheckSquare, 
  List as ListIcon,
  Type,
  Hash,
  FileImage,
  Radio,
  AlignLeft,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';

const componentGroups = [
  {
    name: 'Basic Inputs',
    items: [
      { type: 'text', icon: Type, label: 'Text Input' },
      { type: 'number', icon: Hash, label: 'Number' },
      { type: 'textarea', icon: AlignLeft, label: 'Text Area' },
    ]
  },
  {
    name: 'Choice Inputs',
    items: [
      { type: 'select', icon: ChevronDown, label: 'Dropdown' },
      { type: 'radio', icon: Radio, label: 'Radio Group' },
      { type: 'checkbox', icon: CheckSquare, label: 'Checkbox Group' },
      { type: 'multiselect', icon: ListIcon, label: 'Multi Select' },
    ]
  },
  {
    name: 'Advanced Inputs',
    items: [
      { type: 'date', icon: Calendar, label: 'Date Picker' },
      { type: 'file', icon: FileImage, label: 'File Upload' },
      { type: 'rich-text', icon: FileText, label: 'Rich Text' },
      { type: 'conditional', icon: Check, label: 'Conditional' },
    ]
  }
];

interface FormComponentPaletteProps {
  collapsed?: boolean;
}

export default function FormComponentPalette({ collapsed = false }: FormComponentPaletteProps) {
  const addComponent = useFormStore(s => s.addComponent);
  const [expandedGroup, setExpandedGroup] = useState<string>('Basic Inputs');
  
  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleClick = (type: string) => {
    addComponent(type);
  };

  return (
    <div className="space-y-2">
      {collapsed ? (
        <div className="space-y-4">
          {componentGroups.map((group) => (
            <div key={group.name} className="relative group">
              <div className="absolute left-full ml-2 invisible group-hover:visible bg-background border border-border rounded-lg p-2 shadow-lg z-50 w-48">
                <div className="text-sm font-medium mb-2">{group.name}</div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <Button
                        key={item.type}
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        onClick={() => handleClick(item.type)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.type)}
                      >
                        <ItemIcon className="w-4 h-4 mr-2" />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full p-2 h-auto"
                title={group.name}
              >
                <div className="flex flex-col items-center gap-1">
                  {(() => {
                    const FirstIcon = group.items[0].icon;
                    return <FirstIcon className="w-5 h-5" />;
                  })()}
                </div>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <Accordion
          type="single"
          collapsible
          value={expandedGroup}
          onValueChange={setExpandedGroup}
          className="space-y-2"
        >
          {componentGroups.map((group) => (
            <AccordionItem
              key={group.name}
              value={group.name}
              className="border border-border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                  {group.name}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-2 grid grid-cols-1 gap-1">
                  {group.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <Button
                        key={item.type}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-sm",
                          "hover:bg-primary/5 hover:text-primary",
                          "active:scale-95 transition-transform",
                          "cursor-grab active:cursor-grabbing"
                        )}
                        onClick={() => handleClick(item.type)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.type)}
                      >
                        <ItemIcon className="w-4 h-4 mr-2" />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
} 