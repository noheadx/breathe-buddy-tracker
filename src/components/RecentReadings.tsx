import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, TrendingDown, TrendingUp } from 'lucide-react';
import { PeakFlowEntry } from '@/types/peakflow';
import { format } from 'date-fns';

interface RecentReadingsProps {
  entries: PeakFlowEntry[];
  threshold: number;
}

export function RecentReadings({ entries, threshold }: RecentReadingsProps) {
  if (entries.length === 0) {
    return (
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Recent Readings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No readings yet</p>
            <p className="text-sm">Start by logging your first peak flow reading!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Recent Readings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.slice(0, 10).map((entry, index) => {
            const isUnderThreshold = entry.value < threshold;
            const date = new Date(entry.date);
            const isToday = entry.date === new Date().toISOString().split('T')[0];
            
            return (
              <div 
                key={entry.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  isToday ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/30 hover:bg-secondary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-full ${isUnderThreshold ? 'bg-danger/20' : 'bg-success/20'}`}>
                    {isUnderThreshold ? (
                      <TrendingDown className="h-4 w-4 text-danger" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-success" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">
                      {isToday ? 'Today' : format(date, 'MMM dd')}
                      {entry.time && (
                        <span className="text-xs text-muted-foreground ml-2">
                          {entry.time.slice(0, 5)}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(date, 'EEEE')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${isUnderThreshold ? 'text-danger' : 'text-success'}`}>
                    {entry.value}
                  </div>
                  <div className="text-xs text-muted-foreground">L/min</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}