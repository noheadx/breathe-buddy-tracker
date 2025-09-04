import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Settings } from 'lucide-react';

interface ThresholdAlertProps {
  value: number;
  threshold: number;
  onSettings: () => void;
}

export function ThresholdAlert({ value, threshold, onSettings }: ThresholdAlertProps) {
  if (value >= threshold) return null;

  const percentage = Math.round((value / threshold) * 100);

  return (
    <Alert className="border-danger/50 bg-danger/10">
      <AlertTriangle className="h-5 w-5 text-danger" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <div className="font-medium text-danger">
            Peak flow is below threshold
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Current: {value} L/min ({percentage}% of threshold)
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onSettings}
          className="ml-4 border-danger/30 hover:bg-danger/10"
        >
          <Settings className="h-4 w-4 mr-1" />
          Adjust
        </Button>
      </AlertDescription>
    </Alert>
  );
}