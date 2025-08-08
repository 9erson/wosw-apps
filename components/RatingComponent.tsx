'use client';

import { useState } from 'react';

interface RatingComponentProps {
  initialRating?: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
}

export default function RatingComponent({ 
  initialRating = 0, 
  onRatingChange,
  disabled = false 
}: RatingComponentProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleRatingClick = (value: number) => {
    if (!disabled) {
      setRating(value);
      onRatingChange(value);
    }
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleRatingClick(value)}
          onMouseEnter={() => !disabled && setHoveredRating(value)}
          onMouseLeave={() => !disabled && setHoveredRating(0)}
          disabled={disabled}
          className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} transition-colors`}
        >
          <svg
            className={`w-8 h-8 ${
              value <= (hoveredRating || rating)
                ? 'text-yellow-500 fill-current'
                : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}