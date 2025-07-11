'use client';

import { useState, useEffect } from 'react';
import nextDynamic from "next/dynamic";
import { useFormStore } from '@/stores/useFormStore';
import FormComponentPalette from '@/components/forms/FormComponentPalette';
import FormLivePreview from '@/components/forms/FormLivePreview';
import FormComponentProperties from '@/components/forms/FormComponentProperties';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Save, Download, List, Trash, Edit, Database, Copy, Eye, Settings, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { debounce } from '@/utils/helpers';
import toast from 'react-hot-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

// Mencegah pre-rendering
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

const ChatInterface = nextDynamic(() => import("@/components/ai/ChatInterface"), { ssr: false });
const ThemeGenerator = nextDynamic(() => import("@/components/theme/ThemeGenerator"), { ssr: false });

function SpreadsheetMappingPanel() {
  const { components } = useFormStore();
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [sheetName, setSheetName] = useState('Sheet1');
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sheetRows, setSheetRows] = useState<Record<string, string | number | boolean | string[] | undefined>[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // OAuth login
  const handleLogin = () => {
    window.location.href = '/api/auth/google/init';
  };

  // Cek koneksi Google Sheets (cookie ada)
  useEffect(() => {
    fetch('/api/forms/sync-sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spreadsheetId: 'dummy', sheetName: 'dummy', mode: 'ping' }),
    })
      .then(res => res.status !== 401 && setIsConnected(true))
      .catch(() => setIsConnected(false));
  }, []);

  // Polling real-time fetch data sheet
  useEffect(() => {
    if (!isConnected || !spreadsheetId || !sheetName) return;
    const fetchRows = async () => {
      try {
        const res = await fetch('/api/forms/sync-sheet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ spreadsheetId, sheetName, fieldMapping, formData: {}, mode: 'get' }),
        });
        const data = await res.json();
        if (Array.isArray(data.rows)) setSheetRows(data.rows);
      } catch {
        // No-op, error handling is done by the catch block below
      }
    };
    fetchRows();
    const timer = setInterval(fetchRows, 30000);
    return () => clearInterval(timer);
  }, [isConnected, spreadsheetId, sheetName, fieldMapping]);

  const handleMapChange = (field: string, value: string) => {
    setFieldMapping((prev) => ({ ...prev, [field]: value }));
  };

  const handleTestSync = async () => {
    setLoading(true);
    setResult(null);
    try {
      const formData: Record<string, string | number | boolean | string[] | undefined> = {};
      components.forEach((c) => {
        formData[c.id] = `Contoh data untuk ${c.type}`;
      });
      const res = await fetch('/api/forms/sync-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheetId, sheetName, fieldMapping, formData }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult('✅ Sync berhasil!');
        toast.success('Synchronization successful!');
      } else {
        setResult('❌ ' + (data.error || 'Gagal sync'));
        toast.error(data.error || 'Synchronization failed');
      }
    } catch {
      setResult('❌ Error: Unknown error');
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-background shadow-md rounded-lg border border-border">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold flex items-center mb-4 font-cal text-foreground">
          <Database className="w-5 h-5 mr-2 text-primary" />
          Spreadsheet Integration
        </h3>
        
        {!isConnected ? (
          <div className="bg-primary/5 p-4 rounded-lg mb-4 text-center">
            <p className="text-primary mb-3 font-inter">Connect your Google account to enable spreadsheet integration</p>
            <Button 
              onClick={handleLogin} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 font-inter"
            >
              <svg viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
              Login with Google
            </Button>
          </div>
        ) : (
          <div className="bg-green-50 p-3 rounded-lg mb-4 flex items-center font-inter text-green-700">
            <span className="bg-green-500 rounded-full w-3 h-3 mr-2"></span>
            Google Sheets Connected
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1 font-inter">Google Sheets ID</label>
            <input 
              type="text" 
              value={spreadsheetId} 
              onChange={e => setSpreadsheetId(e.target.value)} 
              placeholder="Enter spreadsheet ID"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground font-jetbrains"
            />
            <p className="text-xs text-muted-foreground mt-1 font-inter">Find in your spreadsheet URL</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1 font-inter">Sheet Name</label>
            <input 
              type="text" 
              value={sheetName} 
              onChange={e => setSheetName(e.target.value)} 
              placeholder="e.g. Sheet1"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground font-jetbrains"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-foreground mb-2 font-inter">Field Mapping</h4>
          <div className="bg-muted p-3 rounded-lg max-h-64 overflow-y-auto">
            {components.length === 0 ? (
              <p className="text-muted-foreground text-center py-4 font-inter">Add form components to map fields</p>
            ) : (
              <div className="space-y-2">
                {components.map((c) => (
                  <div key={c.id} className="flex items-center gap-2">
                    <div className="w-1/3 text-sm font-medium truncate font-inter">{c.type} ({c.id})</div>
                    <input 
                      placeholder="Sheet Column Name"
                      value={fieldMapping[c.id] || ''} 
                      onChange={e => handleMapChange(c.id, e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-border rounded bg-background text-foreground font-jetbrains"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleTestSync}
                  disabled={loading || !isConnected || !spreadsheetId || !sheetName}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-inter"
                >
                  {loading ? 'Testing...' : 'Test Synchronization'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Test data sync to spreadsheet</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {result && (
            <span className={`text-sm ${result.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {result}
            </span>
          )}
        </div>
        
        {sheetRows.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-foreground mb-2 font-inter">Sheet Data (Real-time)</h4>
            <div className="bg-muted p-4 rounded-lg max-h-40 overflow-auto font-jetbrains text-xs">
              <pre>{JSON.stringify(sheetRows, null, 2)}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function BuilderPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const components = useFormStore(s => s.components);
  const setComponents = useFormStore.setState;
  const [name, setName] = useState('');
  const [showList, setShowList] = useState(false);
  const [formsList, setFormsList] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [editId, setEditId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState('editor');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeComponentId, setActiveComponentId] = useState<string | null>(null);

  // Handle URL prompt parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const promptParam = params.get('prompt');
    if (promptParam) {
      setInitialPrompt(promptParam);
      setShowAI(true);
    }
  }, []);

  // Auto-save functionality with debounce
  useEffect(() => {
    const saveToLocalStorage = debounce(() => {
      localStorage.setItem('formy_builder', JSON.stringify(components));
    }, 1000);
    
    saveToLocalStorage();
    return () => saveToLocalStorage.cancel();
  }, [components]);

  // Tambahkan useEffect untuk redirect jika tidak terautentikasi
  useEffect(() => {
    // Redirect ke login jika tidak terautentikasi
    if (!isLoading && !user) {
      router.push('/login?callbackUrl=/builder');
    }
  }, [user, isLoading, router]);

  // Tampilkan loading state saat mengecek autentikasi
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Jika tidak terautentikasi, tampilkan null (akan di-redirect oleh useEffect)
  if (!user) {
    return null;
  }

  async function handleSave() {
    try {
      setIsSaving(true);
      let res;
      if (editId) {
        // Update form
        res = await fetch('/api/forms/list', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editId, name, components }),
        });
      } else {
        // Insert form
        res = await fetch('/api/forms/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, components }),
        });
      }
      
      if (res.ok) {
        toast.success(editId ? 'Form updated successfully!' : 'Form saved successfully!');
        setEditId(null);
      } else {
        toast.error('Failed to save form');
      }
    } catch {
      toast.error('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  }

  function handleLoad() {
    const data = localStorage.getItem('formy_builder');
    if (data) {
      setComponents({ components: JSON.parse(data) });
      toast.success('Form loaded from local storage');
    } else {
      toast.error('No saved form found in local storage');
    }
  }

  async function handleShowList() {
    setShowList(v => !v);
    if (!showList) {
      await refreshFormsList();
    }
  }

  async function refreshFormsList() {
    try {
      const res = await fetch('/api/forms/list');
      const data = await res.json();
      setFormsList(data.forms || []);
    } catch {
      toast.error('Failed to fetch forms list');
    }
  }

  function handleLoadFromBackend(form: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    setComponents({ components: form.config });
    setName(form.name || '');
    toast.success('Form loaded from server');
    setShowList(false);
    setEditId(null);
  }

  function handleEditForm(form: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    setComponents({ components: form.config });
    setName(form.name || '');
    setEditId(form.id);
    toast.success('Editing form: ' + (form.name || 'Untitled'));
    setShowList(false);
  }

  async function handleDeleteForm(id: string) {
    if (!window.confirm('Are you sure you want to delete this form?')) return;
    
    try {
      const res = await fetch('/api/forms/list', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      if (res.ok) {
        toast.success('Form deleted successfully');
        await refreshFormsList();
      } else {
        toast.error('Failed to delete form');
      }
    } catch {
      toast.error('An error occurred while deleting');
    }
  }
  
  const toggleAI = () => setShowAI(!showAI);
  const toggleTheme = () => setShowTheme(!showTheme);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Form Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 w-72 bg-background text-foreground font-inter"
              />
              {editId && (
                <span className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
                  Editing Form
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleLoad} 
                      variant="outline"
                      className="flex items-center gap-2 font-inter"
                    >
                      <Download size={16} />
                      <span className="hidden sm:inline">Load Draft</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Load form from local draft</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleShowList} 
                      variant="outline"
                      className="flex items-center gap-2 font-inter"
                    >
                      <List size={16} />
                      <span className="hidden sm:inline">My Forms</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View all saved forms</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving || !name}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-inter flex items-center gap-2"
                    >
                      <Save size={16} />
                      <span>{isSaving ? 'Saving...' : 'Save Form'}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save form to cloud</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      variant={isPreviewMode ? "default" : "outline"}
                      className={`flex items-center gap-2 ${isPreviewMode ? "bg-green-600 hover:bg-green-700" : ""}`}
                    >
                      <Eye size={16} />
                      <span className="hidden sm:inline">Preview Mode</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle preview mode</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-1">
            <TabsList className="bg-muted inline-flex h-9 items-center justify-center rounded-lg p-1 text-muted-foreground">
              <TabsTrigger value="editor" className="data-[state=active]:bg-background data-[state=active]:text-foreground font-inter">
                <Edit className="w-4 h-4 mr-2" />
                Form Editor
              </TabsTrigger>
              <TabsTrigger value="integration" className="data-[state=active]:bg-background data-[state=active]:text-foreground font-inter">
                <Database className="w-4 h-4 mr-2" />
                Spreadsheet Integration
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-background data-[state=active]:text-foreground font-inter">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="mt-0">
              {isPreviewMode ? (
                <div className="max-w-3xl mx-auto p-8 bg-background rounded-lg shadow-lg border border-border">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold font-cal">{name || 'Untitled Form'}</h2>
                    <Button
                      onClick={() => setIsPreviewMode(false)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Edit size={14} />
                      Exit Preview
                    </Button>
                  </div>
                  <FormLivePreview readOnly />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(200px,300px)_1fr_minmax(250px,350px)] gap-6 relative">
                  {/* Left Sidebar - Component Palette */}
                  <div className={`bg-background p-4 rounded-lg shadow-sm border border-border transition-all duration-300 ${
                    isSidebarCollapsed ? 'lg:w-16' : 'lg:w-full'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-sm font-medium text-muted-foreground uppercase font-inter ${
                        isSidebarCollapsed ? 'lg:hidden' : ''
                      }`}>
                        Components
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="lg:flex hidden"
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                      >
                        {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                      </Button>
                    </div>
                    <FormComponentPalette collapsed={isSidebarCollapsed} />
                  </div>
                  
                  {/* Main Preview Area */}
                  <div className="bg-background p-6 rounded-lg shadow-sm border border-border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-muted-foreground uppercase font-inter">Form Preview</h3>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setComponents({ components: [] })}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash size={14} className="mr-1" />
                          Clear All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsPreviewMode(true)}
                        >
                          <Eye size={14} className="mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-6 min-h-[600px]">
                      <FormLivePreview onSelectComponent={setActiveComponentId} />
                    </div>
                  </div>
                  
                  {/* Right Properties Panel */}
                  <div className="bg-background p-4 rounded-lg shadow-sm border border-border">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase font-inter mb-3">Properties</h3>
                    <FormComponentProperties activeComponentId={activeComponentId} />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="integration" className="mt-0">
              <div className="container mx-auto px-4 py-6">
                <SpreadsheetMappingPanel />
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <div className="container mx-auto px-4 py-6">
                <Card className="bg-white shadow-md rounded-lg border border-gray-100">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold flex items-center mb-4">
                      <Settings className="w-5 h-5 mr-2 text-blue-500" />
                      Form Settings
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Form Options</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              Show progress bar
                            </label>
                          </div>
                          <div>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              Enable form validation
                            </label>
                          </div>
                          <div>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              Save responses to database
                            </label>
                          </div>
                          <div>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              Email notification on submission
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Form Appearance</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm mb-1">Form Width</label>
                            <select className="w-full p-2 border border-gray-300 rounded-md">
                              <option>Full width</option>
                              <option>Medium (800px)</option>
                              <option>Narrow (600px)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Input Style</label>
                            <select className="w-full p-2 border border-gray-300 rounded-md">
                              <option>Default</option>
                              <option>Minimal</option>
                              <option>Classic</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Submission Settings</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-1">Success Message</label>
                          <textarea 
                            className="w-full p-2 border border-gray-300 rounded-md" 
                            rows={2}
                            defaultValue="Thank you for your submission!"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Redirect URL (optional)</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded-md" 
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </header>

      {/* Form List Panel */}
      {showList && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Saved Forms</h3>
              <Button variant="outline" size="sm" onClick={() => setShowList(false)}>Close</Button>
            </div>
            
            {formsList.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-2">
                  <AlertCircle size={32} className="mx-auto" />
                </div>
                <p className="text-gray-500">No saved forms found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formsList.map(form => (
                  <Card key={form.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <h4 className="font-medium mb-1 truncate">{form.name || '(Untitled Form)'}</h4>
                        <div className="text-xs text-gray-500 mb-3">ID: {form.id}</div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {(form.config || []).slice(0, 3).map((c: any, i: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                            <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">
                              {c.type}
                            </span>
                          ))}
                          {(form.config || []).length > 3 && (
                            <span className="bg-gray-50 text-gray-500 text-xs px-2 py-0.5 rounded">
                              +{(form.config || []).length - 3} more
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1" 
                            onClick={() => handleLoadFromBackend(form)}
                          >
                            <Copy size={14} />
                            <span>Load</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1" 
                            onClick={() => handleEditForm(form)}
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1 hover:bg-red-50 hover:text-red-600" 
                            onClick={() => handleDeleteForm(form.id)}
                          >
                            <Trash size={14} />
                            <span>Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={toggleTheme}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  showTheme ? 'bg-indigo-600 text-white rotate-45' : 'bg-white text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <Settings size={24} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Theme Settings</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={toggleAI}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  showAI ? 'bg-blue-600 text-white rotate-45' : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>AI Assistant</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Enhanced AI Assistant Panel */}
      {showAI && (
        <div className="fixed bottom-6 right-24 z-40 w-96 bg-background rounded-lg shadow-xl border border-border transition-all">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-medium font-cal">AI Form Assistant</h3>
              <Button variant="ghost" size="sm" onClick={toggleAI}>
                <X size={16} />
              </Button>
            </div>
          </div>
          <ChatInterface initialPrompt={initialPrompt} />
        </div>
      )}
      
      {/* Enhanced Theme Generator Panel */}
      {showTheme && (
        <div className="fixed bottom-6 right-24 z-40 w-96 bg-background rounded-lg shadow-xl border border-border transition-all">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-medium font-cal">Theme Customization</h3>
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                <X size={16} />
              </Button>
            </div>
          </div>
          <ThemeGenerator />
        </div>
      )}
    </div>
  );
} 