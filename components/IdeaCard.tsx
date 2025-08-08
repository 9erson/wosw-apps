'use client';

import Link from 'next/link';
import { Idea } from '@/lib/supabase/client';

interface IdeaCardProps {
  idea: Idea;
  topicId?: string;
}

export default function IdeaCard({ idea, topicId }: IdeaCardProps) {
  const href = topicId 
    ? `/ideas/${topicId}/${idea.id}`
    : `/ideas/idea/${idea.id}`;

  return (
    <Link href={href}>
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
        <div className="card-body">
          <h2 className="card-title">{idea.name}</h2>
          <p className="text-base-content/70">{idea.description}</p>
          
          <div className="flex items-center gap-4 mt-2">
            {idea.rating > 0 && (
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm">{idea.rating}/5</span>
              </div>
            )}
            
            {idea.feedback && (
              <div className="badge badge-info badge-sm">Has Feedback</div>
            )}
          </div>

          {idea.tags && idea.tags.length > 0 && (
            <div className="card-actions justify-start mt-2">
              {idea.tags.map((tag, index) => (
                <div key={index} className="badge badge-outline badge-sm">{tag}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}