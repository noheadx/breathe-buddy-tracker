export interface PeakFlowEntry {
  id: string;
  value: number;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // ISO time string
  timestamp: number;
  condition?: string | null;
  morning_dose?: number | null;
  evening_dose?: number | null;
}

export interface PeakFlowSettings {
  threshold: number;
  default_morning_dose?: number;
  default_evening_dose?: number;
}

export interface AverageData {
  period: number | 'today';
  average: number;
  count: number;
  label: string;
  daysWithData: number;
  requiredDays: number;
  hasEnoughData: boolean;
}