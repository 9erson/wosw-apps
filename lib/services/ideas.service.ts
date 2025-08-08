import { supabase, type Idea } from '@/lib/supabase/client';
import { CreateIdeaInput, UpdateIdeaInput, AddFeedbackInput } from '@/lib/validations/idea.schema';

export class IdeasService {
  static async create(data: CreateIdeaInput): Promise<Idea> {
    const { data: idea, error } = await supabase
      .from('Idea')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return idea;
  }

  static async findAll(search?: string): Promise<Idea[]> {
    let query = supabase.from('Idea').select('*').order('createdAt', { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async findByTopicId(topicId: string, search?: string): Promise<Idea[]> {
    let query = supabase
      .from('Idea')
      .select('*')
      .eq('ideaTopicId', topicId)
      .order('createdAt', { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async findById(id: string): Promise<Idea | null> {
    const { data, error } = await supabase
      .from('Idea')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async update(id: string, data: UpdateIdeaInput): Promise<Idea> {
    const { data: idea, error } = await supabase
      .from('Idea')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return idea;
  }

  static async addFeedback(id: string, feedbackData: AddFeedbackInput): Promise<Idea> {
    const { data: idea, error } = await supabase
      .from('Idea')
      .update({
        rating: feedbackData.rating,
        feedback: feedbackData.feedback,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return idea;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('Idea')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async searchByTags(tags: string[]): Promise<Idea[]> {
    const { data, error } = await supabase
      .from('Idea')
      .select('*')
      .contains('tags', tags)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}