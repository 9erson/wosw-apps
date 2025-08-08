import { NextRequest, NextResponse } from 'next/server';
import { IdeasService } from '@/lib/services/ideas.service';
import { createIdeaSchema } from '@/lib/validations/idea.schema';
import { ZodError } from 'zod';
import { getAuthenticatedUser } from '@/lib/auth/server';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { user, error } = await getAuthenticatedUser();
    if (error || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || undefined;
    
    // Pass user.id to service to filter by user
    const ideas = await IdeasService.findAll(user.id, search);
    return NextResponse.json(ideas);
  } catch (error) {
    console.error('Error fetching ideas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { user, error } = await getAuthenticatedUser();
    if (error || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createIdeaSchema.parse(body);
    
    // Pass user.id to service to associate with user
    const idea = await IdeasService.create(user.id, validatedData);
    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    console.error('Error creating idea:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create idea' },
      { status: 500 }
    );
  }
}