import { useState, useEffect } from 'react';
import { PeakFlowEntry, PeakFlowSettings, AverageData } from '@/types/peakflow';

const STORAGE_KEYS = {
  ENTRIES: 'peakflow-entries',
  SETTINGS: 'peakflow-settings'
};

const DEFAULT_SETTINGS: PeakFlowSettings = {
  threshold: 300,
  name: ''
};

export function usePeakFlowData() {
  const [entries, setEntries] = useState<PeakFlowEntry[]>([]);
  const [settings, setSettings] = useState<PeakFlowSettings>(DEFAULT_SETTINGS);

  // Load data from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);

    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  }, [entries]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const addEntry = (value: number) => {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0];
    const timeString = now.toTimeString().split(' ')[0]; // HH:MM:SS format
    
    const newEntry: PeakFlowEntry = {
      id: Date.now().toString(),
      value,
      date: dateString,
      time: timeString,
      timestamp: Date.now()
    };

    setEntries([newEntry, ...entries].sort((a, b) => b.timestamp - a.timestamp));
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

  return {
    entries,
    settings,
    addEntry,
    setSettings,
    getTodaysEntries,
    getAverages,
    isUnderThreshold,
    getRecentEntries
  };
}