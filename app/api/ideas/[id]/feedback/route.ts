import { NextRequest, NextResponse } from 'next/server';
import { IdeasService } from '@/lib/services/ideas.service';
import { addFeedbackSchema } from '@/lib/validations/idea.schema';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = addFeedbackSchema.parse(body);
    
    const idea = await IdeasService.addFeedback(params.id, validatedData);
    return NextResponse.json(idea);
  } catch (error: any) {
    console.error('Error adding feedback:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to add feedback' },
      { status: 500 }
    );
  }
}