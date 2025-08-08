import { z } from 'zod';

export const createIdeaSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  tags: z.array(z.string()).default([]),
  ideaTopicId: z.string().uuid('Invalid topic ID'),
});

export const updateIdeaSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters').optional(),
  tags: z.array(z.string()).optional(),
  rating: z.number().int().min(0).max(5).optional(),
  feedback: z.string().max(500, 'Feedback must be less than 500 characters').optional(),
});

export const addFeedbackSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  feedback: z.string().min(1, 'Feedback is required').max(500, 'Feedback must be less than 500 characters'),
});

export const ideaSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  rating: z.number().int(),
  feedback: z.string().nullable(),
  ideaTopicId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateIdeaInput = z.infer<typeof createIdeaSchema>;
export type UpdateIdeaInput = z.infer<typeof updateIdeaSchema>;
export type AddFeedbackInput = z.infer<typeof addFeedbackSchema>;
export type Idea = z.infer<typeof ideaSchema>;