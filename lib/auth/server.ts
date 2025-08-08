import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import type { User } from '@supabase/supabase-js';

export async function getAuthenticatedUser(): Promise<{ user: User | null; error: string | null }> {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return { user: null, error: 'Authentication required' };
    }

    return { user, error: null };
  } catch (error) {
    console.error('Auth error:', error);
    return { user: null, error: 'Authentication failed' };
  }
}

export function withAuth<T extends unknown[]>(
  handler: (request: NextRequest, context: { user: User }, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T) => {
    const { user, error } = await getAuthenticatedUser();
    
    if (error || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: 401 }
      );
    }

    return handler(request, { user }, ...args);
  };
}