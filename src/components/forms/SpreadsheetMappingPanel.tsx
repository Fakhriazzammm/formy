'use client';

import { useState, useEffect } from 'react';
import { useFormStore } from '@/stores/useFormStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Database } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import toast from 'react-hot-toast';

/**
 * Komponen untuk mengatur integrasi Google Sheets dengan formulir
 * Memungkinkan pengguna untuk menghubungkan formulir dengan spreadsheet dan memetakan field
 */
export default function SpreadsheetMappingPanel() {
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

  // Menangani perubahan pada pemetaan field
  const handleMapChange = (field: string, value: string) => {
    setFieldMapping((prev) => ({ ...prev, [field]: value }));
  };

  // Menguji sinkronisasi dengan spreadsheet
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
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl border border-slate-200/60">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-inner">
            <Database className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-cal font-semibold text-slate-800">Integrasi Spreadsheet</h3>
            <p className="text-sm text-slate-500">Hubungkan formulir Anda dengan Google Sheets</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {!isConnected ? (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 text-center shadow-inner border border-blue-100/50">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/80 flex items-center justify-center shadow-md">
              <svg viewBox="0 0 48 48" className="w-8 h-8">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
            </div>
            <p className="text-slate-700 mb-4 font-medium">Hubungkan akun Google Anda untuk mengaktifkan integrasi spreadsheet</p>
            <Button 
              onClick={handleLogin} 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <svg viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#fff" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#fff" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#fff" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#fff" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
              Login dengan Google
            </Button>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl mb-6 flex items-center gap-3 shadow-inner border border-green-100/50">
            <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-green-800">Google Sheets Terhubung</h4>
              <p className="text-xs text-green-600">Data formulir Anda akan disinkronkan secara otomatis</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <label className="block text-sm font-medium text-slate-700">ID Spreadsheet Google</label>
            </div>
            <input 
              type="text" 
              value={spreadsheetId} 
              onChange={e => setSpreadsheetId(e.target.value)} 
              placeholder="Masukkan ID spreadsheet"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 font-mono text-sm"
            />
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Temukan di URL spreadsheet Anda
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              <label className="block text-sm font-medium text-slate-700">Nama Sheet</label>
            </div>
            <input 
              type="text" 
              value={sheetName} 
              onChange={e => setSheetName(e.target.value)} 
              placeholder="contoh: Sheet1"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:border-green-400 focus:ring-4 focus:ring-green-100 font-mono text-sm"
            />
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Nama tab di spreadsheet Anda
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
            <h4 className="font-medium text-slate-800">Pemetaan Field</h4>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl max-h-64 overflow-y-auto border border-slate-200/60 shadow-sm">
            {components.length === 0 ? (
              <div className="text-center py-8 bg-slate-50/50 rounded-lg border border-slate-100 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-slate-400">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <p className="text-slate-500">Tambahkan komponen formulir untuk memetakan field</p>
              </div>
            ) : (
              <div className="space-y-3">
                {components.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors duration-150">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shadow-sm border border-blue-100/50 flex-shrink-0">
                      <span className="text-xs font-medium text-blue-600">{c.type.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="w-1/3 text-sm font-medium truncate text-slate-700">
                      <div className="truncate">{c.type}</div>
                      <div className="text-xs text-slate-500 truncate">ID: {c.id}</div>
                    </div>
                    <input 
                      placeholder="Nama Kolom Sheet"
                      value={fieldMapping[c.id] || ''} 
                      onChange={e => handleMapChange(c.id, e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 font-mono"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleTestSync}
                  disabled={loading || !isConnected || !spreadsheetId || !sheetName}
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white border-none shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Menguji...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                      <span>Uji Sinkronisasi</span>
                    </div>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-800 text-white border-slate-700 shadow-xl">
                <p>Uji sinkronisasi data ke spreadsheet</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {result && (
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${result.startsWith('✅') ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {result}
            </span>
          )}
        </div>
        
        {sheetRows.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h4 className="font-medium text-slate-800">Data Sheet (Real-time)</h4>
              <div className="ml-auto flex items-center">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium border border-green-100">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                  Live
                </span>
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl max-h-48 overflow-auto shadow-md border border-slate-700">
              <pre className="text-slate-300 font-mono text-xs">{JSON.stringify(sheetRows, null, 2)}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}