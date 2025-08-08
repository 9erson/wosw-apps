import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for database tables
export interface IdeaTopic {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Idea {
  id: string;
  name: string;
  description: string;
  tags: string[];
  rating: number;
  feedback: string | null;
  ideaTopicId: string;
  createdAt: string;
  updatedAt: string;
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