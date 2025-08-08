import { describe, it, expect } from 'vitest';
import { 
  createIdeaTopicSchema, 
  updateIdeaTopicSchema, 
  ideaTopicSchema,
  type CreateIdeaTopicInput,
  type UpdateIdeaTopicInput,
  type IdeaTopic
} from '../ideaTopic.schema';

describe('Idea Topic Schema Validations', () => {
  const mockTopicId = '123e4567-e89b-12d3-a456-426614174000';

  describe('createIdeaTopicSchema', () => {
    it('should validate valid create idea topic data', () => {
      const validData: CreateIdeaTopicInput = {
        name: 'Test Topic',
        description: 'A valid test topic description',
        tags: ['test', 'example']
      };

      const result = createIdeaTopicSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should use empty array as default for tags', () => {
      const dataWithoutTags = {
        name: 'Test Topic',
        description: 'A valid test topic description'
      };

      const result = createIdeaTopicSchema.safeParse(dataWithoutTags);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tags).toEqual([]);
      }
    });

    describe('name validation', () => {
      it('should reject empty name', () => {
        const invalidData = {
          name: '',
          description: 'A valid description'
        };

        const result = createIdeaTopicSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Name is required');
        }
      });

      it('should reject name longer than 100 characters', () => {
        const longName = 'a'.repeat(101);
        const invalidData = {
          name: longName,
          description: 'A valid description'
        };

        const result = createIdeaTopicSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Name must be less than 100 characters');
        }
      });

      it('should accept name with exactly 100 characters', () => {
        const exactLengthName = 'a'.repeat(100);
        const validData = {
          name: exactLengthName,
          description: 'A valid description'
        };

        const result = createIdeaTopicSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should accept name with minimum 1 character', () => {
        const validData = {
          name: 'a',
          description: 'A valid description'
        };

        const result = createIdeaTopicSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('description validation', () => {
      it('should reject empty description', () => {
        const invalidData = {
          name: 'Valid Name',
          description: ''
        };

        const result = createIdeaTopicSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Description is required');
        }
      });

      it('should reject description longer than 500 characters', () => {
        const longDescription = 'a'.repeat(501);
        const invalidData = {
          name: 'Valid Name',
          description: longDescription
        };

        const result = createIdeaTopicSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Description must be less than 500 characters');
        }
      });

      it('should accept description with exactly 500 characters', () => {
        const exactLengthDescription = 'a'.repeat(500);
        const validData = {
          name: 'Valid Name',
          description: exactLengthDescription
        };

        const result = createIdeaTopicSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should accept description with minimum 1 character', () => {
        const validData = {
          name: 'Valid Name',
          description: 'a'
        };

        const result = createIdeaTopicSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('tags validation', () => {
      it('should accept array of strings', () => {
        const validData = {
          name: 'Valid Name',
          description: 'Valid description',
          tags: ['tag1', 'tag2', 'tag3']
        };

        const result = createIdeaTopicSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject array with non-string elements', () => {
        const invalidData = {
          name: 'Valid Name',
          description: 'Valid description',
          tags: ['tag1', 123, 'tag3']
        };

        const result = createIdeaTopicSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should accept empty tags array', () => {
        const validData = {
          name: 'Valid Name',
          description: 'Valid description',
          tags: []
        };

        const result = createIdeaTopicSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject non-array tags', () => {
        const invalidData = {
          name: 'Valid Name',
          description: 'Valid description',
          tags: 'not-an-array'
        };

        const result = createIdeaTopicSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    it('should require both name and description', () => {
      const incompleteData1 = {
        name: 'Valid Name'
      };
      const incompleteData2 = {
        description: 'Valid description'
      };

      const result1 = createIdeaTopicSchema.safeParse(incompleteData1);
      const result2 = createIdeaTopicSchema.safeParse(incompleteData2);

      expect(result1.success).toBe(false);
      expect(result2.success).toBe(false);
    });
  });

  describe('updateIdeaTopicSchema', () => {
    it('should validate partial update data', () => {
      const validData: UpdateIdeaTopicInput = {
        name: 'Updated Name'
      };

      const result = updateIdeaTopicSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should validate all optional fields', () => {
      const validData: UpdateIdeaTopicInput = {
        name: 'Updated Name',
        description: 'Updated description',
        tags: ['new', 'tags']
      };

      const result = updateIdeaTopicSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should accept empty object', () => {
      const validData = {};

      const result = updateIdeaTopicSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    describe('optional name validation', () => {
      it('should reject empty name when provided', () => {
        const invalidData = {
          name: ''
        };

        const result = updateIdeaTopicSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Name is required');
        }
      });

      it('should reject name longer than 100 characters when provided', () => {
        const longName = 'a'.repeat(101);
        const invalidData = {
          name: longName
        };

        const result = updateIdeaTopicSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Name must be less than 100 characters');
        }
      });

      it('should accept valid name when provided', () => {
        const validData = {
          name: 'Valid Updated Name'
        };

        const result = updateIdeaTopicSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('optional description validation', () => {
      it('should reject empty description when provided', () => {
        const invalidData = {
          description: ''
        };

        const result = updateIdeaTopicSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Description is required');
        }
      });

      it('should reject description longer than 500 characters when provided', () => {
        const longDescription = 'a'.repeat(501);
        const invalidData = {
          description: longDescription
        };

        const result = updateIdeaTopicSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Description must be less than 500 characters');
        }
      });

      it('should accept valid description when provided', () => {
        const validData = {
          description: 'Valid updated description'
        };

        const result = updateIdeaTopicSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('optional tags validation', () => {
      it('should accept array of strings when provided', () => {
        const validData = {
          tags: ['tag1', 'tag2', 'tag3']
        };

        const result = updateIdeaTopicSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject array with non-string elements when provided', () => {
        const invalidData = {
          tags: ['tag1', 123, 'tag3']
        };

        const result = updateIdeaTopicSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should accept empty tags array when provided', () => {
        const validData = {
          tags: []
        };

        const result = updateIdeaTopicSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    it('should validate combination of optional fields', () => {
      const validData = {
        name: 'Updated Topic',
        description: 'Updated description',
        tags: ['updated', 'tags']
      };

      const result = updateIdeaTopicSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });
  });

  describe('ideaTopicSchema', () => {
    it('should validate complete idea topic object', () => {
      const validIdeaTopic: IdeaTopic = {
        id: mockTopicId,
        name: 'Test Topic',
        description: 'A test topic description',
        tags: ['test', 'example'],
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z')
      };

      const result = ideaTopicSchema.safeParse(validIdeaTopic);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validIdeaTopic);
      }
    });

    it('should accept empty tags array', () => {
      const validIdeaTopic = {
        id: mockTopicId,
        name: 'Test Topic',
        description: 'A test topic description',
        tags: [],
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z')
      };

      const result = ideaTopicSchema.safeParse(validIdeaTopic);
      expect(result.success).toBe(true);
    });

    it('should validate required fields', () => {
      const requiredFields = ['id', 'name', 'description', 'tags', 'createdAt', 'updatedAt'];
      
      requiredFields.forEach(field => {
        const incompleteIdeaTopic = {
          id: mockTopicId,
          name: 'Test Topic',
          description: 'A test topic description',
          tags: ['test'],
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z')
        };

        // Remove the field we're testing
        delete (incompleteIdeaTopic as any)[field];

        const result = ideaTopicSchema.safeParse(incompleteIdeaTopic);
        expect(result.success).toBe(false);
      });
    });

    describe('UUID validation', () => {
      it('should reject invalid UUID format for id', () => {
        const invalidIdeaTopic = {
          id: 'invalid-uuid',
          name: 'Test Topic',
          description: 'A test topic description',
          tags: ['test'],
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z')
        };

        const result = ideaTopicSchema.safeParse(invalidIdeaTopic);
        expect(result.success).toBe(false);
      });

      it('should accept valid UUID format for id', () => {
        const validIdeaTopic = {
          id: mockTopicId,
          name: 'Test Topic',
          description: 'A test topic description',
          tags: ['test'],
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z')
        };

        const result = ideaTopicSchema.safeParse(validIdeaTopic);
        expect(result.success).toBe(true);
      });
    });

    describe('date validation', () => {
      it('should accept valid Date objects', () => {
        const validIdeaTopic = {
          id: mockTopicId,
          name: 'Test Topic',
          description: 'A test topic description',
          tags: ['test'],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = ideaTopicSchema.safeParse(validIdeaTopic);
        expect(result.success).toBe(true);
      });

      it('should reject invalid date values', () => {
        const invalidIdeaTopic1 = {
          id: mockTopicId,
          name: 'Test Topic',
          description: 'A test topic description',
          tags: ['test'],
          createdAt: 'not-a-date',
          updatedAt: new Date()
        };

        const invalidIdeaTopic2 = {
          id: mockTopicId,
          name: 'Test Topic',
          description: 'A test topic description',
          tags: ['test'],
          createdAt: new Date(),
          updatedAt: 'not-a-date'
        };

        const result1 = ideaTopicSchema.safeParse(invalidIdeaTopic1);
        const result2 = ideaTopicSchema.safeParse(invalidIdeaTopic2);

        expect(result1.success).toBe(false);
        expect(result2.success).toBe(false);
      });
    });

    describe('string field validation', () => {
      it('should reject non-string name', () => {
        const invalidIdeaTopic = {
          id: mockTopicId,
          name: 123,
          description: 'A test topic description',
          tags: ['test'],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = ideaTopicSchema.safeParse(invalidIdeaTopic);
        expect(result.success).toBe(false);
      });

      it('should reject non-string description', () => {
        const invalidIdeaTopic = {
          id: mockTopicId,
          name: 'Test Topic',
          description: 123,
          tags: ['test'],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = ideaTopicSchema.safeParse(invalidIdeaTopic);
        expect(result.success).toBe(false);
      });
    });

    describe('tags array validation', () => {
      it('should reject non-array tags', () => {
        const invalidIdeaTopic = {
          id: mockTopicId,
          name: 'Test Topic',
          description: 'A test topic description',
          tags: 'not-an-array',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = ideaTopicSchema.safeParse(invalidIdeaTopic);
        expect(result.success).toBe(false);
      });

      it('should reject array with non-string elements', () => {
        const invalidIdeaTopic = {
          id: mockTopicId,
          name: 'Test Topic',
          description: 'A test topic description',
          tags: ['tag1', 123, 'tag3'],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = ideaTopicSchema.safeParse(invalidIdeaTopic);
        expect(result.success).toBe(false);
      });
    });
  });
});