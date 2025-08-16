import { supabase } from '../libraries/supabase';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  project_id: string;
  created_by: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  assigned_user?: { name: string } | null;
  created_user?: { name: string } | null;
}

export const taskService = {
  async getByProject(projectId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_user:users!tasks_assigned_to_fkey(name),
        created_user:users!tasks_created_by_fkey(name)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'assigned_user' | 'created_user'>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: Task['status']) {
    return this.update(id, { status });
  },

  async assign(id: string, assignedTo: string) {
    return this.update(id, { assigned_to: assignedTo });
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};