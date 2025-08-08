'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addFeedbackSchema, AddFeedbackInput } from '@/lib/validations/idea.schema';
import RatingComponent from './RatingComponent';

interface FeedbackFormProps {
  ideaId: string;
  onSubmit: (data: AddFeedbackInput) => Promise<void>;
  initialRating?: number;
  initialFeedback?: string | null;
}

export default function FeedbackForm({ 
  onSubmit,
  initialRating = 0,
  initialFeedback = null
}: FeedbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(initialRating);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<AddFeedbackInput>({
    resolver: zodResolver(addFeedbackSchema),
    defaultValues: {
      rating: initialRating,
      feedback: initialFeedback || ''
    }
  });

  const onFormSubmit = async (data: AddFeedbackInput) => {
    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, rating });
      reset();
      setRating(0);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setValue('rating', newRating);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Rating</span>
        </label>
        <RatingComponent
          initialRating={rating}
          onRatingChange={handleRatingChange}
          disabled={isSubmitting}
        />
        {errors.rating && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.rating.message}</span>
          </label>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Feedback</span>
        </label>
        <textarea
          {...register('feedback')}
          className="textarea textarea-bordered h-24"
          placeholder="Share your thoughts about this idea..."
          disabled={isSubmitting}
        />
        {errors.feedback && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.feedback.message}</span>
          </label>
        )}
      </div>

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="loading loading-spinner"></span>
            Submitting...
          </>
        ) : (
          'Submit Feedback'
        )}
      </button>
    </form>
  );
}