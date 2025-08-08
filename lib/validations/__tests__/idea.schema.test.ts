import { describe, it, expect } from 'vitest';
import { 
  createIdeaSchema, 
  updateIdeaSchema, 
  addFeedbackSchema, 
  ideaSchema,
  type CreateIdeaInput,
  type UpdateIdeaInput,
  type AddFeedbackInput,
  type Idea
} from '../idea.schema';

describe('Idea Schema Validations', () => {
  const mockTopicId = '123e4567-e89b-12d3-a456-426614174000';

  describe('createIdeaSchema', () => {
    it('should validate valid create idea data', () => {
      const validData: CreateIdeaInput = {
        name: 'Test Idea',
        description: 'A valid test idea description',
        tags: ['test', 'example'],
        ideaTopicId: mockTopicId
      };

      const result = createIdeaSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should use empty array as default for tags', () => {
      const dataWithoutTags = {
        name: 'Test Idea',
        description: 'A valid test idea description',
        ideaTopicId: mockTopicId
      };

      const result = createIdeaSchema.safeParse(dataWithoutTags);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tags).toEqual([]);
      }
    });

    describe('name validation', () => {
      it('should reject empty name', () => {
        const invalidData = {
          name: '',
          description: 'A valid description',
          ideaTopicId: mockTopicId
        };

        const result = createIdeaSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Name is required');
        }
      });

      it('should reject name longer than 100 characters', () => {
        const longName = 'a'.repeat(101);
        const invalidData = {
          name: longName,
          description: 'A valid description',
          ideaTopicId: mockTopicId
        };

        const result = createIdeaSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Name must be less than 100 characters');
        }
      });

      it('should accept name with exactly 100 characters', () => {
        const exactLengthName = 'a'.repeat(100);
        const validData = {
          name: exactLengthName,
          description: 'A valid description',
          ideaTopicId: mockTopicId
        };

        const result = createIdeaSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('description validation', () => {
      it('should reject empty description', () => {
        const invalidData = {
          name: 'Valid Name',
          description: '',
          ideaTopicId: mockTopicId
        };

        const result = createIdeaSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Description is required');
        }
      });

      it('should reject description longer than 1000 characters', () => {
        const longDescription = 'a'.repeat(1001);
        const invalidData = {
          name: 'Valid Name',
          description: longDescription,
          ideaTopicId: mockTopicId
        };

        const result = createIdeaSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Description must be less than 1000 characters');
        }
      });

      it('should accept description with exactly 1000 characters', () => {
        const exactLengthDescription = 'a'.repeat(1000);
        const validData = {
          name: 'Valid Name',
          description: exactLengthDescription,
          ideaTopicId: mockTopicId
        };

        const result = createIdeaSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('ideaTopicId validation', () => {
      it('should reject invalid UUID format', () => {
        const invalidData = {
          name: 'Valid Name',
          description: 'Valid description',
          ideaTopicId: 'invalid-uuid'
        };

        const result = createIdeaSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Invalid topic ID');
        }
      });

      it('should accept valid UUID', () => {
        const validData = {
          name: 'Valid Name',
          description: 'Valid description',
          ideaTopicId: mockTopicId
        };

        const result = createIdeaSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('tags validation', () => {
      it('should accept array of strings', () => {
        const validData = {
          name: 'Valid Name',
          description: 'Valid description',
          tags: ['tag1', 'tag2', 'tag3'],
          ideaTopicId: mockTopicId
        };

        const result = createIdeaSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject array with non-string elements', () => {
        const invalidData = {
          name: 'Valid Name',
          description: 'Valid description',
          tags: ['tag1', 123, 'tag3'],
          ideaTopicId: mockTopicId
        };

        const result = createIdeaSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('updateIdeaSchema', () => {
    it('should validate partial update data', () => {
      const validData: UpdateIdeaInput = {
        name: 'Updated Name'
      };

      const result = updateIdeaSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should validate all optional fields', () => {
      const validData: UpdateIdeaInput = {
        name: 'Updated Name',
        description: 'Updated description',
        tags: ['new', 'tags'],
        rating: 4,
        feedback: 'Great idea!'
      };

      const result = updateIdeaSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should accept empty object', () => {
      const validData = {};

      const result = updateIdeaSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    describe('rating validation', () => {
      it('should accept valid rating range (0-5)', () => {
        for (let rating = 0; rating <= 5; rating++) {
          const validData = { rating };
          const result = updateIdeaSchema.safeParse(validData);
          expect(result.success).toBe(true);
        }
      });

      it('should reject rating below 0', () => {
        const invalidData = { rating: -1 };

        const result = updateIdeaSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should reject rating above 5', () => {
        const invalidData = { rating: 6 };

        const result = updateIdeaSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should reject non-integer rating', () => {
        const invalidData = { rating: 3.5 };

        const result = updateIdeaSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('feedback validation', () => {
      it('should accept feedback up to 500 characters', () => {
        const validFeedback = 'a'.repeat(500);
        const validData = { feedback: validFeedback };

        const result = updateIdeaSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject feedback longer than 500 characters', () => {
        const longFeedback = 'a'.repeat(501);
        const invalidData = { feedback: longFeedback };

        const result = updateIdeaSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Feedback must be less than 500 characters');
        }
      });
    });
  });

  describe('addFeedbackSchema', () => {
    it('should validate valid feedback data', () => {
      const validData: AddFeedbackInput = {
        rating: 4,
        feedback: 'This is a great idea!'
      };

      const result = addFeedbackSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    describe('rating validation', () => {
      it('should accept rating from 1 to 5', () => {
        for (let rating = 1; rating <= 5; rating++) {
          const validData = { rating, feedback: 'Good feedback' };
          const result = addFeedbackSchema.safeParse(validData);
          expect(result.success).toBe(true);
        }
      });

      it('should reject rating below 1', () => {
        const invalidData = { rating: 0, feedback: 'Good feedback' };

        const result = addFeedbackSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Rating must be at least 1');
        }
      });

      it('should reject rating above 5', () => {
        const invalidData = { rating: 6, feedback: 'Good feedback' };

        const result = addFeedbackSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Rating must be at most 5');
        }
      });

      it('should reject non-integer rating', () => {
        const invalidData = { rating: 3.5, feedback: 'Good feedback' };

        const result = addFeedbackSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('feedback validation', () => {
      it('should reject empty feedback', () => {
        const invalidData = { rating: 4, feedback: '' };

        const result = addFeedbackSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Feedback is required');
        }
      });

      it('should reject feedback longer than 500 characters', () => {
        const longFeedback = 'a'.repeat(501);
        const invalidData = { rating: 4, feedback: longFeedback };

        const result = addFeedbackSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Feedback must be less than 500 characters');
        }
      });

      it('should accept feedback with exactly 500 characters', () => {
        const exactLengthFeedback = 'a'.repeat(500);
        const validData = { rating: 4, feedback: exactLengthFeedback };

        const result = addFeedbackSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    it('should require both rating and feedback', () => {
      const incompleteData = { rating: 4 };

      const result = addFeedbackSchema.safeParse(incompleteData);
      expect(result.success).toBe(false);
    });
  });

  describe('ideaSchema', () => {
    it('should validate complete idea object', () => {
      const validIdea: Idea = {
        id: mockTopicId,
        name: 'Test Idea',
        description: 'A test idea description',
        tags: ['test', 'example'],
        rating: 4,
        feedback: 'Great idea!',
        ideaTopicId: mockTopicId,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z')
      };

      const result = ideaSchema.safeParse(validIdea);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validIdea);
      }
    });

    it('should accept null feedback', () => {
      const validIdea = {
        id: mockTopicId,
        name: 'Test Idea',
        description: 'A test idea description',
        tags: ['test'],
        rating: 0,
        feedback: null,
        ideaTopicId: mockTopicId,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z')
      };

      const result = ideaSchema.safeParse(validIdea);
      expect(result.success).toBe(true);
    });

    it('should validate required fields', () => {
      const requiredFields = ['id', 'name', 'description', 'tags', 'rating', 'ideaTopicId', 'createdAt', 'updatedAt'];
      
      requiredFields.forEach(field => {
        const incompleteIdea = {
          id: mockTopicId,
          name: 'Test Idea',
          description: 'A test idea description',
          tags: ['test'],
          rating: 4,
          feedback: null,
          ideaTopicId: mockTopicId,
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z')
        };

        // Remove the field we're testing
        delete (incompleteIdea as any)[field];

        const result = ideaSchema.safeParse(incompleteIdea);
        expect(result.success).toBe(false);
      });
    });

    describe('UUID validation', () => {
      it('should reject invalid UUID format for id', () => {
        const invalidIdea = {
          id: 'invalid-uuid',
          name: 'Test Idea',
          description: 'A test idea description',
          tags: ['test'],
          rating: 4,
          feedback: null,
          ideaTopicId: mockTopicId,
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z')
        };

        const result = ideaSchema.safeParse(invalidIdea);
        expect(result.success).toBe(false);
      });

      it('should reject invalid UUID format for ideaTopicId', () => {
        const invalidIdea = {
          id: mockTopicId,
          name: 'Test Idea',
          description: 'A test idea description',
          tags: ['test'],
          rating: 4,
          feedback: null,
          ideaTopicId: 'invalid-uuid',
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z')
        };

        const result = ideaSchema.safeParse(invalidIdea);
        expect(result.success).toBe(false);
      });
    });
  });
});