export interface VitalsDataPoint {
  time: string;
  temp: number;
  hr: number;
  bpSystolic: number;
  bpDiastolic: number;
  spo2: number;
  rr: number;
}

export const mockLatestVitals = {
  temp: 37.2,
  hr: 102,
  bp: '128/76',
  spo2: 92,
  rr: 24,
  time: '24 May 2026, 10:30 AM'
};

export const mockVitalsDataPoints: VitalsDataPoint[] = [
  { time: '10:30 AM\n23 May', temp: 37.0, hr: 88, bpSystolic: 120, bpDiastolic: 78, spo2: 95, rr: 20 },
  { time: '02:30 PM\n23 May', temp: 37.1, hr: 92, bpSystolic: 122, bpDiastolic: 80, spo2: 94, rr: 21 },
  { time: '06:30 PM\n23 May', temp: 37.3, hr: 98, bpSystolic: 126, bpDiastolic: 82, spo2: 93, rr: 23 },
  { time: '10:30 PM\n23 May', temp: 37.2, hr: 99, bpSystolic: 124, bpDiastolic: 80, spo2: 93, rr: 22 },
  { time: '02:30 AM\n24 May', temp: 37.1, hr: 101, bpSystolic: 125, bpDiastolic: 79, spo2: 92, rr: 23 },
  { time: '06:30 AM\n24 May', temp: 37.0, hr: 96, bpSystolic: 120, bpDiastolic: 75, spo2: 94, rr: 21 },
  { time: '10:30 AM\n24 May', temp: 37.2, hr: 102, bpSystolic: 128, bpDiastolic: 76, spo2: 92, rr: 24 }
];
