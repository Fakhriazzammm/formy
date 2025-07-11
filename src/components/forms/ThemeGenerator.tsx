'use client';

import { useState } from 'react';
import './ThemeGenerator.css';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette } from 'lucide-react';
import { useFormStore } from '@/stores/useFormStore';
import toast from 'react-hot-toast';

interface ColorTheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

/**
 * Komponen untuk menghasilkan tema kustom untuk formulir
 * Memungkinkan pengguna untuk menyesuaikan warna dan gaya formulir
 */
export default function ThemeGenerator() {
  const { formSettings, updateFormSettings } = useFormStore();
  const [theme, setTheme] = useState<ColorTheme>({
    primary: '#4f46e5',
    secondary: '#818cf8',
    background: '#ffffff',
    text: '#1e293b',
    accent: '#c7d2fe',
  });
  
  // Preset tema yang tersedia
  const themePresets = [
    {
      name: 'Indigo',
      colors: {
        primary: '#4f46e5',
        secondary: '#818cf8',
        background: '#ffffff',
        text: '#1e293b',
        accent: '#c7d2fe',
      },
    },
    {
      name: 'Emerald',
      colors: {
        primary: '#059669',
        secondary: '#34d399',
        background: '#f8fafc',
        text: '#0f172a',
        accent: '#a7f3d0',
      },
    },
    {
      name: 'Amber',
      colors: {
        primary: '#d97706',
        secondary: '#fbbf24',
        background: '#fffbeb',
        text: '#1e293b',
        accent: '#fef3c7',
      },
    },
    {
      name: 'Rose',
      colors: {
        primary: '#e11d48',
        secondary: '#fb7185',
        background: '#fff1f2',
        text: '#1e293b',
        accent: '#fecdd3',
      },
    },
    {
      name: 'Slate',
      colors: {
        primary: '#475569',
        secondary: '#94a3b8',
        background: '#f8fafc',
        text: '#0f172a',
        accent: '#e2e8f0',
      },
    },
    {
      name: 'Dark',
      colors: {
        primary: '#6366f1',
        secondary: '#a5b4fc',
        background: '#1e293b',
        text: '#f8fafc',
        accent: '#334155',
      },
    },
  ];

  // Menangani perubahan pada warna tema
  const handleColorChange = (key: keyof ColorTheme, value: string) => {
    setTheme(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Menerapkan tema ke formulir
  const applyTheme = () => {
    // Perbarui pengaturan formulir dengan tema kustom
    updateFormSettings({
      ...formSettings,
      appearance: {
        ...formSettings.appearance,
        customTheme: theme,
        useCustomTheme: true,
      },
    });
    toast.success('Theme applied successfully');
  };

  // Menerapkan preset tema
  const applyPreset = (preset: typeof themePresets[0]) => {
    setTheme(preset.colors);
    // Perbarui pengaturan formulir dengan preset tema
    updateFormSettings({
      ...formSettings,
      appearance: {
        ...formSettings.appearance,
        customTheme: preset.colors,
        useCustomTheme: true,
      },
    });
    toast.success(`${preset.name} theme applied`);
  };

  // Menghasilkan tema acak
  const generateRandomTheme = () => {
    const randomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    const newTheme = {
      primary: randomColor(),
      secondary: randomColor(),
      background: '#ffffff',
      text: '#1e293b',
      accent: randomColor(),
    };

    setTheme(newTheme);
    toast.success('Random theme generated');
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl border border-slate-200/60">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center shadow-inner">
            <Palette className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <h3 className="text-lg font-cal font-semibold text-slate-800">Theme Generator</h3>
            <p className="text-sm text-slate-500">Kustomisasi tampilan formulir Anda</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Preview tema */}
          <div 
            className="p-6 rounded-xl shadow-md border transition-all duration-300"
            style={{
              backgroundColor: theme.background,
              color: theme.text,
              borderColor: `${theme.accent}80`, // Dengan transparansi
            }}
          >
            <h3 
              className="text-lg font-medium mb-4"
              style={{ color: theme.primary }}
            >
              Preview Tema
            </h3>
            <div className="space-y-4">
              <div>
                <label 
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text }}
                >
                  Input Field
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 rounded-lg border transition-all duration-200 placeholder-style"
                  placeholder="Sample input"
                  style={{ 
                    borderColor: theme.secondary,
                    backgroundColor: `${theme.background}`,
                    color: theme.text,
                  }}
                />
              </div>
              <div>
                <button
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
                  style={{ 
                    backgroundColor: theme.primary,
                    color: '#ffffff',
                  }}
                >
                  Sample Button
                </button>
              </div>
            </div>
          </div>
          
          {/* Preset tema */}
          <div>
            <h4 className="font-medium text-slate-800 mb-3">Theme Presets</h4>
            <div className="grid grid-cols-3 gap-3">
              {themePresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.colors.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.colors.secondary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.colors.accent }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-700">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Kustomisasi warna */}
          <div>
            <h4 className="font-medium text-slate-800 mb-3">Custom Colors</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary-color" className="text-sm font-medium text-slate-700 mb-1.5 block">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-lg shadow-inner border border-slate-200"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <Input 
                    id="primary-color"
                    type="text" 
                    value={theme.primary} 
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="flex-1 bg-white"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="secondary-color" className="text-sm font-medium text-slate-700 mb-1.5 block">Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-lg shadow-inner border border-slate-200"
                    style={{ backgroundColor: theme.secondary }}
                  />
                  <Input 
                    id="secondary-color"
                    type="text" 
                    value={theme.secondary} 
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="flex-1 bg-white"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="background-color" className="text-sm font-medium text-slate-700 mb-1.5 block">Background Color</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-lg shadow-inner border border-slate-200"
                    style={{ backgroundColor: theme.background }}
                  />
                  <Input 
                    id="background-color"
                    type="text" 
                    value={theme.background} 
                    onChange={(e) => handleColorChange('background', e.target.value)}
                    className="flex-1 bg-white"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="text-color" className="text-sm font-medium text-slate-700 mb-1.5 block">Text Color</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-lg shadow-inner border border-slate-200"
                    style={{ backgroundColor: theme.text }}
                  />
                  <Input 
                    id="text-color"
                    type="text" 
                    value={theme.text} 
                    onChange={(e) => handleColorChange('text', e.target.value)}
                    className="flex-1 bg-white"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="accent-color" className="text-sm font-medium text-slate-700 mb-1.5 block">Accent Color</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-lg shadow-inner border border-slate-200"
                    style={{ backgroundColor: theme.accent }}
                  />
                  <Input 
                    id="accent-color"
                    type="text" 
                    value={theme.accent} 
                    onChange={(e) => handleColorChange('accent', e.target.value)}
                    className="flex-1 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Tombol aksi */}
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={applyTheme}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
            >
              <div className="flex items-center justify-center gap-2">
                <Palette className="h-4 w-4" />
                <span>Apply Theme</span>
              </div>
            </Button>
            
            <Button 
              onClick={generateRandomTheme}
              variant="outline"
              className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 hover:border-rose-300 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl"
            >
              <div className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/>
                </svg>
                <span>Generate Random</span>
              </div>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}