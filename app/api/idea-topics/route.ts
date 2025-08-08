import { NextRequest, NextResponse } from 'next/server';
import { IdeaTopicsService } from '@/lib/services/ideaTopics.service';
import { createIdeaTopicSchema } from '@/lib/validations/ideaTopic.schema';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || undefined;
    
    const topics = await IdeaTopicsService.findAll(search);
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
    const body = await request.json();
    const validatedData = createIdeaTopicSchema.parse(body);
    
    const topic = await IdeaTopicsService.create(validatedData);
    return NextResponse.json(topic, { status: 201 });
  } catch (error: any) {
    console.error('Error creating idea topic:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create idea topic' },
      { status: 500 }
    );
  }
}