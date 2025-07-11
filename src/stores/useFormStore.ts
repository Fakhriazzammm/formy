import { create } from 'zustand';
import { FormField } from '@/types';
import { ThemeConfig } from '@/components/theme/ThemeGenerator';

export type FormComponent = {
  id: string;
  type: string;
  props: Partial<FormField>;
  options?: string[];
};

// Definisi tipe untuk pengaturan formulir
export interface FormSettings {
  behavior: {
    requireAuth: boolean;
    authProvider: string;
    allowMultipleSubmissions: boolean;
    collectEmail: boolean;
    requiredByDefault: boolean;
    storeResponses: boolean;
  };
  appearance: {
    width: 'narrow' | 'medium' | 'wide';
    inputStyle: 'outline' | 'filled' | 'underline';
    colorTheme: string;
    useCustomTheme: boolean;
    customTheme?: ThemeConfig;
  };
  submission: {
    successMessage: string;
    enableRedirect: boolean;
    redirectUrl: string;
    enableEmailNotification: boolean;
    notificationEmail: string;
    emailSubject: string;
  };
}

// Definisi tipe untuk konfigurasi spreadsheet
export interface SpreadsheetConfig {
  connected: boolean;
  type?: 'google_sheets' | 'excel' | 'airtable';
  url?: string;
  fieldMapping?: Record<string, string>;
}

interface FormBuilderState {
  formId: string | null;
  setFormId: (id: string) => void;
  components: FormComponent[];
  selectedId: string | null;
  addComponent: (type: string) => void;
  removeComponent: (id: string) => void;
  updateComponent: (id: string, props: Partial<FormField>) => void;
  selectComponent: (id: string | null) => void;
  moveComponent: (from: number, to: number) => void;
  duplicateComponent: (id: string) => void;
  themeConfig: ThemeConfig;
  setThemeConfig: (theme: ThemeConfig) => void;
  formSettings: FormSettings;
  updateFormSettings: (settings: FormSettings) => void;
  spreadsheetConfig: SpreadsheetConfig;
  setSpreadsheetConfig: (config: SpreadsheetConfig) => void;
  resetForm: () => void;
}

export const useFormStore = create<FormBuilderState>((set) => ({
  // Form ID
  formId: null,
  setFormId: (id) => set(() => ({ formId: id })),
  
  // Components
  components: [],
  selectedId: null,
  addComponent: (type) => set((state) => ({
    components: [
      ...state.components,
      { id: Math.random().toString(36).slice(2), type, props: {} },
    ],
  })),
  removeComponent: (id) => set((state) => ({
    components: state.components.filter((c) => c.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId,
  })),
  updateComponent: (id, props) => set((state) => ({
    components: state.components.map((c) =>
      c.id === id ? { ...c, props: { ...c.props, ...props } } : c
    ),
  })),
  selectComponent: (id) => set(() => ({ selectedId: id })),
  moveComponent: (from, to) => set((state) => {
    const updated = [...state.components];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    return { components: updated };
  }),
  duplicateComponent: (id) => set((state) => {
    const componentToDuplicate = state.components.find((c) => c.id === id);
    if (!componentToDuplicate) return state;
    
    const newComponent = {
      ...componentToDuplicate,
      id: Math.random().toString(36).slice(2),
      props: { ...componentToDuplicate.props }
    };
    
    const index = state.components.findIndex((c) => c.id === id);
    const newComponents = [...state.components];
    newComponents.splice(index + 1, 0, newComponent);
    
    return { components: newComponents };
  }),
  
  // Theme Config
  themeConfig: {
    name: "Default",
    primary: "#0070f3",
    secondary: "#f50057",
    background: "#fff",
    font: "Inter, sans-serif",
    logo: undefined,
  },
  setThemeConfig: (theme) => set(() => ({ themeConfig: theme })),
  
  // Form Settings
  formSettings: {
    behavior: {
      requireAuth: false,
      authProvider: 'google',
      allowMultipleSubmissions: true,
      collectEmail: false,
      requiredByDefault: false,
      storeResponses: true,
    },
    appearance: {
      width: 'medium',
      inputStyle: 'outline',
      colorTheme: 'blue',
      useCustomTheme: false,
      customTheme: null,
    },
    submission: {
      successMessage: 'Terima kasih! Formulir Anda telah berhasil dikirim.',
      enableRedirect: false,
      redirectUrl: '',
      enableEmailNotification: false,
      notificationEmail: '',
      emailSubject: 'Pengiriman Formulir Baru',
    },
  },
  updateFormSettings: (settings) => set(() => ({ formSettings: settings })),
  
  // Spreadsheet Config
  spreadsheetConfig: {
    connected: false,
  },
  setSpreadsheetConfig: (config) => set(() => ({ spreadsheetConfig: config })),
  
  // Reset Form
  resetForm: () => set(() => ({
    formId: null,
    components: [],
    selectedId: null,
    formSettings: {
      behavior: {
        requireAuth: false,
        authProvider: 'google',
        allowMultipleSubmissions: true,
        collectEmail: false,
        requiredByDefault: false,
        storeResponses: true,
      },
      appearance: {
        width: 'medium',
        inputStyle: 'outline',
        colorTheme: 'blue',
        useCustomTheme: false,
        customTheme: null,
      },
      submission: {
        successMessage: 'Terima kasih! Formulir Anda telah berhasil dikirim.',
        enableRedirect: false,
        redirectUrl: '',
        enableEmailNotification: false,
        notificationEmail: '',
        emailSubject: 'Pengiriman Formulir Baru',
      },
    },
    spreadsheetConfig: {
      connected: false,
    },
  })),
}));