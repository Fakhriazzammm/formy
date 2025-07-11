import { useFormStore } from '@/stores/useFormStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormComponentPropertiesProps {
  activeComponentId?: string | null;
}

export default function FormComponentProperties({ activeComponentId }: FormComponentPropertiesProps) {
  const { components, updateComponent, removeComponent } = useFormStore();
  const activeComponent = components.find(c => c.id === activeComponentId);

  if (!activeComponent) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
        <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-cal font-semibold text-slate-800 mb-2">Pilih Komponen</h3>
        <p className="text-sm text-slate-500 max-w-xs">
          Klik komponen di area preview untuk mengedit propertinya
        </p>
      </div>
    );
  }

  const handleChange = (key: string, value: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    updateComponent(activeComponent.id, { [key]: value });
  };

  const handleDelete = () => {
    removeComponent(activeComponent.id);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeComponent.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        {/* Component Type Header */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{activeComponent.type.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h3 className="text-lg font-cal font-semibold text-slate-800 capitalize">{activeComponent.type}</h3>
                <p className="text-xs text-slate-500 font-jetbrains">ID: {activeComponent.id}</p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
            >
              <Trash className="w-4 h-4 mr-2" />
              Hapus Komponen
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Properties */}
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4">
            <h4 className="text-sm font-cal font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Properti Dasar
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="label" className="text-sm font-medium text-slate-700">Label</Label>
                <Input
                  id="label"
                  value={activeComponent.props.label || ''}
                  onChange={(e) => handleChange('label', e.target.value)}
                  placeholder="Masukkan label field"
                  className="bg-white border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">Nama Field</Label>
                <Input
                  id="name"
                  value={activeComponent.props.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Masukkan nama field"
                  className="bg-white border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="placeholder" className="text-sm font-medium text-slate-700">Placeholder</Label>
                <Input
                  id="placeholder"
                  value={activeComponent.props.placeholder || ''}
                  onChange={(e) => handleChange('placeholder', e.target.value)}
                  placeholder="Masukkan teks placeholder"
                  className="bg-white border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="helpText" className="text-sm font-medium text-slate-700">Teks Bantuan</Label>
                <Textarea
                  id="helpText"
                  value={activeComponent.props.helpText || ''}
                  onChange={(e) => handleChange('helpText', e.target.value)}
                  placeholder="Masukkan teks bantuan"
                  rows={2}
                  className="bg-white border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-lg resize-none"
                />
              </div>
            </div>
          </div>

          {/* Validation Properties */}
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4">
            <h4 className="text-sm font-cal font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Validasi
            </h4>
            
            <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg border border-slate-100">
              <div>
                <Label htmlFor="required" className="text-sm font-medium text-slate-700">Field Wajib</Label>
                <p className="text-xs text-slate-500">Field ini harus diisi</p>
              </div>
              <Switch
                id="required"
                checked={activeComponent.props.required || false}
                onCheckedChange={(checked) => handleChange('required', checked)}
              />
            </div>

            {(activeComponent.type === 'text' || activeComponent.type === 'textarea') && (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="minLength" className="text-sm font-medium text-slate-700">Panjang Minimum</Label>
                  <Input
                    id="minLength"
                    type="number"
                    value={activeComponent.props.minLength || ''}
                    onChange={(e) => handleChange('minLength', e.target.value)}
                    placeholder="0"
                    className="bg-white border-slate-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxLength" className="text-sm font-medium text-slate-700">Panjang Maksimum</Label>
                  <Input
                    id="maxLength"
                    type="number"
                    value={activeComponent.props.maxLength || ''}
                    onChange={(e) => handleChange('maxLength', e.target.value)}
                    placeholder="Tidak terbatas"
                    className="bg-white border-slate-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pattern" className="text-sm font-medium text-slate-700">Pola Validasi</Label>
                  <Select
                    value={activeComponent.props.pattern || ''}
                    onValueChange={(value) => handleChange('pattern', value)}
                  >
                    <SelectTrigger className="bg-white border-slate-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 rounded-lg">
                      <SelectValue placeholder="Pilih pola validasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tidak ada</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="url">URL</SelectItem>
                      <SelectItem value="phone">Nomor Telepon</SelectItem>
                      <SelectItem value="custom">Custom Regex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {activeComponent.type === 'number' && (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="min" className="text-sm font-medium text-slate-700">Nilai Minimum</Label>
                  <Input
                    id="min"
                    type="number"
                    value={activeComponent.props.min || ''}
                    onChange={(e) => handleChange('min', e.target.value)}
                    placeholder="Tidak ada minimum"
                    className="bg-white border-slate-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max" className="text-sm font-medium text-slate-700">Nilai Maksimum</Label>
                  <Input
                    id="max"
                    type="number"
                    value={activeComponent.props.max || ''}
                    onChange={(e) => handleChange('max', e.target.value)}
                    placeholder="Tidak ada maksimum"
                    className="bg-white border-slate-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="step" className="text-sm font-medium text-slate-700">Langkah</Label>
                  <Input
                    id="step"
                    type="number"
                    value={activeComponent.props.step || ''}
                    onChange={(e) => handleChange('step', e.target.value)}
                    placeholder="1"
                    className="bg-white border-slate-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Type-specific Properties */}
          {(activeComponent.type === 'dropdown' || activeComponent.type === 'radio' || activeComponent.type === 'checkbox' || activeComponent.type === 'multiselect') && (
            <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4">
              <h4 className="text-sm font-cal font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Opsi Pilihan
              </h4>
              
              <div className="space-y-2">
                <Label htmlFor="options" className="text-sm font-medium text-slate-700">Opsi (satu per baris)</Label>
                <Textarea
                  id="options"
                  value={(activeComponent.props.options || []).join('\n')}
                  onChange={(e) => handleChange('options', e.target.value.split('\n').filter(Boolean))}
                  placeholder="Opsi 1\nOpsi 2\nOpsi 3"
                  rows={4}
                  className="bg-white border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-lg resize-none"
                />
              </div>
            </div>
          )}

          {/* Appearance Properties */}
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4">
            <h4 className="text-sm font-cal font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Tampilan
            </h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="className" className="text-sm font-medium text-slate-700">CSS Class</Label>
                <Input
                  id="className"
                  value={activeComponent.props.className || ''}
                  onChange={(e) => handleChange('className', e.target.value)}
                  placeholder="Masukkan CSS classes"
                  className="bg-white border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                <div>
                  <Label htmlFor="hidden" className="text-sm font-medium text-slate-700">Field Tersembunyi</Label>
                  <p className="text-xs text-slate-500">Field tidak akan terlihat di form</p>
                </div>
                <Switch
                  id="hidden"
                  checked={activeComponent.props.hidden || false}
                  onCheckedChange={(checked) => handleChange('hidden', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                <div>
                  <Label htmlFor="disabled" className="text-sm font-medium text-slate-700">Nonaktif</Label>
                  <p className="text-xs text-slate-500">Field tidak dapat diisi</p>
                </div>
                <Switch
                  id="disabled"
                  checked={activeComponent.props.disabled || false}
                  onCheckedChange={(checked) => handleChange('disabled', checked)}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}