import { createClient } from '@supabase/supabase-js';
import type { User, Session } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

export type { User, Session };

// Type definitions for database tables
export interface IdeaTopic {
  id: string;
  user_id?: string; // Added for user ownership
  name: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Idea {
  id: string;
  user_id?: string; // Added for user ownership
  name: string;
  description: string;
  tags: string[];
  rating: number;
  feedback: string | null;
  ideaTopicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      IdeaTopic: {
        Row: IdeaTopic;
        Insert: Omit<IdeaTopic, 'id' | 'createdAt' | 'updatedAt'> & {
          id?: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: Partial<Omit<IdeaTopic, 'id' | 'createdAt' | 'updatedAt'>>;
      };
      Idea: {
        Row: Idea;
        Insert: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'> & {
          id?: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: Partial<Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>>;
      };
    };
  };
}