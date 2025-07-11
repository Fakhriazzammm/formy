'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Files, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Form {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface FormListPanelProps {
  onLoadForm: (formId: string) => void;
}

/**
 * Komponen untuk menampilkan daftar formulir yang telah dibuat
 * Memungkinkan pengguna untuk memuat, mengedit, dan menghapus formulir
 */
export default function FormListPanel({ onLoadForm }: FormListPanelProps) {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteFormId, setDeleteFormId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Memuat daftar formulir saat komponen dimount
  useEffect(() => {
    fetchForms();
  }, []);

  // Mengambil daftar formulir dari API
  const fetchForms = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/forms');
      const data = await res.json();
      if (Array.isArray(data.forms)) {
        setForms(data.forms);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  // Menghapus formulir
  const handleDeleteForm = async () => {
    if (!deleteFormId) return;
    
    try {
      const res = await fetch(`/api/forms/${deleteFormId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setForms(forms.filter(f => f.id !== deleteFormId));
        toast.success('Form deleted successfully');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete form');
      }
    } catch (error) {
      console.error('Error deleting form:', error);
      toast.error('An error occurred while deleting the form');
    } finally {
      setDeleteFormId(null);
      setDeleteDialogOpen(false);
    }
  };

  // Memformat tanggal untuk tampilan
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl border border-slate-200/60">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center shadow-inner">
              <Files className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-cal font-semibold text-slate-800">Formulir Saya</h3>
              <p className="text-sm text-slate-500">Kelola formulir yang telah Anda buat</p>
            </div>
            <Button 
              onClick={fetchForms} 
              variant="ghost" 
              size="sm" 
              className="ml-auto text-slate-500 hover:text-slate-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${loading ? 'animate-spin' : ''}`}>
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/>
              </svg>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {forms.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-slate-100 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-slate-300">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              <p className="text-slate-500 mb-4">Anda belum membuat formulir apa pun</p>
              <Button 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                Buat Formulir Baru
              </Button>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {forms.map((form) => (
                <div key={form.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors duration-150 border border-slate-100 group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center shadow-sm border border-indigo-100/50 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <path d="M16 13H8"/>
                      <path d="M16 17H8"/>
                      <path d="M10 9H8"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-800 truncate">{form.name || 'Untitled Form'}</h4>
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <span className="truncate">Diperbarui: {formatDate(form.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => onLoadForm(form.id)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-800 text-white border-slate-700">
                          <p>Edit formulir</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => {
                              setDeleteFormId(form.id);
                              setDeleteDialogOpen(true);
                            }}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-800 text-white border-slate-700">
                          <p>Hapus formulir</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Formulir</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus formulir ini? Tindakan ini tidak dapat dibatalkan dan semua data formulir akan hilang secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-800">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteForm}
              className="bg-red-500 hover:bg-red-600 text-white border-none"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}