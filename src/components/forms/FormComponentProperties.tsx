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
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Component Selected</h3>
        <p className="text-sm text-muted-foreground">
          Select a component from the preview area to edit its properties
        </p>
      </div>
    );
  }

  const handleChange = (key: string, value: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    updateComponent(activeComponent.id, { ...activeComponent, [key]: value });
  };

  const handleDelete = () => {
    const index = components.findIndex(c => c.id === activeComponent.id);
    if (index !== -1) {
      removeComponent(index);
    }
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
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium capitalize">{activeComponent.type}</h3>
            <p className="text-sm text-muted-foreground">ID: {activeComponent.id}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/5"
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Basic Properties */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={activeComponent.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="Enter field label"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Field Name</Label>
              <Input
                id="name"
                value={activeComponent.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter field name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                value={activeComponent.placeholder || ''}
                onChange={(e) => handleChange('placeholder', e.target.value)}
                placeholder="Enter placeholder text"
              />
            </div>

            {/* Help Text */}
            <div className="space-y-2">
              <Label htmlFor="helpText">Help Text</Label>
              <Textarea
                id="helpText"
                value={activeComponent.helpText || ''}
                onChange={(e) => handleChange('helpText', e.target.value)}
                placeholder="Enter help text"
                rows={2}
              />
            </div>
          </div>

          {/* Validation Properties */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="text-sm font-medium">Validation</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="required">Required Field</Label>
              <Switch
                id="required"
                checked={activeComponent.required || false}
                onCheckedChange={(checked) => handleChange('required', checked)}
              />
            </div>

            {(activeComponent.type === 'text' || activeComponent.type === 'textarea') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="minLength">Minimum Length</Label>
                  <Input
                    id="minLength"
                    type="number"
                    value={activeComponent.minLength || ''}
                    onChange={(e) => handleChange('minLength', e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxLength">Maximum Length</Label>
                  <Input
                    id="maxLength"
                    type="number"
                    value={activeComponent.maxLength || ''}
                    onChange={(e) => handleChange('maxLength', e.target.value)}
                    placeholder="Unlimited"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pattern">Validation Pattern</Label>
                  <Select
                    value={activeComponent.pattern || ''}
                    onValueChange={(value) => handleChange('pattern', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="url">URL</SelectItem>
                      <SelectItem value="phone">Phone Number</SelectItem>
                      <SelectItem value="custom">Custom Regex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {activeComponent.type === 'number' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="min">Minimum Value</Label>
                  <Input
                    id="min"
                    type="number"
                    value={activeComponent.min || ''}
                    onChange={(e) => handleChange('min', e.target.value)}
                    placeholder="No minimum"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max">Maximum Value</Label>
                  <Input
                    id="max"
                    type="number"
                    value={activeComponent.max || ''}
                    onChange={(e) => handleChange('max', e.target.value)}
                    placeholder="No maximum"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="step">Step</Label>
                  <Input
                    id="step"
                    type="number"
                    value={activeComponent.step || ''}
                    onChange={(e) => handleChange('step', e.target.value)}
                    placeholder="1"
                  />
                </div>
              </>
            )}
          </div>

          {/* Appearance Properties */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="text-sm font-medium">Appearance</h4>
            
            <div className="space-y-2">
              <Label htmlFor="className">CSS Class</Label>
              <Input
                id="className"
                value={activeComponent.className || ''}
                onChange={(e) => handleChange('className', e.target.value)}
                placeholder="Enter CSS classes"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="hidden">Hidden Field</Label>
              <Switch
                id="hidden"
                checked={activeComponent.hidden || false}
                onCheckedChange={(checked) => handleChange('hidden', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="disabled">Disabled</Label>
              <Switch
                id="disabled"
                checked={activeComponent.disabled || false}
                onCheckedChange={(checked) => handleChange('disabled', checked)}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 