'use client';

import { useEffect, useRef, useState } from 'react';
import CreateIdeaTopicForm from './CreateIdeaTopicForm';
import type { CreateIdeaTopicInput } from '@/lib/validations/ideaTopic.schema';
import type { IdeaTopic } from '@/lib/supabase/client';

interface CreateIdeaTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (topic: IdeaTopic) => void;
}

export default function CreateIdeaTopicModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: CreateIdeaTopicModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (isOpen) {
        dialog.showModal();
        // Focus first input when modal opens
        const firstInput = dialog.querySelector('input');
        if (firstInput) {
          (firstInput as HTMLInputElement).focus();
        }
      } else {
        dialog.close();
      }
    }
  }, [isOpen]);

  const handleSubmit = async (data: CreateIdeaTopicInput) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/idea-topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 400) {
          setError('Invalid data. Please check your inputs.');
        } else if (response.status === 409) {
          setError('A topic with this name already exists.');
        } else {
          setError(errorData.error || 'Failed to create topic. Please try again.');
        }
        return;
      }

      const newTopic = await response.json();
      onSuccess(newTopic);
      onClose();
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    // Close when clicking on backdrop (outside modal content)
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleEscKey = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'Escape' && !loading) {
      e.preventDefault();
      handleClose();
    }
  };

  return (
    <dialog 
      ref={dialogRef}
      className="modal" 
      onClick={handleBackdropClick}
      onKeyDown={handleEscKey}
      aria-labelledby="modal-title"
    >
      <div className="modal-box" role="document">
        <h2 id="modal-title" className="font-bold text-lg mb-4">
          Create New Topic
        </h2>
        
        {error && (
          <div className="alert alert-error mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="stroke-current shrink-0 h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <CreateIdeaTopicForm
          onSubmit={handleSubmit}
          onCancel={handleClose}
          loading={loading}
        />
      </div>
      
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose} disabled={loading}>close</button>
      </form>
    </dialog>
  );
}