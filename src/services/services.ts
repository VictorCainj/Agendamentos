import { supabase } from '../lib/supabase';
import { Service } from '../types';

export const serviceService = {
  async getAll() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data.map(service => ({
      ...service,
      providerId: service.provider_id
    }));
  },

  async getByProvider(providerId: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('provider_id', providerId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data.map(service => ({
      ...service,
      providerId: service.provider_id
    }));
  },

  async create(service: Omit<Service, 'id'>) {
    const { data, error } = await supabase
      .from('services')
      .insert({
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        provider_id: service.providerId,
        category: service.category
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      providerId: data.provider_id
    };
  },

  async update(id: string, service: Partial<Service>) {
    const { data, error } = await supabase
      .from('services')
      .update({
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        provider_id: service.providerId,
        category: service.category
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      providerId: data.provider_id
    };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}; 