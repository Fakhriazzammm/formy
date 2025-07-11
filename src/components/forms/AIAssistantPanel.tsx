'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';
import { useFormStore } from '@/stores/useFormStore';
import toast from 'react-hot-toast';

/**
 * Komponen untuk menggunakan asisten AI dalam pembuatan formulir
 * Memungkinkan pengguna untuk menghasilkan formulir atau komponen dengan AI
 */
export default function AIAssistantPanel() {
  const { addComponent, components, updateComponent } = useFormStore();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('gemini'); // Default ke Gemini
  const [streaming, setStreaming] = useState(true);
  const [result, setResult] = useState<string | null>(null);

  // Menangani permintaan AI
  const handleAIRequest = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/form-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          model, // Menggunakan parameter 'model' sesuai dengan yang diharapkan API
          streaming,
          currentComponents: components 
        }),
      });

      if (streaming) {
        // Handle streaming response
        if (!res.body) throw new Error('Response body is null');
        
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let accumulatedResult = '';

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            accumulatedResult += chunk;
            setResult(accumulatedResult);
          }
        }

        // Process the final result to add components
        try {
          const aiComponents = JSON.parse(accumulatedResult);
          if (Array.isArray(aiComponents)) {
            aiComponents.forEach(comp => {
              addComponent(comp);
            });
            toast.success(`Added ${aiComponents.length} components`);
          }
        } catch (e) {
          console.error('Error parsing AI response:', e);
          toast.error('Could not process AI response');
        }
      } else {
        // Handle non-streaming response
        const data = await res.json();
        setResult(JSON.stringify(data, null, 2));
        
        if (Array.isArray(data)) {
          data.forEach(comp => {
            addComponent(comp);
          });
          toast.success(`Added ${data.length} components`);
        }
      }
    } catch (error) {
      console.error('AI request error:', error);
      toast.error('Failed to process AI request');
    } finally {
      setLoading(false);
    }
  };

  // Menangani permintaan untuk meningkatkan formulir yang ada
  const handleEnhanceForm = async () => {
    if (components.length === 0) {
      toast.error('Add some components first');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/enhance-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          components,
          model // Menggunakan parameter 'model' sesuai dengan yang diharapkan API
        }),
      });

      const data = await res.json();
      
      if (Array.isArray(data)) {
        // Update existing components with enhanced versions
        data.forEach(enhancedComp => {
          const existingIndex = components.findIndex(c => c.id === enhancedComp.id);
          if (existingIndex >= 0) {
            updateComponent(existingIndex, enhancedComp);
          }
        });
        toast.success('Form enhanced successfully');
      }
    } catch (error) {
      console.error('Enhancement error:', error);
      toast.error('Failed to enhance form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl border border-slate-200/60">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center shadow-inner">
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-cal font-semibold text-slate-800">AI Assistant</h3>
            <p className="text-sm text-slate-500">Buat formulir dengan bantuan AI</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100/50 shadow-inner">
            <div className="flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <h4 className="font-medium text-indigo-800">Cara Penggunaan</h4>
            </div>
            <p className="text-sm text-indigo-700 mb-2">Jelaskan formulir yang ingin Anda buat, misalnya:</p>
            <ul className="text-xs text-indigo-600 space-y-1 ml-5 list-disc">
              <li>"Buat formulir pendaftaran acara dengan nama, email, dan pilihan sesi"</li>
              <li>"Formulir survei kepuasan pelanggan dengan rating dan feedback"</li>
              <li>"Formulir kontak dengan validasi email dan pesan"</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="ai-model" className="text-sm font-medium text-slate-700 mb-1.5 block">Model AI</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Pilih model AI" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                  {/* Simpan opsi OpenAI dan Anthropic untuk penggunaan di masa depan */}
                  {/* <SelectItem value="openai">OpenAI GPT-4</SelectItem> */}
                  {/* <SelectItem value="anthropic">Anthropic Claude</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-slate-200/60 shadow-sm">
              <div>
                <h4 className="font-medium text-slate-800 text-sm">Streaming Response</h4>
                <p className="text-xs text-slate-500">Lihat respons AI secara real-time</p>
              </div>
              <Switch 
                checked={streaming} 
                onCheckedChange={setStreaming}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="ai-prompt" className="text-sm font-medium text-slate-700 mb-1.5 block">Prompt</Label>
            <Textarea 
              id="ai-prompt"
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Jelaskan formulir yang ingin Anda buat..."
              className="w-full min-h-[120px] bg-white"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleAIRequest}
              disabled={loading || !prompt.trim()}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Form</span>
                </div>
              )}
            </Button>
            
            <Button 
              onClick={handleEnhanceForm}
              disabled={loading || components.length === 0}
              variant="outline"
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl"
            >
              <div className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 16 4-4-4-4"/>
                  <path d="m6 8-4 4 4 4"/>
                  <path d="m14.5 4-5 16"/>
                </svg>
                <span>Enhance Existing Form</span>
              </div>
            </Button>
          </div>
          
          {result && (
            <div className="mt-4">
              <Label className="text-sm font-medium text-slate-700 mb-1.5 block">AI Response</Label>
              <div className="bg-slate-800 p-4 rounded-xl max-h-64 overflow-auto shadow-md border border-slate-700">
                <pre className="text-slate-300 font-mono text-xs whitespace-pre-wrap">{result}</pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}