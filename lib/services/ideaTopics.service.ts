import { supabase, type IdeaTopic } from '@/lib/supabase/client';
import { CreateIdeaTopicInput, UpdateIdeaTopicInput } from '@/lib/validations/ideaTopic.schema';

export class IdeaTopicsService {
  static async create(userId: string, data: CreateIdeaTopicInput): Promise<IdeaTopic> {
    const { data: topic, error } = await supabase
      .from('IdeaTopic')
      .insert({ ...data, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return topic;
  }

  static async findAll(userId: string, search?: string): Promise<IdeaTopic[]> {
    let query = supabase
      .from('IdeaTopic')
      .select('*')
      .eq('user_id', userId)
      .order('createdAt', { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async findById(userId: string, id: string): Promise<IdeaTopic | null> {
    const { data, error } = await supabase
      .from('IdeaTopic')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async update(userId: string, id: string, data: UpdateIdeaTopicInput): Promise<IdeaTopic> {
    const { data: topic, error } = await supabase
      .from('IdeaTopic')
      .update(data)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return topic;
  }

  static async delete(userId: string, id: string): Promise<void> {
    const { error } = await supabase
      .from('IdeaTopic')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  }

  static async searchByTags(userId: string, tags: string[]): Promise<IdeaTopic[]> {
    const { data, error } = await supabase
      .from('IdeaTopic')
      .select('*')
      .eq('user_id', userId)
      .contains('tags', tags)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}