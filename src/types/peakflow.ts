export interface PeakFlowEntry {
  id: string;
  value: number;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // ISO time string
  timestamp: number;
}

export interface PeakFlowSettings {
  threshold: number;
  name: string;
}

export interface AverageData {
  period: number | 'today';
  average: number;
  count: number;
  label: string;
}