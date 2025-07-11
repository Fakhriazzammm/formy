'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFormStore, FormComponent } from '@/stores/useFormStore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Smartphone, Tablet, Monitor, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Komponen untuk menampilkan pratinjau formulir yang sedang dibuat
 * Memungkinkan pengguna untuk melihat formulir dalam berbagai ukuran perangkat
 */
export default function FormPreview() {
  const { components, selectedComponentId, selectComponent, formSettings } = useFormStore();
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewWidth, setPreviewWidth] = useState<string>('100%');
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Mengatur lebar pratinjau berdasarkan mode tampilan
  useEffect(() => {
    switch (viewMode) {
      case 'mobile':
        setPreviewWidth('375px');
        break;
      case 'tablet':
        setPreviewWidth('768px');
        break;
      case 'desktop':
        setPreviewWidth('100%');
        break;
    }
  }, [viewMode]);

  // Menangani perubahan pada input formulir
  const handleInputChange = (componentId: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [componentId]: value,
    }));
  };

  // Menangani pengiriman formulir
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulasi pengiriman formulir
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success('Form submitted successfully!');
      console.log('Form data:', formData);
    }, 1500);
  };

  // Mengatur ulang formulir
  const resetForm = () => {
    setFormData({});
    setSubmitted(false);
  };

  // Mendapatkan gaya untuk komponen berdasarkan pengaturan formulir
  const getComponentStyle = () => {
    const { appearance } = formSettings;
    
    if (appearance.useCustomTheme && appearance.customTheme) {
      const { customTheme } = appearance;
      return {
        backgroundColor: customTheme.background,
        color: customTheme.text,
        '--primary-color': customTheme.primary,
        '--secondary-color': customTheme.secondary,
        '--accent-color': customTheme.accent,
      } as React.CSSProperties;
    }
    
    return {};
  };

  // Mendapatkan gaya untuk input berdasarkan pengaturan formulir
  const getInputStyle = () => {
    const { appearance } = formSettings;
    
    let style: React.CSSProperties = {};
    
    if (appearance.inputStyle === 'outline') {
      style = {
        border: '1px solid #cbd5e1',
        borderRadius: '0.375rem',
        padding: '0.5rem 0.75rem',
      };
    } else if (appearance.inputStyle === 'filled') {
      style = {
        backgroundColor: '#f1f5f9',
        border: '1px solid transparent',
        borderRadius: '0.375rem',
        padding: '0.5rem 0.75rem',
      };
    } else if (appearance.inputStyle === 'underline') {
      style = {
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: '1px solid #cbd5e1',
        borderRadius: '0',
        padding: '0.5rem 0',
      };
    }
    
    if (appearance.useCustomTheme && appearance.customTheme) {
      const { customTheme } = appearance;
      style.borderColor = `${customTheme.secondary}80`;
      style.color = customTheme.text;
    }
    
    return style;
  };

  // Mendapatkan gaya untuk tombol berdasarkan pengaturan formulir
  const getButtonStyle = () => {
    const { appearance } = formSettings;
    
    const style: React.CSSProperties = {
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
    };
    
    if (appearance.useCustomTheme && appearance.customTheme) {
      const { customTheme } = appearance;
      style.backgroundColor = customTheme.primary;
      style.color = '#ffffff';
      style.border = 'none';
    } else {
      style.backgroundColor = '#4f46e5';
      style.color = '#ffffff';
      style.border = 'none';
    }
    
    return style;
  };

  // Mendapatkan lebar formulir berdasarkan pengaturan
  const getFormWidth = () => {
    const { appearance } = formSettings;
    
    switch (appearance.width) {
      case 'narrow':
        return '400px';
      case 'medium':
        return '600px';
      case 'wide':
        return '800px';
      default:
        return '600px';
    }
  };

  // Render komponen berdasarkan tipe
  const renderComponent = (component: FormComponent) => {
    const isSelected = component.id === selectedComponentId;
    const inputStyle = getInputStyle();
    
    switch (component.type) {
      case 'text':
        return (
          <div className={`mb-4 ${isSelected ? 'ring-2 ring-blue-500 rounded-md p-1' : ''}`}>
            <label className="block text-sm font-medium mb-1">{component.label}</label>
            <input 
              type="text" 
              value={formData[component.id] || ''} 
              onChange={(e) => handleInputChange(component.id, e.target.value)}
              placeholder={component.placeholder || ''}
              className="w-full"
              style={inputStyle}
              required={component.required}
              disabled={submitted}
            />
            {component.helpText && <p className="text-xs mt-1 opacity-70">{component.helpText}</p>}
          </div>
        );
      
      case 'textarea':
        return (
          <div className={`mb-4 ${isSelected ? 'ring-2 ring-blue-500 rounded-md p-1' : ''}`}>
            <label className="block text-sm font-medium mb-1">{component.label}</label>
            <textarea 
              value={formData[component.id] || ''} 
              onChange={(e) => handleInputChange(component.id, e.target.value)}
              placeholder={component.placeholder || ''}
              className="w-full"
              style={{...inputStyle, minHeight: '100px'}}
              required={component.required}
              disabled={submitted}
            />
            {component.helpText && <p className="text-xs mt-1 opacity-70">{component.helpText}</p>}
          </div>
        );
      
      case 'number':
        return (
          <div className={`mb-4 ${isSelected ? 'ring-2 ring-blue-500 rounded-md p-1' : ''}`}>
            <label className="block text-sm font-medium mb-1">{component.label}</label>
            <input 
              type="number" 
              value={formData[component.id] || ''} 
              onChange={(e) => handleInputChange(component.id, e.target.value)}
              placeholder={component.placeholder || ''}
              className="w-full"
              style={inputStyle}
              min={component.min}
              max={component.max}
              required={component.required}
              disabled={submitted}
            />
            {component.helpText && <p className="text-xs mt-1 opacity-70">{component.helpText}</p>}
          </div>
        );
      
      case 'email':
        return (
          <div className={`mb-4 ${isSelected ? 'ring-2 ring-blue-500 rounded-md p-1' : ''}`}>
            <label className="block text-sm font-medium mb-1">{component.label}</label>
            <input 
              type="email" 
              value={formData[component.id] || ''} 
              onChange={(e) => handleInputChange(component.id, e.target.value)}
              placeholder={component.placeholder || ''}
              className="w-full"
              style={inputStyle}
              required={component.required}
              disabled={submitted}
            />
            {component.helpText && <p className="text-xs mt-1 opacity-70">{component.helpText}</p>}
          </div>
        );
      
      case 'select':
        return (
          <div className={`mb-4 ${isSelected ? 'ring-2 ring-blue-500 rounded-md p-1' : ''}`}>
            <label className="block text-sm font-medium mb-1">{component.label}</label>
            <select 
              value={formData[component.id] || ''} 
              onChange={(e) => handleInputChange(component.id, e.target.value)}
              className="w-full"
              style={inputStyle}
              required={component.required}
              disabled={submitted}
            >
              <option value="">Select an option</option>
              {component.options?.map((option: string, index: number) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
            {component.helpText && <p className="text-xs mt-1 opacity-70">{component.helpText}</p>}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className={`mb-4 ${isSelected ? 'ring-2 ring-blue-500 rounded-md p-1' : ''}`}>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={formData[component.id] || false} 
                onChange={(e) => handleInputChange(component.id, e.target.checked)}
                className="mr-2 h-4 w-4"
                required={component.required}
                disabled={submitted}
              />
              <label className="text-sm font-medium">{component.label}</label>
            </div>
            {component.helpText && <p className="text-xs mt-1 opacity-70">{component.helpText}</p>}
          </div>
        );
      
      case 'radio':
        return (
          <div className={`mb-4 ${isSelected ? 'ring-2 ring-blue-500 rounded-md p-1' : ''}`}>
            <label className="block text-sm font-medium mb-1">{component.label}</label>
            <div className="space-y-2">
              {component.options?.map((option: string, index: number) => (
                <div key={index} className="flex items-center">
                  <input 
                    type="radio" 
                    name={component.id} 
                    value={option} 
                    checked={formData[component.id] === option} 
                    onChange={(e) => handleInputChange(component.id, e.target.value)}
                    className="mr-2 h-4 w-4"
                    required={component.required}
                    disabled={submitted}
                  />
                  <label className="text-sm">{option}</label>
                </div>
              ))}
            </div>
            {component.helpText && <p className="text-xs mt-1 opacity-70">{component.helpText}</p>}
          </div>
        );
      
      case 'date':
        return (
          <div className={`mb-4 ${isSelected ? 'ring-2 ring-blue-500 rounded-md p-1' : ''}`}>
            <label className="block text-sm font-medium mb-1">{component.label}</label>
            <input 
              type="date" 
              value={formData[component.id] || ''} 
              onChange={(e) => handleInputChange(component.id, e.target.value)}
              className="w-full"
              style={inputStyle}
              required={component.required}
              disabled={submitted}
            />
            {component.helpText && <p className="text-xs mt-1 opacity-70">{component.helpText}</p>}
          </div>
        );
      
      case 'heading':
        return (
          <div 
            className={`mb-4 ${isSelected ? 'ring-2 ring-blue-500 rounded-md p-1' : ''}`}
            onClick={() => selectComponent(component.id)}
          >
            <h2 className="text-xl font-bold">{component.text}</h2>
          </div>
        );
      
      case 'paragraph':
        return (
          <div 
            className={`mb-4 ${isSelected ? 'ring-2 ring-blue-500 rounded-md p-1' : ''}`}
            onClick={() => selectComponent(component.id)}
          >
            <p>{component.text}</p>
          </div>
        );
      
      case 'divider':
        return (
          <div 
            className={`mb-4 ${isSelected ? 'ring-2 ring-blue-500 rounded-md p-1' : ''}`}
            onClick={() => selectComponent(component.id)}
          >
            <hr className="border-t border-gray-300 my-4" />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-xl border border-slate-200/60 p-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('desktop')}
                    className={`h-8 w-8 p-0 ${viewMode === 'desktop' ? 'bg-slate-800 text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Desktop view</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('tablet')}
                    className={`h-8 w-8 p-0 ${viewMode === 'tablet' ? 'bg-slate-800 text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Tablet view</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('mobile')}
                    className={`h-8 w-8 p-0 ${viewMode === 'mobile' ? 'bg-slate-800 text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Mobile view</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  disabled={!submitted}
                  className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Reset form</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div 
          className="mx-auto transition-all duration-300 overflow-y-auto h-full"
          style={{ width: previewWidth, maxWidth: '100%' }}
        >
          {submitted ? (
            <Card className="p-8 text-center" style={getComponentStyle()}>
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">{formSettings.submission.successMessage || 'Form submitted successfully!'}</h2>
              <p className="mb-6">Thank you for your submission.</p>
              <button 
                onClick={resetForm}
                style={getButtonStyle()}
              >
                Submit Another Response
              </button>
            </Card>
          ) : (
            <Card className="p-6" style={getComponentStyle()}>
              <form onSubmit={handleSubmit} style={{ width: getFormWidth(), margin: '0 auto' }}>
                {components.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-slate-400">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    <p className="text-slate-500">Add components to your form</p>
                  </div>
                ) : (
                  <>
                    {components.map((component) => (
                      <div 
                        key={component.id} 
                        onClick={() => selectComponent(component.id)}
                        className="cursor-pointer"
                      >
                        {renderComponent(component)}
                      </div>
                    ))}
                    <div className="mt-6">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        style={getButtonStyle()}
                        className="w-full sm:w-auto"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Submitting...</span>
                          </div>
                        ) : 'Submit'}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}