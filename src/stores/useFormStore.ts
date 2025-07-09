import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Form, FormField, FormTheme } from '@/types';
import { generateId, deepClone } from '@/utils/helpers';
import { COLORS } from '@/utils/constants';

interface FormState {
  currentForm: Form | null;
  forms: Form[];
  isLoading: boolean;
  selectedField: FormField | null;
  
  // Actions
  setCurrentForm: (form: Form | null) => void;
  setForms: (forms: Form[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedField: (field: FormField | null) => void;
  
  // Form operations
  createForm: (title: string, description?: string) => Form;
  updateForm: (updates: Partial<Form>) => void;
  deleteForm: (formId: string) => void;
  duplicateForm: (formId: string) => Form;
  
  // Field operations
  addField: (field: Omit<FormField, 'id'>) => void;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  deleteField: (fieldId: string) => void;
  reorderFields: (startIndex: number, endIndex: number) => void;
  
  // Theme operations
  updateTheme: (theme: Partial<FormTheme>) => void;
  resetTheme: () => void;
  
  // Utilities
  getFieldById: (fieldId: string) => FormField | undefined;
  saveDraft: () => void;
  loadDraft: () => void;
  clearDraft: () => void;
}

const defaultTheme: FormTheme = {
  primary_color: COLORS.primary,
  secondary_color: COLORS.secondary,
  background_color: COLORS.background,
  text_color: '#1f2937',
  font_family: 'Inter',
};

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      currentForm: null,
      forms: [],
      isLoading: false,
      selectedField: null,

      setCurrentForm: (form) => set({ currentForm: form }),
      setForms: (forms) => set({ forms }),
      setLoading: (isLoading) => set({ isLoading }),
      setSelectedField: (field) => set({ selectedField: field }),

      createForm: (title: string, description?: string) => {
        const newForm: Form = {
          id: generateId('form_'),
          user_id: '', // Will be set when user is authenticated
          title,
          description,
          fields: [],
          theme: defaultTheme,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        set({ currentForm: newForm });
        return newForm;
      },

      updateForm: (updates) => {
        const { currentForm } = get();
        if (!currentForm) return;
        
        const updatedForm = {
          ...currentForm,
          ...updates,
          updated_at: new Date().toISOString(),
        };
        
        set({ currentForm: updatedForm });
      },

      deleteForm: (formId) => {
        const { forms } = get();
        set({ 
          forms: forms.filter(form => form.id !== formId),
          currentForm: null 
        });
      },

      duplicateForm: (formId) => {
        const { forms } = get();
        const originalForm = forms.find(form => form.id === formId);
        if (!originalForm) throw new Error('Form not found');
        
        const duplicatedForm: Form = {
          ...deepClone(originalForm),
          id: generateId('form_'),
          title: `${originalForm.title} (Copy)`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        set({ 
          forms: [...forms, duplicatedForm],
          currentForm: duplicatedForm 
        });
        
        return duplicatedForm;
      },

      addField: (fieldData) => {
        const { currentForm } = get();
        if (!currentForm) return;
        
        const newField: FormField = {
          ...fieldData,
          id: generateId('field_'),
        };
        
        const updatedForm = {
          ...currentForm,
          fields: [...currentForm.fields, newField],
          updated_at: new Date().toISOString(),
        };
        
        set({ currentForm: updatedForm });
      },

      updateField: (fieldId, updates) => {
        const { currentForm } = get();
        if (!currentForm) return;
        
        const updatedFields = currentForm.fields.map(field =>
          field.id === fieldId ? { ...field, ...updates } : field
        );
        
        const updatedForm = {
          ...currentForm,
          fields: updatedFields,
          updated_at: new Date().toISOString(),
        };
        
        set({ currentForm: updatedForm });
      },

      deleteField: (fieldId) => {
        const { currentForm, selectedField } = get();
        if (!currentForm) return;
        
        const updatedFields = currentForm.fields.filter(field => field.id !== fieldId);
        const updatedForm = {
          ...currentForm,
          fields: updatedFields,
          updated_at: new Date().toISOString(),
        };
        
        set({ 
          currentForm: updatedForm,
          selectedField: selectedField?.id === fieldId ? null : selectedField
        });
      },

      reorderFields: (startIndex, endIndex) => {
        const { currentForm } = get();
        if (!currentForm) return;
        
        const fields = [...currentForm.fields];
        const [reorderedField] = fields.splice(startIndex, 1);
        fields.splice(endIndex, 0, reorderedField);
        
        const updatedForm = {
          ...currentForm,
          fields,
          updated_at: new Date().toISOString(),
        };
        
        set({ currentForm: updatedForm });
      },

      updateTheme: (themeUpdates) => {
        const { currentForm } = get();
        if (!currentForm) return;
        
        const updatedForm = {
          ...currentForm,
          theme: { ...currentForm.theme, ...themeUpdates },
          updated_at: new Date().toISOString(),
        };
        
        set({ currentForm: updatedForm });
      },

      resetTheme: () => {
        const { currentForm } = get();
        if (!currentForm) return;
        
        const updatedForm = {
          ...currentForm,
          theme: defaultTheme,
          updated_at: new Date().toISOString(),
        };
        
        set({ currentForm: updatedForm });
      },

      getFieldById: (fieldId) => {
        const { currentForm } = get();
        return currentForm?.fields.find(field => field.id === fieldId);
      },

      saveDraft: () => {
        const { currentForm } = get();
        if (currentForm) {
          localStorage.setItem('formgen_draft', JSON.stringify(currentForm));
        }
      },

      loadDraft: () => {
        try {
          const draft = localStorage.getItem('formgen_draft');
          if (draft) {
            const form = JSON.parse(draft);
            set({ currentForm: form });
          }
        } catch (error) {
          console.error('Error loading draft:', error);
        }
      },

      clearDraft: () => {
        localStorage.removeItem('formgen_draft');
      },
    }),
    {
      name: 'form-storage',
      partialize: (state) => ({ 
        forms: state.forms,
        currentForm: state.currentForm 
      }),
    }
  )
); 