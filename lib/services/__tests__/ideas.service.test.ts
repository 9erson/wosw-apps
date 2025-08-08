import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { IdeasService } from '../ideas.service';
import { supabase } from '@/lib/supabase/client';
import type { CreateIdeaInput, UpdateIdeaInput, AddFeedbackInput, Idea } from '@/lib/validations/idea.schema';

// Mock the Supabase client
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn()
  }
}));

const mockSupabase = supabase as { from: Mock };

describe('IdeasService', () => {
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockTopicId = '987fcdeb-51a2-43d7-8b9c-123456789abc';
  const mockIdeaId = 'abc12345-6789-def0-1234-56789abcdef0';

  const mockIdea: Idea = {
    id: mockIdeaId,
    name: 'Test Idea',
    description: 'A test idea for testing',
    tags: ['test', 'example'],
    rating: 0,
    feedback: null,
    ideaTopicId: mockTopicId,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new idea successfully', async () => {
      const createInput: CreateIdeaInput = {
        name: 'New Idea',
        description: 'A new idea description',
        tags: ['tag1', 'tag2'],
        ideaTopicId: mockTopicId
      };

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockIdea, error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeasService.create(mockUserId, createInput);

      expect(mockSupabase.from).toHaveBeenCalledWith('Idea');
      expect(mockQuery.insert).toHaveBeenCalledWith({
        ...createInput,
        user_id: mockUserId
      });
      expect(mockQuery.select).toHaveBeenCalled();
      expect(mockQuery.single).toHaveBeenCalled();
      expect(result).toEqual(mockIdea);
    });

    it('should throw error when creation fails', async () => {
      const createInput: CreateIdeaInput = {
        name: 'New Idea',
        description: 'A new idea description',
        tags: ['tag1', 'tag2'],
        ideaTopicId: mockTopicId
      };

      const error = new Error('Database error');
      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      await expect(IdeasService.create(mockUserId, createInput)).rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    it('should return all ideas for user without search', async () => {
      const mockIdeas = [mockIdea];
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockIdeas, error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeasService.findAll(mockUserId);

      expect(mockSupabase.from).toHaveBeenCalledWith('Idea');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', mockUserId);
      expect(mockQuery.order).toHaveBeenCalledWith('createdAt', { ascending: false });
      expect(result).toEqual(mockIdeas);
    });

    it('should return filtered ideas when search is provided', async () => {
      const mockIdeas = [mockIdea];
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        or: vi.fn().mockResolvedValue({ data: mockIdeas, error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeasService.findAll(mockUserId, 'test');

      expect(mockQuery.or).toHaveBeenCalledWith('name.ilike.%test%,description.ilike.%test%');
      expect(result).toEqual(mockIdeas);
    });

    it('should return empty array when no data', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeasService.findAll(mockUserId);

      expect(result).toEqual([]);
    });

    it('should throw error when query fails', async () => {
      const error = new Error('Database error');
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      await expect(IdeasService.findAll(mockUserId)).rejects.toThrow('Database error');
    });
  });

  describe('findByTopicId', () => {
    it('should return ideas for specific topic', async () => {
      const mockIdeas = [mockIdea];
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockIdeas, error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeasService.findByTopicId(mockUserId, mockTopicId);

      expect(mockSupabase.from).toHaveBeenCalledWith('Idea');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', mockUserId);
      expect(mockQuery.eq).toHaveBeenCalledWith('ideaTopicId', mockTopicId);
      expect(mockQuery.order).toHaveBeenCalledWith('createdAt', { ascending: false });
      expect(result).toEqual(mockIdeas);
    });

    it('should return filtered ideas by topic with search', async () => {
      const mockIdeas = [mockIdea];
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        or: vi.fn().mockResolvedValue({ data: mockIdeas, error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeasService.findByTopicId(mockUserId, mockTopicId, 'search');

      expect(mockQuery.or).toHaveBeenCalledWith('name.ilike.%search%,description.ilike.%search%');
      expect(result).toEqual(mockIdeas);
    });
  });

  describe('findById', () => {
    it('should return idea when found', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockIdea, error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeasService.findById(mockUserId, mockIdeaId);

      expect(mockSupabase.from).toHaveBeenCalledWith('Idea');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.eq).toHaveBeenCalledWith('id', mockIdeaId);
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', mockUserId);
      expect(mockQuery.single).toHaveBeenCalled();
      expect(result).toEqual(mockIdea);
    });

    it('should return null when idea not found', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ 
          data: null, 
          error: { code: 'PGRST116', message: 'No rows found' } 
        })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeasService.findById(mockUserId, mockIdeaId);

      expect(result).toBeNull();
    });

    it('should throw error for other database errors', async () => {
      const error = { code: 'OTHER_ERROR', message: 'Database error' };
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      await expect(IdeasService.findById(mockUserId, mockIdeaId)).rejects.toEqual(error);
    });
  });

  describe('update', () => {
    it('should update idea successfully', async () => {
      const updateData: UpdateIdeaInput = {
        name: 'Updated Idea',
        description: 'Updated description'
      };

      const updatedIdea = { ...mockIdea, ...updateData };
      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: updatedIdea, error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeasService.update(mockUserId, mockIdeaId, updateData);

      expect(mockSupabase.from).toHaveBeenCalledWith('Idea');
      expect(mockQuery.update).toHaveBeenCalledWith(updateData);
      expect(mockQuery.eq).toHaveBeenCalledWith('id', mockIdeaId);
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', mockUserId);
      expect(mockQuery.select).toHaveBeenCalled();
      expect(mockQuery.single).toHaveBeenCalled();
      expect(result).toEqual(updatedIdea);
    });

    it('should throw error when update fails', async () => {
      const updateData: UpdateIdeaInput = {
        name: 'Updated Idea'
      };
      const error = new Error('Database error');
      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      await expect(IdeasService.update(mockUserId, mockIdeaId, updateData)).rejects.toThrow('Database error');
    });
  });

  describe('addFeedback', () => {
    it('should add feedback to idea successfully', async () => {
      const feedbackData: AddFeedbackInput = {
        rating: 4,
        feedback: 'Great idea!'
      };

      const ideaWithFeedback = { ...mockIdea, ...feedbackData };
      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: ideaWithFeedback, error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeasService.addFeedback(mockUserId, mockIdeaId, feedbackData);

      expect(mockSupabase.from).toHaveBeenCalledWith('Idea');
      expect(mockQuery.update).toHaveBeenCalledWith({
        rating: feedbackData.rating,
        feedback: feedbackData.feedback
      });
      expect(mockQuery.eq).toHaveBeenCalledWith('id', mockIdeaId);
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', mockUserId);
      expect(result).toEqual(ideaWithFeedback);
    });

    it('should throw error when adding feedback fails', async () => {
      const feedbackData: AddFeedbackInput = {
        rating: 4,
        feedback: 'Great idea!'
      };
      const error = new Error('Database error');
      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      await expect(IdeasService.addFeedback(mockUserId, mockIdeaId, feedbackData)).rejects.toThrow('Database error');
    });
  });

  describe('delete', () => {
    it('should delete idea successfully', async () => {
      const mockQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn(() => {
          // Return self for first eq call, then resolve for second eq call
          return {
            eq: vi.fn().mockResolvedValue({ error: null })
          };
        })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      await IdeasService.delete(mockUserId, mockIdeaId);

      expect(mockSupabase.from).toHaveBeenCalledWith('Idea');
      expect(mockQuery.delete).toHaveBeenCalled();
      expect(mockQuery.eq).toHaveBeenCalledWith('id', mockIdeaId);
    });

    it('should throw error when delete fails', async () => {
      const error = new Error('Database error');
      const mockQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn(() => {
          // Return self for first eq call, then resolve with error for second eq call
          return {
            eq: vi.fn().mockResolvedValue({ error })
          };
        })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      await expect(IdeasService.delete(mockUserId, mockIdeaId)).rejects.toThrow('Database error');
    });
  });

  describe('searchByTags', () => {
    it('should search ideas by tags successfully', async () => {
      const tags = ['test', 'example'];
      const mockIdeas = [mockIdea];
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        contains: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockIdeas, error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeasService.searchByTags(mockUserId, tags);

      expect(mockSupabase.from).toHaveBeenCalledWith('Idea');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', mockUserId);
      expect(mockQuery.contains).toHaveBeenCalledWith('tags', tags);
      expect(mockQuery.order).toHaveBeenCalledWith('createdAt', { ascending: false });
      expect(result).toEqual(mockIdeas);
    });

    it('should return empty array when no ideas found by tags', async () => {
      const tags = ['nonexistent'];
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        contains: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeasService.searchByTags(mockUserId, tags);

      expect(result).toEqual([]);
    });

    it('should throw error when search by tags fails', async () => {
      const tags = ['test'];
      const error = new Error('Database error');
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        contains: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      await expect(IdeasService.searchByTags(mockUserId, tags)).rejects.toThrow('Database error');
    });
  });
});