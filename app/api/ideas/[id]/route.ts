import { NextRequest, NextResponse } from 'next/server';
import { IdeasService } from '@/lib/services/ideas.service';
import { updateIdeaSchema } from '@/lib/validations/idea.schema';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idea = await IdeasService.findById(params.id);
    
    if (!idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(idea);
  } catch (error) {
    console.error('Error fetching idea:', error);
    return NextResponse.json(
      { error: 'Failed to fetch idea' },
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
    const validatedData = updateIdeaSchema.parse(body);
    
    const idea = await IdeasService.update(params.id, validatedData);
    return NextResponse.json(idea);
  } catch (error: any) {
    console.error('Error updating idea:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update idea' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await IdeasService.delete(params.id);
    return NextResponse.json({ message: 'Idea deleted successfully' });
  } catch (error) {
    console.error('Error deleting idea:', error);
    return NextResponse.json(
      { error: 'Failed to delete idea' },
      { status: 500 }
    );
  }
}