'use client';

import { useFormStore } from '@/stores/useFormStore';
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

const componentGroups = [
  {
    name: 'Input Dasar',
    color: 'blue',
    items: [
      { type: 'text', icon: Type, label: 'Input Teks', description: 'Field teks sederhana' },
      { type: 'number', icon: Hash, label: 'Input Angka', description: 'Field untuk angka' },
      { type: 'textarea', icon: AlignLeft, label: 'Area Teks', description: 'Teks multi-baris' },
    ]
  },
  {
    name: 'Pilihan',
    color: 'green',
    items: [
      { type: 'select', icon: ChevronDown, label: 'Dropdown', description: 'Pilihan dari daftar' },
      { type: 'radio', icon: Radio, label: 'Radio Button', description: 'Pilih satu opsi' },
      { type: 'checkbox', icon: CheckSquare, label: 'Checkbox', description: 'Pilih beberapa opsi' },
      { type: 'multiselect', icon: ListIcon, label: 'Multi Select', description: 'Pilihan berganda' },
    ]
  },
  {
    name: 'Lanjutan',
    color: 'purple',
    items: [
      { type: 'date', icon: Calendar, label: 'Date Picker', description: 'Pilih tanggal' },
      { type: 'file', icon: FileImage, label: 'Upload File', description: 'Upload dokumen/gambar' },
      { type: 'rich-text', icon: FileText, label: 'Rich Text', description: 'Editor teks kaya' },
      { type: 'conditional', icon: Check, label: 'Kondisional', description: 'Field berdasarkan kondisi' },
    ]
  }
];

interface FormComponentPaletteProps {
  collapsed?: boolean;
}

export default function FormComponentPalette({ collapsed = false }: FormComponentPaletteProps) {
  const addComponent = useFormStore(s => s.addComponent);
  const [expandedGroup, setExpandedGroup] = useState<string>('Input Dasar');
  
  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleClick = (type: string) => {
    addComponent(type);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-3">
      {collapsed ? (
        <div className="space-y-3">
          {componentGroups.map((group) => (
            <div key={group.name} className="relative group">
              <div className="absolute left-full ml-3 invisible group-hover:visible bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 shadow-xl z-50 w-64 transition-all duration-200">
                <div className="text-sm font-cal font-semibold text-slate-800 mb-3">{group.name}</div>
                <div className="space-y-2">
                  {group.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <div
                        key={item.type}
                        className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                        onClick={() => handleClick(item.type)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.type)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getColorClasses(group.color)} flex items-center justify-center`}>
                            <ItemIcon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-700">{item.label}</div>
                            <div className="text-xs text-slate-500">{item.description}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getColorClasses(group.color)} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-105`}
                title={group.name}
              >
                {(() => {
                  const FirstIcon = group.items[0].icon;
                  return <FirstIcon className="w-6 h-6 text-white" />;
                })()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {componentGroups.map((group) => {
            const isExpanded = expandedGroup === group.name;
            return (
              <div
                key={group.name}
                className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
              >
                <button
                  onClick={() => setExpandedGroup(isExpanded ? '' : group.name)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getColorClasses(group.color)} flex items-center justify-center`}>
                      {(() => {
                        const FirstIcon = group.items[0].icon;
                        return <FirstIcon className="w-4 h-4 text-white" />;
                      })()}
                    </div>
                    <span className="text-sm font-cal font-semibold text-slate-800">{group.name}</span>
                  </div>
                  <ChevronRight 
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isExpanded ? 'rotate-90' : ''
                    }`} 
                  />
                </button>
                
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-2">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <div
                          key={item.type}
                          className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 hover:bg-white hover:shadow-sm transition-all cursor-grab active:cursor-grabbing hover:scale-[1.02] active:scale-95"
                          onClick={() => handleClick(item.type)}
                          draggable
                          onDragStart={(e) => handleDragStart(e, item.type)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getColorClasses(group.color)} flex items-center justify-center`}>
                              <ItemIcon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-slate-700">{item.label}</div>
                              <div className="text-xs text-slate-500">{item.description}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}