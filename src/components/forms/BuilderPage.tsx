'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { nanoid } from 'nanoid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useFormStore } from '@/stores/useFormStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Loader2, Save, Share, Eye, Settings, Database, Wand2, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

// Komponen yang telah direfaktor
import SpreadsheetMappingPanel from '@/components/forms/SpreadsheetMappingPanel';
import FormListPanel from '@/components/forms/FormListPanel';
import FormSettings from '@/components/forms/FormSettings';
import AIAssistantPanel from '@/components/forms/AIAssistantPanel';
import ThemeGenerator from '@/components/forms/ThemeGenerator';
import ComponentPalette from '@/components/forms/ComponentPalette';
import PropertyPanel from '@/components/forms/PropertyPanel';
import FormPreview from '@/components/forms/FormPreview';

/**
 * Komponen utama pembuat formulir (Form Builder)
 */
export default function BuilderPage() {
  const searchParams = useSearchParams();
  const { toast: showToast } = useToast();
  
  // State untuk UI
  const [formName, setFormName] = useState('Untitled Form');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('builder');
  const [showPreview, setShowPreview] = useState(false);
  const [showFormList, setShowFormList] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showThemeGenerator, setShowThemeGenerator] = useState(false);
  
  // Mengambil state dari store
  const { 
    formId, 
    setFormId, 
    components, 
    setComponents, 
    formSettings, 
    setFormSettings,
    spreadsheetConfig,
    setSpreadsheetConfig,
    resetForm
  } = useFormStore();
  
  const { user, isAuthenticated } = useAuthStore();

  // Mengambil prompt dari URL jika ada
  useEffect(() => {
    const prompt = searchParams.get('prompt');
    if (prompt) {
      setShowAIAssistant(true);
    }
  }, [searchParams]);

  // Menyimpan state ke localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && formId) {
      localStorage.setItem(`form_draft_${formId}`, JSON.stringify({
        formName,
        components,
        formSettings,
        spreadsheetConfig
      }));
    }
  }, [formId, formName, components, formSettings, spreadsheetConfig]);

  // Memuat draft dari localStorage
  const loadDraft = () => {
    try {
      const draftId = formId || nanoid();
      const savedDraft = localStorage.getItem(`form_draft_${draftId}`);
      
      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft);
        setFormName(parsedDraft.formName || 'Untitled Form');
        setComponents(parsedDraft.components || []);
        setFormSettings(parsedDraft.formSettings || {});
        setSpreadsheetConfig(parsedDraft.spreadsheetConfig || {});
        
        if (!formId) {
          setFormId(draftId);
        }
        
        toast.success('Draft loaded successfully');
      } else {
        toast.error('No draft found');
      }
    } catch (error) {
      console.error('Error loading draft:', error);
      toast.error('Failed to load draft');
    }
  };

  // Menyimpan formulir ke database
  const saveForm = async () => {
    if (!isAuthenticated) {
      showToast({
        title: 'Authentication Required',
        description: 'Please sign in to save your form',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      
      const formData = {
        id: formId,
        name: formName,
        components,
        settings: formSettings,
        spreadsheetConfig,
        userId: user?.id,
      };

      const response = await fetch('/api/forms', {
        method: formId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save form');
      }

      const result = await response.json();
      
      if (!formId) {
        setFormId(result.id);
      }
      
      toast.success('Form saved successfully');
    } catch (error) {
      console.error('Error saving form:', error);
      toast.error('Failed to save form');
    } finally {
      setIsSaving(false);
    }
  };

  // Memuat formulir dari database
  const loadForm = async (id: string) => {
    try {
      const response = await fetch(`/api/forms/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to load form');
      }
      
      const formData = await response.json();
      
      setFormId(formData.id);
      setFormName(formData.name || 'Untitled Form');
      setComponents(formData.components || []);
      setFormSettings(formData.settings || {});
      setSpreadsheetConfig(formData.spreadsheetConfig || {});
      
      setShowFormList(false);
      toast.success('Form loaded successfully');
    } catch (error) {
      console.error('Error loading form:', error);
      toast.error('Failed to load form');
    }
  };

  // Membuat formulir baru
  const createNewForm = () => {
    if (window.confirm('Are you sure you want to create a new form? Any unsaved changes will be lost.')) {
      resetForm();
      setFormName('Untitled Form');
      setFormId(nanoid());
      toast.success('New form created');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="border-b bg-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Input
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="max-w-xs font-medium"
            placeholder="Form Name"
          />
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadDraft}
              className="text-xs"
            >
              Load Draft
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFormList(true)}
              className="text-xs"
            >
              My Forms
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className={`text-xs ${showPreview ? 'bg-slate-100' : ''}`}
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              Preview
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-slate-600"
                  disabled={true}
                >
                  <Share className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Share (Premium Feature)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button
            onClick={saveForm}
            disabled={isSaving}
            className="gap-1"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start h-10 bg-transparent p-0">
            <TabsTrigger 
              value="builder" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-10"
            >
              Form Builder
            </TabsTrigger>
            <TabsTrigger 
              value="spreadsheet" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-10"
            >
              <Database className="h-4 w-4 mr-1" />
              Spreadsheet Integration
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-10"
            >
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {showPreview ? (
          <div className="h-full bg-slate-50 p-4 overflow-auto">
            <FormPreview />
          </div>
        ) : (
          <TabsContent value="builder" className="h-full m-0 p-0 data-[state=inactive]:hidden">
            <div className="grid grid-cols-[300px_1fr_300px] h-full">
              <div className="border-r h-full overflow-hidden">
                <ComponentPalette />
              </div>
              
              <div className="h-full bg-slate-50 overflow-auto p-4">
                <FormPreview />
              </div>
              
              <div className="border-l h-full overflow-hidden">
                <PropertyPanel />
              </div>
            </div>
          </TabsContent>
        )}
        
        <TabsContent value="spreadsheet" className="h-full m-0 p-4 data-[state=inactive]:hidden overflow-auto">
          <SpreadsheetMappingPanel />
        </TabsContent>
        
        <TabsContent value="settings" className="h-full m-0 p-4 data-[state=inactive]:hidden overflow-auto">
          <FormSettings />
        </TabsContent>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-white shadow-md hover:bg-slate-100"
                onClick={() => setShowThemeGenerator(!showThemeGenerator)}
              >
                <Palette className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Theme Generator</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="icon"
                className="h-10 w-10 rounded-full shadow-md"
                onClick={() => setShowAIAssistant(!showAIAssistant)}
              >
                <Wand2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>AI Assistant</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Popover Panels */}
      {showFormList && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowFormList(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <FormListPanel onSelectForm={loadForm} onCreateNew={createNewForm} onClose={() => setShowFormList(false)} />
          </div>
        </div>
      )}
      
      {showAIAssistant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAIAssistant(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <AIAssistantPanel onClose={() => setShowAIAssistant(false)} />
          </div>
        </div>
      )}
      
      {showThemeGenerator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowThemeGenerator(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <ThemeGenerator onClose={() => setShowThemeGenerator(false)} />
          </div>
        </div>
      )}
    </div>
  );
}