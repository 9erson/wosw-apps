import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { IdeaTopicsService } from '../ideaTopics.service';
import { supabase } from '@/lib/supabase/client';
import type { CreateIdeaTopicInput, UpdateIdeaTopicInput, IdeaTopic } from '@/lib/validations/ideaTopic.schema';

// Mock the Supabase client
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn()
  }
}));

const mockSupabase = supabase as { from: Mock };

describe('IdeaTopicsService', () => {
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockTopicId = '987fcdeb-51a2-43d7-8b9c-123456789abc';

  const mockIdeaTopic: IdeaTopic = {
    id: mockTopicId,
    name: 'Test Topic',
    description: 'A test topic for testing',
    tags: ['test', 'example'],
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new idea topic successfully', async () => {
      const createInput: CreateIdeaTopicInput = {
        name: 'New Topic',
        description: 'A new topic description',
        tags: ['tag1', 'tag2']
      };

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockIdeaTopic, error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeaTopicsService.create(mockUserId, createInput);

      expect(mockSupabase.from).toHaveBeenCalledWith('IdeaTopic');
      expect(mockQuery.insert).toHaveBeenCalledWith({
        ...createInput,
        user_id: mockUserId
      });
      expect(mockQuery.select).toHaveBeenCalled();
      expect(mockQuery.single).toHaveBeenCalled();
      expect(result).toEqual(mockIdeaTopic);
    });

    it('should throw error when creation fails', async () => {
      const createInput: CreateIdeaTopicInput = {
        name: 'New Topic',
        description: 'A new topic description',
        tags: []
      };

      const error = new Error('Database error');
      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      await expect(IdeaTopicsService.create(mockUserId, createInput)).rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    it('should return all topics for user without search', async () => {
      const mockTopics = [mockIdeaTopic];
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockTopics, error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeaTopicsService.findAll(mockUserId);

      expect(mockSupabase.from).toHaveBeenCalledWith('IdeaTopic');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', mockUserId);
      expect(mockQuery.order).toHaveBeenCalledWith('createdAt', { ascending: false });
      expect(result).toEqual(mockTopics);
    });

    it('should return filtered topics when search is provided', async () => {
      const mockTopics = [mockIdeaTopic];
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        or: vi.fn().mockResolvedValue({ data: mockTopics, error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeaTopicsService.findAll(mockUserId, 'test');

      expect(mockQuery.or).toHaveBeenCalledWith('name.ilike.%test%,description.ilike.%test%');
      expect(result).toEqual(mockTopics);
    });

    it('should return empty array when no data', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeaTopicsService.findAll(mockUserId);

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

      await expect(IdeaTopicsService.findAll(mockUserId)).rejects.toThrow('Database error');
    });
  });

  describe('findById', () => {
    it('should return topic when found', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockIdeaTopic, error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeaTopicsService.findById(mockUserId, mockTopicId);

      expect(mockSupabase.from).toHaveBeenCalledWith('IdeaTopic');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.eq).toHaveBeenCalledWith('id', mockTopicId);
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', mockUserId);
      expect(mockQuery.single).toHaveBeenCalled();
      expect(result).toEqual(mockIdeaTopic);
    });

    it('should return null when topic not found', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ 
          data: null, 
          error: { code: 'PGRST116', message: 'No rows found' } 
        })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeaTopicsService.findById(mockUserId, mockTopicId);

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

      await expect(IdeaTopicsService.findById(mockUserId, mockTopicId)).rejects.toEqual(error);
    });
  });

  describe('update', () => {
    it('should update topic successfully', async () => {
      const updateData: UpdateIdeaTopicInput = {
        name: 'Updated Topic',
        description: 'Updated description'
      };

      const updatedTopic = { ...mockIdeaTopic, ...updateData };
      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: updatedTopic, error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeaTopicsService.update(mockUserId, mockTopicId, updateData);

      expect(mockSupabase.from).toHaveBeenCalledWith('IdeaTopic');
      expect(mockQuery.update).toHaveBeenCalledWith(updateData);
      expect(mockQuery.eq).toHaveBeenCalledWith('id', mockTopicId);
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', mockUserId);
      expect(mockQuery.select).toHaveBeenCalled();
      expect(mockQuery.single).toHaveBeenCalled();
      expect(result).toEqual(updatedTopic);
    });

    it('should throw error when update fails', async () => {
      const updateData: UpdateIdeaTopicInput = {
        name: 'Updated Topic'
      };
      const error = new Error('Database error');
      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      await expect(IdeaTopicsService.update(mockUserId, mockTopicId, updateData)).rejects.toThrow('Database error');
    });
  });

  describe('delete', () => {
    it('should delete topic successfully', async () => {
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

      await IdeaTopicsService.delete(mockUserId, mockTopicId);

      expect(mockSupabase.from).toHaveBeenCalledWith('IdeaTopic');
      expect(mockQuery.delete).toHaveBeenCalled();
      expect(mockQuery.eq).toHaveBeenCalledWith('id', mockTopicId);
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

      await expect(IdeaTopicsService.delete(mockUserId, mockTopicId)).rejects.toThrow('Database error');
    });
  });

  describe('searchByTags', () => {
    it('should search topics by tags successfully', async () => {
      const tags = ['test', 'example'];
      const mockTopics = [mockIdeaTopic];
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        contains: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockTopics, error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeaTopicsService.searchByTags(mockUserId, tags);

      expect(mockSupabase.from).toHaveBeenCalledWith('IdeaTopic');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', mockUserId);
      expect(mockQuery.contains).toHaveBeenCalledWith('tags', tags);
      expect(mockQuery.order).toHaveBeenCalledWith('createdAt', { ascending: false });
      expect(result).toEqual(mockTopics);
    });

    it('should return empty array when no topics found by tags', async () => {
      const tags = ['nonexistent'];
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        contains: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeaTopicsService.searchByTags(mockUserId, tags);

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

      await expect(IdeaTopicsService.searchByTags(mockUserId, tags)).rejects.toThrow('Database error');
    });

    it('should handle empty tags array', async () => {
      const tags: string[] = [];
      const mockTopics = [mockIdeaTopic];
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        contains: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockTopics, error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await IdeaTopicsService.searchByTags(mockUserId, tags);

      expect(mockQuery.contains).toHaveBeenCalledWith('tags', tags);
      expect(result).toEqual(mockTopics);
    });
  });
});