import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Activity, CheckCircle } from 'lucide-react';

interface PeakFlowEntryProps {
  onSubmit: (value: number) => void;
  todaysEntry?: { value: number };
  threshold: number;
}

export function PeakFlowEntry({ onSubmit, todaysEntry, threshold }: PeakFlowEntryProps) {
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

  const isUnderThreshold = todaysEntry && todaysEntry.value < threshold;

  return (
    <Card className="bg-gradient-card shadow-soft">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <Activity className="h-6 w-6 text-primary" />
          Today's Peak Flow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {todaysEntry ? (
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="text-muted-foreground">Already logged today</span>
            </div>
            <div className={`text-4xl font-bold ${isUnderThreshold ? 'text-danger' : 'text-success'}`}>
              {todaysEntry.value}
            </div>
            <p className="text-sm text-muted-foreground">
              {isUnderThreshold ? 'Below threshold' : 'Good reading!'} 
              {` (Threshold: ${threshold})`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="peakflow" className="text-base font-medium">
                Enter Peak Flow Value (L/min)
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
              {isSubmitting ? 'Saving...' : 'Log Today\'s Reading'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}