import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export function AnalyticsCard() {
  const navigate = useNavigate();

  return (
    <Card 
      className="cursor-pointer hover:bg-accent transition-colors"
      onClick={() => navigate('/analytics')}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          View charts for peak flow, well-being, and medication doses over time
        </p>
      </CardContent>
    </Card>
  );
}
