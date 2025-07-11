'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useFormStore, FormComponent } from '@/stores/useFormStore';
import { Trash2, Plus, Minus, ArrowUp, ArrowDown, Copy } from 'lucide-react';

/**
 * Komponen untuk mengedit properti komponen yang dipilih
 */
export default function PropertyPanel() {
  const { 
    components, 
    selectedId, 
    updateComponent, 
    removeComponent,
    moveComponent,
    duplicateComponent
  } = useFormStore();
  
  const [selectedComponent, setSelectedComponent] = useState<FormComponent | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');

  // Mengambil komponen yang dipilih saat ini
  useEffect(() => {
    if (!selectedId) {
      setSelectedComponent(null);
      return;
    }

    const component = components.find(c => c.id === selectedId);
    if (component) {
      setSelectedComponent(component);
      if (component.options) {
        setOptions(component.options);
      } else {
        setOptions([]);
      }
    }
  }, [selectedId, components]);

  // Jika tidak ada komponen yang dipilih, tampilkan pesan
  if (!selectedComponent) {
    return (
      <Card className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
        <div className="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="15" y1="3" x2="15" y2="21"></line>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="3" y1="15" x2="21" y2="15"></line>
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">No Component Selected</h3>
        <p className="text-sm">Select a component from the preview to edit its properties</p>
      </Card>
    );
  }

  // Menangani perubahan properti komponen
  const handleChange = (key: string, value: unknown) => {
    updateComponent(selectedComponent.id, { [key]: value });
  };

  // Menangani penambahan opsi baru (untuk dropdown, radio, dll)
  const handleAddOption = () => {
    if (!newOption.trim()) return;
    
    const updatedOptions = [...options, newOption.trim()];
    setOptions(updatedOptions);
    handleChange('options', updatedOptions);
    setNewOption('');
  };

  // Menangani penghapusan opsi
  const handleRemoveOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
    handleChange('options', updatedOptions);
  };

  // Menangani perubahan opsi
  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
    handleChange('options', updatedOptions);
  };

  // Menangani penghapusan komponen
  const handleDeleteComponent = () => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      removeComponent(selectedComponent.id);
    }
  };

  // Menangani duplikasi komponen
  const handleDuplicateComponent = () => {
    duplicateComponent(selectedComponent.id);
  };

  // Render properti berdasarkan tipe komponen
  const renderProperties = () => {
    switch (selectedComponent.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={selectedComponent.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                value={selectedComponent.placeholder || ''}
                onChange={(e) => handleChange('placeholder', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="helpText">Help Text</Label>
              <Input
                id="helpText"
                value={selectedComponent.helpText || ''}
                onChange={(e) => handleChange('helpText', e.target.value)}
                className="mt-1"
              />
            </div>
            
            {selectedComponent.type === 'number' && (
              <>
                <div className="mb-4">
                  <Label htmlFor="min">Minimum Value</Label>
                  <Input
                    id="min"
                    type="number"
                    value={selectedComponent.min || ''}
                    onChange={(e) => handleChange('min', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="max">Maximum Value</Label>
                  <Input
                    id="max"
                    type="number"
                    value={selectedComponent.max || ''}
                    onChange={(e) => handleChange('max', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </>
            )}
            
            <div className="flex items-center mb-4">
              <Switch
                id="required"
                checked={selectedComponent.required || false}
                onCheckedChange={(checked) => handleChange('required', checked)}
              />
              <Label htmlFor="required" className="ml-2">
                Required Field
              </Label>
            </div>
          </>
        );
      
      case 'textarea':
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={selectedComponent.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                value={selectedComponent.placeholder || ''}
                onChange={(e) => handleChange('placeholder', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="rows">Rows</Label>
              <Input
                id="rows"
                type="number"
                value={selectedComponent.rows || 4}
                onChange={(e) => handleChange('rows', parseInt(e.target.value) || 4)}
                className="mt-1"
                min="2"
                max="10"
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="helpText">Help Text</Label>
              <Input
                id="helpText"
                value={selectedComponent.helpText || ''}
                onChange={(e) => handleChange('helpText', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="flex items-center mb-4">
              <Switch
                id="required"
                checked={selectedComponent.required || false}
                onCheckedChange={(checked) => handleChange('required', checked)}
              />
              <Label htmlFor="required" className="ml-2">
                Required Field
              </Label>
            </div>
          </>
        );
      
      case 'select':
      case 'radio':
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={selectedComponent.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="helpText">Help Text</Label>
              <Input
                id="helpText"
                value={selectedComponent.helpText || ''}
                onChange={(e) => handleChange('helpText', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <Label>Options</Label>
                <div className="text-xs text-slate-500">{options.length} options</div>
              </div>
              
              <div className="space-y-2 mb-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                      className="h-8 w-8 text-slate-500 hover:text-red-500"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add new option"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleAddOption}
                  className="h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <Switch
                id="required"
                checked={selectedComponent.required || false}
                onCheckedChange={(checked) => handleChange('required', checked)}
              />
              <Label htmlFor="required" className="ml-2">
                Required Field
              </Label>
            </div>
          </>
        );
      
      case 'checkbox':
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={selectedComponent.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="helpText">Help Text</Label>
              <Input
                id="helpText"
                value={selectedComponent.helpText || ''}
                onChange={(e) => handleChange('helpText', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="flex items-center mb-4">
              <Switch
                id="required"
                checked={selectedComponent.required || false}
                onCheckedChange={(checked) => handleChange('required', checked)}
              />
              <Label htmlFor="required" className="ml-2">
                Required Field
              </Label>
            </div>
          </>
        );
      
      case 'heading':
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="text">Heading Text</Label>
              <Input
                id="text"
                value={selectedComponent.text || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="level">Heading Level</Label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[1, 2, 3].map((level) => (
                  <Button
                    key={level}
                    type="button"
                    variant={selectedComponent.level === level ? 'default' : 'outline'}
                    onClick={() => handleChange('level', level)}
                    className="h-9"
                  >
                    H{level}
                  </Button>
                ))}
              </div>
            </div>
          </>
        );
      
      case 'paragraph':
        return (
          <div className="mb-4">
            <Label htmlFor="text">Paragraph Text</Label>
            <Textarea
              id="text"
              value={selectedComponent.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
              className="mt-1"
              rows={5}
            />
          </div>
        );
      
      case 'divider':
        return (
          <div className="text-center py-4 text-slate-500">
            <p>Divider has no editable properties</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-medium">Component Properties</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDuplicateComponent}
            className="h-8 w-8 text-slate-500 hover:text-slate-900"
            title="Duplicate component"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const index = components.findIndex(c => c.id === selectedComponent.id);
              if (index > 0) {
                moveComponent(index, index - 1);
              }
            }}
            className="h-8 w-8 text-slate-500 hover:text-slate-900"
            title="Move up"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const index = components.findIndex(c => c.id === selectedComponent.id);
              if (index < components.length - 1) {
                moveComponent(index, index + 1);
              }
            }}
            className="h-8 w-8 text-slate-500 hover:text-slate-900"
            title="Move down"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteComponent}
            className="h-8 w-8 text-slate-500 hover:text-red-500"
            title="Delete component"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {renderProperties()}
      </div>
    </Card>
  );
}