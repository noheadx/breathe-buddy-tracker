import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Activity, Plus } from 'lucide-react';

interface PeakFlowEntryProps {
  onSubmit: (value: number) => void;
  todaysEntries: Array<{ value: number; time: string }>;
  threshold: number;
}

export function PeakFlowEntry({ onSubmit, todaysEntries, threshold }: PeakFlowEntryProps) {
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <Card className="bg-gradient-card shadow-soft">
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
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    {entry.time ? entry.time.slice(0, 5) : '--:--'}
                  </span>
                  <span className={`font-medium ${entry.value < threshold ? 'text-danger' : 'text-success'}`}>
                    {entry.value} L/min
                  </span>
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
      </CardContent>
    </Card>
  );
}