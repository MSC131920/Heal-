export type UserRole = 'patient' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  createdAt: number;
}

export interface Doctor {
  id: string;
  name: string;
  department: string;
  specialty: string;
  bio: string;
  image: string;
  active: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: number;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  name: string;
  fileUrl: string;
  uploadDate: number;
}
