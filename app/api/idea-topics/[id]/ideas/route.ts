import { NextRequest, NextResponse } from 'next/server';
import { IdeasService } from '@/lib/services/ideas.service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || undefined;
    
    const ideas = await IdeasService.findByTopicId(params.id, search);
    return NextResponse.json(ideas);
  } catch (error) {
    console.error('Error fetching ideas for topic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    );
  }
}