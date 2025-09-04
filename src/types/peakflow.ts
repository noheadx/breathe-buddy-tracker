export interface PeakFlowEntry {
  id: string;
  value: number;
  date: string; // ISO date string
  timestamp: number;
}

export interface PeakFlowSettings {
  threshold: number;
  name: string;
}

export interface AverageData {
  period: number;
  average: number;
  count: number;
}