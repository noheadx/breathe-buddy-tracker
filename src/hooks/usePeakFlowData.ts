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
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    // Remove any existing entry for today
    const filteredEntries = entries.filter(entry => entry.date !== dateString);
    
    const newEntry: PeakFlowEntry = {
      id: Date.now().toString(),
      value,
      date: dateString,
      timestamp: Date.now()
    };

    setEntries([newEntry, ...filteredEntries].sort((a, b) => b.timestamp - a.timestamp));
  };

  const getTodaysEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    return entries.find(entry => entry.date === today);
  };

  const getAverages = (): AverageData[] => {
    const periods = [5, 7, 10, 30];
    const now = new Date();

    return periods.map(period => {
      const cutoffDate = new Date(now);
      cutoffDate.setDate(cutoffDate.getDate() - period);
      
      const recentEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= cutoffDate;
      });

      const average = recentEntries.length > 0
        ? recentEntries.reduce((sum, entry) => sum + entry.value, 0) / recentEntries.length
        : 0;

      return {
        period,
        average: Math.round(average),
        count: recentEntries.length
      };
    });
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
    getTodaysEntry,
    getAverages,
    isUnderThreshold,
    getRecentEntries
  };
}