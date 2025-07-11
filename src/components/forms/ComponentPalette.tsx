'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFormStore } from '@/stores/useFormStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Type, AlignLeft, Hash, Mail, List, CheckSquare, Calendar, Heading, AlignJustify, Minus, FileText, Image, Link, LayoutGrid } from 'lucide-react';
import { nanoid } from 'nanoid';

/**
 * Komponen untuk menampilkan palet komponen yang dapat ditambahkan ke formulir
 */
export default function ComponentPalette() {
  const { addComponent } = useFormStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Definisi komponen yang tersedia
  const basicComponents = [
    { id: 'text', icon: <Type className="h-4 w-4" />, label: 'Text Field', description: 'Single line text input' },
    { id: 'textarea', icon: <AlignLeft className="h-4 w-4" />, label: 'Text Area', description: 'Multi-line text input' },
    { id: 'number', icon: <Hash className="h-4 w-4" />, label: 'Number', description: 'Numeric input field' },
    { id: 'email', icon: <Mail className="h-4 w-4" />, label: 'Email', description: 'Email address input' },
    { id: 'select', icon: <List className="h-4 w-4" />, label: 'Dropdown', description: 'Select from options' },
    { id: 'checkbox', icon: <CheckSquare className="h-4 w-4" />, label: 'Checkbox', description: 'Single checkbox option' },
    { id: 'radio', icon: <CheckSquare className="h-4 w-4" />, label: 'Radio Group', description: 'Choose one option' },
    { id: 'date', icon: <Calendar className="h-4 w-4" />, label: 'Date', description: 'Date picker' },
  ];

  const layoutComponents = [
    { id: 'heading', icon: <Heading className="h-4 w-4" />, label: 'Heading', description: 'Section title' },
    { id: 'paragraph', icon: <Paragraph className="h-4 w-4" />, label: 'Paragraph', description: 'Text paragraph' },
    { id: 'divider', icon: <Minus className="h-4 w-4" />, label: 'Divider', description: 'Horizontal line' },
  ];

  const advancedComponents = [
    { id: 'file', icon: <FileText className="h-4 w-4" />, label: 'File Upload', description: 'Upload files', premium: true },
    { id: 'image', icon: <Image className="h-4 w-4" aria-hidden="true" /* eslint-disable-next-line jsx-a11y/alt-text */ />, label: 'Image', description: 'Display image', premium: true },
    { id: 'url', icon: <Link className="h-4 w-4" />, label: 'URL', description: 'Website URL input', premium: true },
    { id: 'grid', icon: <LayoutGrid className="h-4 w-4" />, label: 'Grid Layout', description: 'Multi-column layout', premium: true },
  ];

  // Menambahkan komponen ke formulir
  const handleAddComponent = (type: string) => {
    const isPremium = advancedComponents.some(comp => comp.id === type && comp.premium);
    
    if (isPremium) {
      // Tampilkan pesan upgrade untuk fitur premium
      alert('This is a premium feature. Please upgrade to access advanced components.');
      return;
    }
    
    const newComponentId = nanoid();
    let newComponent: { id: string; type: string; label?: string; placeholder?: string; required?: boolean; helpText?: string; rows?: number; min?: string; max?: string; options?: string[]; text?: string; level?: string; } = { id: newComponentId, type };
    
    // Mengatur properti default berdasarkan tipe komponen
    switch (type) {
      case 'text':
        newComponent = {
          ...newComponent,
          label: 'Text Field',
          placeholder: 'Enter text here',
          required: false,
          helpText: '',
        };
        break;
      
      case 'textarea':
        newComponent = {
          ...newComponent,
          label: 'Text Area',
          placeholder: 'Enter text here',
          required: false,
          helpText: '',
          rows: 4,
        };
        break;
      
      case 'number':
        newComponent = {
          ...newComponent,
          label: 'Number',
          placeholder: 'Enter a number',
          required: false,
          helpText: '',
          min: '',
          max: '',
        };
        break;
      
      case 'email':
        newComponent = {
          ...newComponent,
          label: 'Email',
          placeholder: 'Enter your email',
          required: false,
          helpText: '',
        };
        break;
      
      case 'select':
        newComponent = {
          ...newComponent,
          label: 'Dropdown',
          required: false,
          helpText: '',
          options: ['Option 1', 'Option 2', 'Option 3'],
        };
        break;
      
      case 'checkbox':
        newComponent = {
          ...newComponent,
          label: 'Checkbox',
          required: false,
          helpText: '',
        };
        break;
      
      case 'radio':
        newComponent = {
          ...newComponent,
          label: 'Radio Group',
          required: false,
          helpText: '',
          options: ['Option 1', 'Option 2', 'Option 3'],
        };
        break;
      
      case 'date':
        newComponent = {
          ...newComponent,
          label: 'Date',
          required: false,
          helpText: '',
        };
        break;
      
      case 'heading':
        newComponent = {
          ...newComponent,
          text: 'Section Heading',
          level: 2,
        };
        break;
      
      case 'paragraph':
        newComponent = {
          ...newComponent,
          text: 'This is a paragraph of text. You can edit this text to provide instructions or information to your form users.',
        };
        break;
      
      case 'divider':
        newComponent = {
          ...newComponent,
        };
        break;
      
      default:
        break;
    }
    
    addComponent(newComponent);
  };

  // Filter komponen berdasarkan pencarian
  const filterComponents = (components: { id: string; icon: React.ReactNode; label: string; description: string; premium?: boolean }[]) => {
    if (!searchTerm) return components;
    
    return components.filter(comp => 
      comp.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
      comp.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Render komponen dalam daftar
  const renderComponentList = (components: { id: string; icon: React.ReactNode; label: string; description: string; premium?: boolean }[]) => {
    const filteredComponents = filterComponents(components);
    
    if (filteredComponents.length === 0) {
      return (
        <div className="text-center py-4 text-slate-500">
          No components found
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 gap-2">
        {filteredComponents.map((component) => (
          <Button
            key={component.id}
            variant="ghost"
            className="flex items-start justify-start h-auto p-3 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => handleAddComponent(component.id)}
          >
            <div className="mr-3 mt-0.5">{component.icon}</div>
            <div>
              <div className="font-medium flex items-center">
                {component.label}
                {component.premium && (
                  <span className="ml-2 text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-1.5 py-0.5 rounded-sm">
                    PRO
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{component.description}</div>
            </div>
          </Button>
        ))}
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="text"
            placeholder="Search components..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="basic" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 border-b">
          <TabsList className="w-full justify-start h-10 bg-transparent p-0 mb-0">
            <TabsTrigger 
              value="basic" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-10"
            >
              Basic
            </TabsTrigger>
            <TabsTrigger 
              value="layout" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-10"
            >
              Layout
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-10"
            >
              Advanced
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <TabsContent value="basic" className="m-0 h-full">
            {renderComponentList(basicComponents)}
          </TabsContent>
          
          <TabsContent value="layout" className="m-0 h-full">
            {renderComponentList(layoutComponents)}
          </TabsContent>
          
          <TabsContent value="advanced" className="m-0 h-full">
            {renderComponentList(advancedComponents)}
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}