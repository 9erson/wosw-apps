'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import IdeaCard from '@/components/IdeaCard';
import { IdeaTopic, Idea } from '@/lib/supabase/client';

export default function TopicDetailsPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  
  const [topic, setTopic] = useState<IdeaTopic | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopic = useCallback(async () => {
    try {
      const response = await fetch(`/api/idea-topics/${topicId}`);
      if (!response.ok) throw new Error('Failed to fetch topic');
      
      const data = await response.json();
      setTopic(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [topicId]);

  const fetchIdeas = useCallback(async (search?: string) => {
    try {
      const url = search 
        ? `/api/idea-topics/${topicId}/ideas?search=${encodeURIComponent(search)}`
        : `/api/idea-topics/${topicId}/ideas`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch ideas');
      
      const data = await response.json();
      setIdeas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [topicId]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTopic(), fetchIdeas()]);
      setLoading(false);
    };
    
    loadData();
  }, [topicId, fetchTopic, fetchIdeas]);

  const handleSearch = (search: string) => {
    fetchIdeas(search);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-base-content/70">Topic not found</p>
        <Link href="/ideas" className="btn btn-primary mt-4">
          Back to Ideas
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold">{topic.name}</h1>
            <p className="text-base-content/70 mt-2">{topic.description}</p>
            {topic.tags && topic.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {topic.tags.map((tag, index) => (
                  <span key={index} className="badge badge-primary">{tag}</span>
                ))}
              </div>
            )}
          </div>
          <Link href="/ideas" className="btn btn-ghost">
            Back to Topics
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <SearchBar 
          placeholder="Search ideas..." 
          onSearch={handleSearch}
        />
      </div>

      {ideas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-base-content/70">No ideas found for this topic</p>
          <p className="text-sm text-base-content/50 mt-2">Be the first to share an idea!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} topicId={topicId} />
          ))}
        </div>
      )}
    </>
  );
}