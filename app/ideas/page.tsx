'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import IdeaTopicCard from '@/components/IdeaTopicCard';
import CreateIdeaTopicModal from '@/components/CreateIdeaTopicModal';
import { IdeaTopic } from '@/lib/supabase/client';

export default function IdeasPage() {
  const [topics, setTopics] = useState<IdeaTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchTopics = useCallback(async (search?: string) => {
    try {
      setLoading(true);
      const url = search 
        ? `/api/idea-topics?search=${encodeURIComponent(search)}`
        : '/api/idea-topics';
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch topics');
      
      const data = await response.json();
      setTopics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const handleSearch = useCallback((search: string) => {
    fetchTopics(search);
  }, [fetchTopics]);

  const handleTopicCreated = useCallback((newTopic: IdeaTopic) => {
    // Add the new topic to the list (optimistic update)
    setTopics(prev => [newTopic, ...prev]);
    setShowCreateModal(false);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Idea Topics</h1>
          <p className="text-base-content/70 mt-2">Explore and discover creative ideas</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            Create Topic
          </button>
          <Link href="/" className="btn btn-ghost">
            Back to Home
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <SearchBar 
          placeholder="Search topics..." 
          onSearch={handleSearch}
        />
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && topics.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-base-content/70">No topics found</p>
          <p className="text-sm text-base-content/50 mt-2">Try adjusting your search or create a new topic</p>
        </div>
      )}

      {!loading && !error && topics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <IdeaTopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}

      <CreateIdeaTopicModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleTopicCreated}
      />
    </>
  );
}