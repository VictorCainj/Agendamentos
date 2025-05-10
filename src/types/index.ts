export type User = {
  id: string;
  name: string;
  email: string;
  role: 'imobiliaria' | 'provider' | 'client';
  phone?: string;
  avatar?: string;
};

export type Appointment = {
  id: string;
  providerId: string;
  clientId: string;
  serviceId: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  type: 'orçamento' | 'reparo';
  location: string;
  tenant: string;
  description: string;
  approvedValue?: number;
  rating?: number;
  feedback?: string;
};

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // em minutos
  price: number;
  providerId: string;
  category: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: Date;
} 