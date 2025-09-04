import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar } from 'lucide-react';
import { AverageData } from '@/types/peakflow';

interface AverageDisplayProps {
  averages: AverageData[];
  threshold: number;
}

export function AverageDisplay({ averages, threshold }: AverageDisplayProps) {
  return (
    <Card className="bg-gradient-card shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Average Readings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {averages.map((avg) => (
            <div 
              key={avg.period} 
              className="text-center p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
            >
              <div className="flex items-center justify-center gap-1 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {avg.period} days
                </span>
              </div>
              <div className={`text-2xl font-bold ${avg.average && avg.average < threshold ? 'text-danger' : 'text-success'}`}>
                {avg.count > 0 ? avg.average : '--'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {avg.count} reading{avg.count !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground text-center">
            <span className="font-medium">Threshold: {threshold} L/min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}