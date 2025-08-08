'use client';

import { useState, KeyboardEvent } from 'react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export default function TagInput({ 
  tags, 
  onChange, 
  placeholder = "Add a tag...",
  maxTags = 10 
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = (tag: string) => {
    if (tags.length >= maxTags) {
      return;
    }
    
    if (!tags.includes(tag)) {
      onChange([...tags, tag]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(newTags);
  };

  return (
    <div className="form-control">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <div key={index} className="badge badge-primary gap-2">
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="btn btn-ghost btn-xs btn-circle"
              aria-label={`Remove tag ${tag}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length >= maxTags ? `Maximum ${maxTags} tags` : placeholder}
        className="input input-bordered w-full"
        disabled={tags.length >= maxTags}
      />
      <label className="label">
        <span className="label-text-alt">{tags.length}/{maxTags} tags</span>
        <span className="label-text-alt">Press Enter to add tag</span>
      </label>
    </div>
  );
}