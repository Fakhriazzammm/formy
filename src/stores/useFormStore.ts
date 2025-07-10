import { create } from 'zustand';
import { FormField } from '@/types';
import { ThemeConfig } from '@/components/theme/ThemeGenerator';

export type FormComponent = {
  id: string;
  type: string;
  props: Partial<FormField>;
};

interface FormBuilderState {
  components: FormComponent[];
  selectedId: string | null;
  addComponent: (type: string) => void;
  removeComponent: (id: string) => void;
  updateComponent: (id: string, props: Partial<FormField>) => void;
  selectComponent: (id: string | null) => void;
  moveComponent: (from: number, to: number) => void;
  themeConfig: ThemeConfig;
  setThemeConfig: (theme: ThemeConfig) => void;
}

export const useFormStore = create<FormBuilderState>((set) => ({
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
  themeConfig: {
    name: "Default",
    primary: "#0070f3",
    secondary: "#f50057",
    background: "#fff",
    font: "Inter, sans-serif",
    logo: undefined,
  },
  setThemeConfig: (theme) => set(() => ({ themeConfig: theme })),
})); 