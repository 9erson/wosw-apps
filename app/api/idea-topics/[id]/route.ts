import { NextRequest, NextResponse } from 'next/server';
import { IdeaTopicsService } from '@/lib/services/ideaTopics.service';
import { updateIdeaTopicSchema } from '@/lib/validations/ideaTopic.schema';
import { ZodError } from 'zod';
import { getAuthenticatedUser } from '@/lib/auth/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const { user, error } = await getAuthenticatedUser();
    if (error || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const topic = await IdeaTopicsService.findById(user.id, id);
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Idea topic not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(topic);
  } catch (error) {
    console.error('Error fetching idea topic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch idea topic' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const { user, error } = await getAuthenticatedUser();
    if (error || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateIdeaTopicSchema.parse(body);
    
    const topic = await IdeaTopicsService.update(user.id, id, validatedData);
    return NextResponse.json(topic);
  } catch (error) {
    console.error('Error updating idea topic:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update idea topic' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const { user, error } = await getAuthenticatedUser();
    if (error || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await IdeaTopicsService.delete(user.id, id);
    return NextResponse.json({ message: 'Idea topic deleted successfully' });
  } catch (error) {
    console.error('Error deleting idea topic:', error);
    return NextResponse.json(
      { error: 'Failed to delete idea topic' },
      { status: 500 }
    );
  }
}