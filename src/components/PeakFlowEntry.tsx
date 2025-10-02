import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Activity, Plus, Trash2 } from 'lucide-react';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';

interface PeakFlowEntryProps {
  onSubmit: (value: number) => void;
  onDelete: (entryId: string) => void;
  todaysEntries: Array<{ id: string; value: number; time: string }>;
  threshold: number;
}

export function PeakFlowEntry({ onSubmit, onDelete, todaysEntries, threshold }: PeakFlowEntryProps) {
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<{ id: string; value: number; time: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseInt(value);
    
    if (!numValue || numValue <= 0) return;
    
    setIsSubmitting(true);
    onSubmit(numValue);
    setValue('');
    
    // Reset submitting state after animation
    setTimeout(() => setIsSubmitting(false), 500);
  };

  const latestReading = todaysEntries[0];
  const hasReadingsToday = todaysEntries.length > 0;

  const handleDeleteClick = (entry: { id: string; value: number; time: string }) => {
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (entryToDelete) {
      onDelete(entryToDelete.id);
      setEntryToDelete(null);
    }
  };

  return (
    <Card className="bg-card shadow-soft">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <Activity className="h-6 w-6 text-primary" />
          Today's Peak Flow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasReadingsToday && (
          <div className="p-4 bg-secondary/30 rounded-lg mb-4">
            <h3 className="font-medium mb-3">Today's Readings ({todaysEntries.length})</h3>
            <div className="grid gap-2">
              {todaysEntries.slice(0, 3).map((entry, index) => (
                <div key={entry.id} className="flex justify-between items-center text-sm p-2 bg-background rounded border">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">
                      {entry.time ? new Date(entry.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'}
                    </span>
                    <span className={`font-medium ${entry.value < threshold ? 'text-danger' : 'text-success'}`}>
                      {entry.value} L/min
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(entry)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {todaysEntries.length > 3 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{todaysEntries.length - 3} more readings
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="peakflow" className="text-base font-medium">
              {hasReadingsToday ? 'Add Another Reading' : 'Enter Today\'s First Reading'}
            </Label>
            <Input
              id="peakflow"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                // Allow backspace, delete, tab, escape, enter, home, end, arrow keys
                if ([8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40].includes(e.keyCode) ||
                    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                    (e.keyCode === 65 && e.ctrlKey) ||
                    (e.keyCode === 67 && e.ctrlKey) ||
                    (e.keyCode === 86 && e.ctrlKey) ||
                    (e.keyCode === 88 && e.ctrlKey)) {
                  return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                  e.preventDefault();
                }
              }}
              onInput={(e) => {
                // Additional filter to remove any non-numeric characters
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9]/g, '');
              }}
              placeholder="e.g. 350"
              className="text-center text-lg h-12"
              min="1"
              max="999"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-12"
            disabled={!value || isSubmitting}
            variant="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Adding...' : 'Add Reading'}
          </Button>
        </form>

        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          entryValue={entryToDelete?.value || 0}
          entryTime={entryToDelete?.time || ''}
        />
      </CardContent>
    </Card>
  );
}