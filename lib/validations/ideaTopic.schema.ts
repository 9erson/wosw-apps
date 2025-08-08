import { z } from 'zod';

export const createIdeaTopicSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  tags: z.array(z.string()).default([]),
});

export const updateIdeaTopicSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters').optional(),
  tags: z.array(z.string()).optional(),
});

export const ideaTopicSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateIdeaTopicInput = z.infer<typeof createIdeaTopicSchema>;
export type UpdateIdeaTopicInput = z.infer<typeof updateIdeaTopicSchema>;
export type IdeaTopic = z.infer<typeof ideaTopicSchema>;