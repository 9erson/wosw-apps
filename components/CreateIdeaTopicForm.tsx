'use client';

import { useState } from 'react';
import TagInput from './TagInput';
import { createIdeaTopicSchema } from '@/lib/validations/ideaTopic.schema';
import type { CreateIdeaTopicInput } from '@/lib/validations/ideaTopic.schema';
import { z } from 'zod';

interface CreateIdeaTopicFormProps {
  onSubmit: (data: CreateIdeaTopicInput) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function CreateIdeaTopicForm({ 
  onSubmit, 
  onCancel, 
  loading 
}: CreateIdeaTopicFormProps) {
  const [formData, setFormData] = useState<CreateIdeaTopicInput>({
    name: '',
    description: '',
    tags: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: keyof CreateIdeaTopicInput, value: CreateIdeaTopicInput[keyof CreateIdeaTopicInput]) => {
    try {
      const partialSchema = createIdeaTopicSchema.pick({ [field]: true });
      partialSchema.parse({ [field]: value });
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [field]: error.issues[0].message
        }));
      }
      return false;
    }
  };

  const handleInputChange = (field: keyof CreateIdeaTopicInput, value: CreateIdeaTopicInput[keyof CreateIdeaTopicInput]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Validate on change for better UX
    if (errors[field]) {
      validateField(field, value);
    }
  };

  const handleInputBlur = (field: keyof CreateIdeaTopicInput) => {
    validateField(field, formData[field]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    try {
      const validatedData = createIdeaTopicSchema.parse(formData);
      await onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0].toString()] = issue.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <div className="form-control">
        <label className="label" htmlFor="topic-name">
          <span className="label-text">Topic Name*</span>
        </label>
        <input
          id="topic-name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          onBlur={() => handleInputBlur('name')}
          placeholder="Enter topic name"
          className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
          disabled={loading}
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <label className="label">
            <span id="name-error" className="label-text-alt text-error" role="alert">
              {errors.name}
            </span>
          </label>
        )}
      </div>

      {/* Description Field */}
      <div className="form-control">
        <label className="label" htmlFor="topic-description">
          <span className="label-text">Description*</span>
        </label>
        <textarea
          id="topic-description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          onBlur={() => handleInputBlur('description')}
          placeholder="Describe your topic idea"
          rows={4}
          className={`textarea textarea-bordered w-full ${errors.description ? 'textarea-error' : ''}`}
          disabled={loading}
          aria-invalid={errors.description ? 'true' : 'false'}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && (
          <label className="label">
            <span id="description-error" className="label-text-alt text-error" role="alert">
              {errors.description}
            </span>
          </label>
        )}
        <label className="label">
          <span className="label-text-alt">{formData.description.length}/500 characters</span>
        </label>
      </div>

      {/* Tags Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Tags (Optional)</span>
        </label>
        <TagInput
          tags={formData.tags}
          onChange={(tags) => handleInputChange('tags', tags)}
          placeholder="Add tags to categorize your topic"
        />
      </div>

      {/* Form Actions */}
      <div className="modal-action">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`btn btn-primary ${loading ? 'loading' : ''}`}
          disabled={loading || Object.keys(errors).length > 0}
        >
          {loading ? 'Creating...' : 'Create Topic'}
        </button>
      </div>
    </form>
  );
}