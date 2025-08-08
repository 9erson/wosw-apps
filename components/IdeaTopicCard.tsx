'use client';

import Link from 'next/link';
import { IdeaTopic } from '@/lib/supabase/client';

interface IdeaTopicCardProps {
  topic: IdeaTopic;
}

export default function IdeaTopicCard({ topic }: IdeaTopicCardProps) {
  return (
    <Link href={`/ideas/${topic.id}`}>
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
        <div className="card-body">
          <h2 className="card-title">{topic.name}</h2>
          <p className="text-base-content/70">{topic.description}</p>
          {topic.tags && topic.tags.length > 0 && (
            <div className="card-actions justify-start mt-2">
              {topic.tags.map((tag, index) => (
                <div key={index} className="badge badge-outline">{tag}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}