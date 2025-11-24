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

  const peakFlowData = filteredEntries.map(entry => ({
    date: format(new Date(entry.date), 'MMM dd'),
    value: entry.value,
  }));

  const conditionData = filteredEntries.map(entry => ({
    date: format(new Date(entry.date), 'MMM dd'),
    condition: entry.condition === 'good' ? 3 : entry.condition === 'moderate' ? 2 : entry.condition === 'poor' ? 1 : 0,
  }));

  const doseData = filteredEntries.map(entry => ({
    date: format(new Date(entry.date), 'MMM dd'),
    morning: entry.morning_dose || 0,
    evening: entry.evening_dose || 0,
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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Peak Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={peakFlowData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Well-being</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={conditionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis 
                    domain={[0, 3]} 
                    ticks={[1, 2, 3]}
                    tickFormatter={(value) => {
                      if (value === 3) return 'Good';
                      if (value === 2) return 'Moderate';
                      if (value === 1) return 'Poor';
                      return '';
                    }}
                    className="text-xs"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                    formatter={(value: number) => {
                      if (value === 3) return ['Good', 'Condition'];
                      if (value === 2) return ['Moderate', 'Condition'];
                      if (value === 1) return ['Poor', 'Condition'];
                      return ['Unknown', 'Condition'];
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="condition" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-2))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medication Doses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={doseData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="morning" 
                    stroke="hsl(var(--chart-3))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-3))' }}
                    name="Morning"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="evening" 
                    stroke="hsl(var(--chart-4))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-4))' }}
                    name="Evening"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
