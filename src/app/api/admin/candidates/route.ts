import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        _count: {
          select: { votes: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    const candidatesWithVotes = candidates.map(candidate => ({
      ...candidate,
      votes: candidate._count.votes,
    }));

    return NextResponse.json(candidatesWithVotes);
  } catch (error) {
    console.error('Error fetching candidates with votes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

