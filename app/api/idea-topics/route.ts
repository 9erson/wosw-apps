import { NextRequest, NextResponse } from 'next/server';
import { IdeaTopicsService } from '@/lib/services/ideaTopics.service';
import { createIdeaTopicSchema } from '@/lib/validations/ideaTopic.schema';
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
    const topics = await IdeaTopicsService.findAll(user.id, search);
    return NextResponse.json(topics);
  } catch (error) {
    console.error('Error fetching idea topics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch idea topics' },
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
    const validatedData = createIdeaTopicSchema.parse(body);
    
    // Pass user.id to service to associate with user
    const topic = await IdeaTopicsService.create(user.id, validatedData);
    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    console.error('Error creating idea topic:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create idea topic' },
      { status: 500 }
    );
  }
}