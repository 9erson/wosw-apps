import { supabase, type Idea } from '@/lib/supabase/client';
import { CreateIdeaInput, UpdateIdeaInput, AddFeedbackInput } from '@/lib/validations/idea.schema';

export class IdeasService {
  static async create(userId: string, data: CreateIdeaInput): Promise<Idea> {
    const { data: idea, error } = await supabase
      .from('Idea')
      .insert({ ...data, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return idea;
  }

  static async findAll(userId: string, search?: string): Promise<Idea[]> {
    let query = supabase
      .from('Idea')
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

  static async findByTopicId(userId: string, topicId: string, search?: string): Promise<Idea[]> {
    let query = supabase
      .from('Idea')
      .select('*')
      .eq('user_id', userId)
      .eq('ideaTopicId', topicId)
      .order('createdAt', { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async findById(userId: string, id: string): Promise<Idea | null> {
    const { data, error } = await supabase
      .from('Idea')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async update(userId: string, id: string, data: UpdateIdeaInput): Promise<Idea> {
    const { data: idea, error } = await supabase
      .from('Idea')
      .update(data)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return idea;
  }

  static async addFeedback(userId: string, id: string, feedbackData: AddFeedbackInput): Promise<Idea> {
    const { data: idea, error } = await supabase
      .from('Idea')
      .update({
        rating: feedbackData.rating,
        feedback: feedbackData.feedback,
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return idea;
  }

  static async delete(userId: string, id: string): Promise<void> {
    const { error } = await supabase
      .from('Idea')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  }

  static async searchByTags(userId: string, tags: string[]): Promise<Idea[]> {
    const { data, error } = await supabase
      .from('Idea')
      .select('*')
      .eq('user_id', userId)
      .contains('tags', tags)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}