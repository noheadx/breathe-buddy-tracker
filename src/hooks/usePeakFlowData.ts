import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PeakFlowEntry, PeakFlowSettings, AverageData } from '@/types/peakflow';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_SETTINGS: PeakFlowSettings = {
  threshold: 300
};

export function usePeakFlowData(userId: string | undefined) {
  const [entries, setEntries] = useState<PeakFlowEntry[]>([]);
  const [settings, setSettings] = useState<PeakFlowSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load entries and settings from database
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        // Load entries
        const { data: entriesData, error: entriesError } = await supabase
          .from('peak_flow_entries')
          .select('*')
          .eq('user_id', userId)
          .order('timestamp', { ascending: false });

        if (entriesError) throw entriesError;
        setEntries(entriesData || []);

        // Load settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (settingsError && settingsError.code !== 'PGRST116') {
          throw settingsError;
        }

        setSettings({
          threshold: settingsData?.threshold || DEFAULT_SETTINGS.threshold
        });
      } catch (error: any) {
        toast({
          title: 'Error loading data',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, toast]);

  const addEntry = async (value: number) => {
    if (!userId) return;

    const now = new Date();
    const newEntry: any = {
      user_id: userId,
      value,
      date: now.toISOString().split('T')[0],
      time: now.toISOString(),
      timestamp: now.getTime(),
    };

    try {
      const { data, error } = await supabase
        .from('peak_flow_entries')
        .insert([newEntry])
        .select()
        .single();

      if (error) throw error;
      setEntries((prev) => [data, ...prev]);
    } catch (error: any) {
      toast({
        title: 'Error adding entry',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('peak_flow_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;
      setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
    } catch (error: any) {
      toast({
        title: 'Error deleting entry',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getTodaysEntries = () => {
    const today = new Date().toISOString().split('T')[0];
    return entries.filter(entry => entry.date === today);
  };

  const getAverages = (): AverageData[] => {
    const periods = [5, 7, 10, 30];
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Today's average
    const todaysEntries = entries.filter(entry => entry.date === today);
    const todaysAverage = todaysEntries.length > 0
      ? todaysEntries.reduce((sum, entry) => sum + entry.value, 0) / todaysEntries.length
      : 0;

    const averages: AverageData[] = [
      {
        period: 'today',
        average: Math.round(todaysAverage),
        count: todaysEntries.length,
        label: "Today"
      }
    ];

    // Historical averages
    periods.forEach(period => {
      const cutoffDate = new Date(now);
      cutoffDate.setDate(cutoffDate.getDate() - period);
      
      const recentEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= cutoffDate;
      });

      const average = recentEntries.length > 0
        ? recentEntries.reduce((sum, entry) => sum + entry.value, 0) / recentEntries.length
        : 0;

      averages.push({
        period,
        average: Math.round(average),
        count: recentEntries.length,
        label: `${period} days`
      });
    });

    return averages;
  };

  const isUnderThreshold = (value: number) => {
    return value < settings.threshold;
  };

  const getRecentEntries = (limit = 7) => {
    return entries.slice(0, limit);
  };

  const updateSettings = async (newSettings: PeakFlowSettings) => {
    if (!userId) return;

    try {
      // Update settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          threshold: newSettings.threshold,
        });

      if (settingsError) throw settingsError;

      setSettings(newSettings);
    } catch (error: any) {
      toast({
        title: 'Error updating settings',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return {
    entries,
    settings,
    loading,
    addEntry,
    deleteEntry,
    setSettings: updateSettings,
    getTodaysEntries,
    getAverages,
    isUnderThreshold,
    getRecentEntries
  };
}