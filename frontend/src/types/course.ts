export interface CourseEntry {
  id: string;
  patientId: string;
  date: string;
  note: string;
  doctorId: string;
  doctorName: string;
  vitals?: {
    hr: number;
    bp: string;
    rr: number;
    spo2: number;
    temp: string;
  };
}
