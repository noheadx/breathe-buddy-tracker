import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PeakFlowSettings } from '@/types/peakflow';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: PeakFlowSettings;
  onSave: (settings: PeakFlowSettings) => void;
  onLogout: () => void;
}

export function SettingsDialog({ open, onOpenChange, settings, onSave, onLogout }: SettingsDialogProps) {
  const [formData, setFormData] = useState(settings);

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="threshold">Threshold (L/min)</Label>
            <Input
              id="threshold"
              type="number"
              value={formData.threshold}
              onChange={(e) => setFormData({ ...formData, threshold: parseInt(e.target.value) || 0 })}
              placeholder="300"
              min="1"
              max="999"
            />
            <p className="text-sm text-muted-foreground">
              You'll get an alert when readings fall below this value
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">Default Medication Doses</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Set default doses that will pre-fill when adding new readings
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultMorningDose" className="text-sm">
                  Morning Dose
                </Label>
                <Input
                  id="defaultMorningDose"
                  type="number"
                  value={formData.default_morning_dose || 0}
                  onChange={(e) => setFormData({ ...formData, default_morning_dose: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                  max="99"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultEveningDose" className="text-sm">
                  Evening Dose
                </Label>
                <Input
                  id="defaultEveningDose"
                  type="number"
                  value={formData.default_evening_dose || 0}
                  onChange={(e) => setFormData({ ...formData, default_evening_dose: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                  max="99"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Settings
            </Button>
          </div>
          <Button variant="destructive" onClick={onLogout} className="w-full">
            Sign Out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}