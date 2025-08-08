import { NextRequest, NextResponse } from 'next/server';
import { IdeasService } from '@/lib/services/ideas.service';
import { createIdeaSchema } from '@/lib/validations/idea.schema';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || undefined;
    
    const ideas = await IdeasService.findAll(search);
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
    const body = await request.json();
    const validatedData = createIdeaSchema.parse(body);
    
    const idea = await IdeasService.create(validatedData);
    return NextResponse.json(idea, { status: 201 });
  } catch (error: any) {
    console.error('Error creating idea:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create idea' },
      { status: 500 }
    );
  }
}