'use client';

import { useState, useEffect, useCallback } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (search: string) => void;
  debounceMs?: number;
}

export default function SearchBar({ 
  placeholder = 'Search...', 
  onSearch,
  debounceMs = 300 
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      onSearch(term);
    }, debounceMs),
    [onSearch, debounceMs]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  return (
    <div className="form-control">
      <div className="input-group">
        <input
          type="text"
          placeholder={placeholder}
          className="input input-bordered w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-square">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}