import { supabase } from '../libraries/supabase';

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'member';
  gender?: string;
}

export const userService = {
  async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, role')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getMembers() {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, role')
      .eq('role', 'member')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async updateRole(userId: string, role: 'admin' | 'member') {
    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};