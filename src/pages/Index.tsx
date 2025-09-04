import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Activity } from 'lucide-react';
import { usePeakFlowData } from '@/hooks/usePeakFlowData';
import { PeakFlowEntry } from '@/components/PeakFlowEntry';
import { AverageDisplay } from '@/components/AverageDisplay';
import { RecentReadings } from '@/components/RecentReadings';
import { ThresholdAlert } from '@/components/ThresholdAlert';
import { SettingsDialog } from '@/components/SettingsDialog';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { toast } = useToast();
  
  const {
    entries,
    settings,
    addEntry,
    deleteEntry,
    setSettings,
    getTodaysEntries,
    getAverages,
    isUnderThreshold,
    getRecentEntries
  } = usePeakFlowData();

  const todaysEntries = getTodaysEntries();
  const averages = getAverages();
  const recentEntries = getRecentEntries();

  const handleAddEntry = (value: number) => {
    addEntry(value);
    
    if (isUnderThreshold(value)) {
      toast({
        title: "Alert: Below Threshold",
        description: `Reading of ${value} L/min is below your threshold of ${settings.threshold} L/min`,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Reading Logged",
        description: `Peak flow of ${value} L/min recorded successfully`,
        variant: "default"
      });
    }
  };

  const handleDeleteEntry = (entryId: string) => {
    deleteEntry(entryId);
    toast({
      title: "Reading Deleted",
      description: "Peak flow reading has been removed",
      variant: "default"
    });
  };

  const handleSettingsSave = (newSettings: typeof settings) => {
    setSettings(newSettings);
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated",
      variant: "default"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {settings.name ? `${settings.name}'s ` : ''}Peak Flow Tracker
              </h1>
              <p className="text-muted-foreground">Monitor your respiratory health daily</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setSettingsOpen(true)}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>

        {/* Alert if latest reading is below threshold */}
        {todaysEntries.length > 0 && isUnderThreshold(todaysEntries[0].value) && (
          <div className="mb-6">
            <ThresholdAlert
              value={todaysEntries[0].value}
              threshold={settings.threshold}
              onSettings={() => setSettingsOpen(true)}
            />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Entry Form */}
          <div>
            <PeakFlowEntry
              onSubmit={handleAddEntry}
              onDelete={handleDeleteEntry}
              todaysEntries={todaysEntries}
              threshold={settings.threshold}
            />
          </div>

          {/* Averages */}
          <div>
            <AverageDisplay
              averages={averages}
              threshold={settings.threshold}
            />
          </div>

          {/* Recent Readings */}
          <div className="lg:col-span-2">
            <RecentReadings
              entries={recentEntries}
              threshold={settings.threshold}
            />
          </div>
        </div>

        {/* Settings Dialog */}
        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          settings={settings}
          onSave={handleSettingsSave}
        />
      </div>
    </div>
  );
};

export default Index;
