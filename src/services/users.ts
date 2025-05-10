import { supabase } from '../lib/supabase';
import { User } from '../types';

export const userService = {
  async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getByRole(role: User['role']) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  }
}; 