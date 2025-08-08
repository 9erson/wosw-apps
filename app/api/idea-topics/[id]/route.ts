import { NextRequest, NextResponse } from 'next/server';
import { IdeaTopicsService } from '@/lib/services/ideaTopics.service';
import { updateIdeaTopicSchema } from '@/lib/validations/ideaTopic.schema';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const topic = await IdeaTopicsService.findById(params.id);
    
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = updateIdeaTopicSchema.parse(body);
    
    const topic = await IdeaTopicsService.update(params.id, validatedData);
    return NextResponse.json(topic);
  } catch (error: any) {
    console.error('Error updating idea topic:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
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
  { params }: { params: { id: string } }
) {
  try {
    await IdeaTopicsService.delete(params.id);
    return NextResponse.json({ message: 'Idea topic deleted successfully' });
  } catch (error) {
    console.error('Error deleting idea topic:', error);
    return NextResponse.json(
      { error: 'Failed to delete idea topic' },
      { status: 500 }
    );
  }
}