import { NextRequest, NextResponse } from 'next/server';
import { IdeasService } from '@/lib/services/ideas.service';
import { addFeedbackSchema } from '@/lib/validations/idea.schema';
import { ZodError } from 'zod';
import { getAuthenticatedUser } from '@/lib/auth/server';

export async function POST(
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
    const validatedData = addFeedbackSchema.parse(body);
    
    const idea = await IdeasService.addFeedback(user.id, id, validatedData);
    return NextResponse.json(idea);
  } catch (error) {
    console.error('Error adding feedback:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to add feedback' },
      { status: 500 }
    );
  }
}