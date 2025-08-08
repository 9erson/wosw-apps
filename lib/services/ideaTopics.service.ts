import { supabase, type IdeaTopic } from '@/lib/supabase/client';
import { CreateIdeaTopicInput, UpdateIdeaTopicInput } from '@/lib/validations/ideaTopic.schema';

export class IdeaTopicsService {
  static async create(data: CreateIdeaTopicInput): Promise<IdeaTopic> {
    const { data: topic, error } = await supabase
      .from('IdeaTopic')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return topic;
  }

  static async findAll(search?: string): Promise<IdeaTopic[]> {
    let query = supabase.from('IdeaTopic').select('*').order('createdAt', { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async findById(id: string): Promise<IdeaTopic | null> {
    const { data, error } = await supabase
      .from('IdeaTopic')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async update(id: string, data: UpdateIdeaTopicInput): Promise<IdeaTopic> {
    const { data: topic, error } = await supabase
      .from('IdeaTopic')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return topic;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('IdeaTopic')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async searchByTags(tags: string[]): Promise<IdeaTopic[]> {
    const { data, error } = await supabase
      .from('IdeaTopic')
      .select('*')
      .contains('tags', tags)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}