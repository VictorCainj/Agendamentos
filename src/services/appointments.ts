import { supabase } from '../lib/supabase';
import { Appointment } from '../types';

export const appointmentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;

    return data.map(appointment => ({
      id: appointment.id,
      providerId: appointment.provider_id,
      clientId: appointment.client_id,
      serviceId: appointment.service_id,
      date: new Date(appointment.date),
      status: appointment.status,
      type: appointment.type,
      location: appointment.location,
      tenant: appointment.tenant,
      description: appointment.description,
      approvedValue: appointment.approved_value
    }));
  },

  async getByDate(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .gte('date', startOfDay.toISOString())
      .lte('date', endOfDay.toISOString())
      .order('date', { ascending: true });

    if (error) throw error;

    return data.map(appointment => ({
      id: appointment.id,
      providerId: appointment.provider_id,
      clientId: appointment.client_id,
      serviceId: appointment.service_id,
      date: new Date(appointment.date),
      status: appointment.status,
      type: appointment.type,
      location: appointment.location,
      tenant: appointment.tenant,
      description: appointment.description,
      approvedValue: appointment.approved_value
    }));
  },

  async create(appointment: Omit<Appointment, 'id'>) {
    const appointmentData = {
      provider_id: appointment.providerId,
      client_id: appointment.clientId,
      service_id: appointment.serviceId,
      date: appointment.date.toISOString(),
      status: appointment.status,
      type: appointment.type,
      location: appointment.location,
      tenant: appointment.tenant,
      description: appointment.description,
      approved_value: appointment.approvedValue
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }

    return {
      id: data.id,
      providerId: data.provider_id,
      clientId: data.client_id,
      serviceId: data.service_id,
      date: new Date(data.date),
      status: data.status,
      type: data.type,
      location: data.location,
      tenant: data.tenant,
      description: data.description,
      approvedValue: data.approved_value
    };
  },

  async update(id: string, appointment: Partial<Appointment>) {
    const appointmentData: any = {};
    
    if (appointment.providerId) appointmentData.provider_id = appointment.providerId;
    if (appointment.clientId) appointmentData.client_id = appointment.clientId;
    if (appointment.serviceId) appointmentData.service_id = appointment.serviceId;
    if (appointment.date) appointmentData.date = appointment.date.toISOString();
    if (appointment.status) appointmentData.status = appointment.status;
    if (appointment.type) appointmentData.type = appointment.type;
    if (appointment.location) appointmentData.location = appointment.location;
    if (appointment.tenant) appointmentData.tenant = appointment.tenant;
    if (appointment.description) appointmentData.description = appointment.description;
    if (appointment.approvedValue !== undefined) appointmentData.approved_value = appointment.approvedValue;

    const { data, error } = await supabase
      .from('appointments')
      .update(appointmentData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar agendamento:', error);
      throw error;
    }

    return {
      id: data.id,
      providerId: data.provider_id,
      clientId: data.client_id,
      serviceId: data.service_id,
      date: new Date(data.date),
      status: data.status,
      type: data.type,
      location: data.location,
      tenant: data.tenant,
      description: data.description,
      approvedValue: data.approved_value
    };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir agendamento:', error);
      throw error;
    }
  }
}; 