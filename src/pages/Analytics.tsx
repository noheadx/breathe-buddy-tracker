import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PeakFlowEntry } from '@/types/peakflow';
import { format, subDays, isAfter } from 'date-fns';

interface AnalyticsProps {
  entries: PeakFlowEntry[];
}

type Period = '7' | '14' | '30' | '90';

export default function Analytics({ entries }: AnalyticsProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [period, setPeriod] = useState<Period>(() => {
    const paramPeriod = searchParams.get('period');
    if (paramPeriod === '7' || paramPeriod === '14' || paramPeriod === '30' || paramPeriod === '90') {
      return paramPeriod;
    }
    return '7';
  });

  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const cutoffDate = subDays(new Date(), parseInt(period));
    return isAfter(entryDate, cutoffDate);
  }).sort((a, b) => a.timestamp - b.timestamp);

  const combinedData = filteredEntries.map(entry => ({
    date: format(new Date(entry.date), 'MMM dd'),
    peakFlow: entry.value,
    wellBeing: entry.condition || 0,
    totalDose: (entry.morning_dose || 0) + (entry.evening_dose || 0),
  }));

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RotateCw className="h-4 w-4" />
            <span>Rotate device for better view</span>
          </div>

          <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="14">14 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Combined Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis 
                  yAxisId="left"
                  className="text-xs"
                  label={{ value: 'Peak Flow (L/min)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  className="text-xs"
                  domain={[0, 10]}
                  label={{ value: 'Dose / Well-being (1-10)', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'wellBeing') {
                      if (value <= 3) return [value + " - I'm sick", 'Well-being'];
                      if (value <= 7) return [value + ' - Felt better', 'Well-being'];
                      return [value + ' - Feeling good!', 'Well-being'];
                    }
                    if (name === 'peakFlow') return [value, 'Peak Flow'];
                    if (name === 'totalDose') return [value, 'Total Dose'];
                    return [value, name];
                  }}
                />
                <Legend 
                  formatter={(value) => {
                    if (value === 'peakFlow') return 'Peak Flow';
                    if (value === 'wellBeing') return 'Well-being';
                    if (value === 'totalDose') return 'Total Dose';
                    return value;
                  }}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="peakFlow" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                  name="peakFlow"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="wellBeing" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-2))' }}
                  name="wellBeing"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="totalDose" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-3))' }}
                  name="totalDose"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
