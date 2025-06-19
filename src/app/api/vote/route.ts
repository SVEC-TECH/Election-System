import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { candidateId, votingCodeId } = await request.json();
    
    if (!votingCodeId || !candidateId) {
      return NextResponse.json({ error: 'Voting code ID and candidate ID required' }, { status: 400 });
    }
    
    // Find the voting code
    const votingCode = await prisma.votingCode.findUnique({
      where: { id: votingCodeId },
      include: { votes: true }
    });

    if (!votingCode) {
      return NextResponse.json({ error: 'Invalid voting session' }, { status: 404 });
    }

    if (votingCode.isUsed || votingCode.votes.length > 0) {
      return NextResponse.json({ error: 'This voting code has already been used' }, { status: 400 });
    }

    // Verify candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId }
    });

    if (!candidate) {
      return NextResponse.json({ error: 'Invalid candidate' }, { status: 404 });
    }

    // Create vote and mark voting code as used
    await prisma.$transaction([
      prisma.vote.create({
        data: {
          votingCodeId: votingCode.id,
          candidateId,
        },
      }),
      prisma.votingCode.update({
        where: { id: votingCode.id },
        data: { 
          isUsed: true,
          usedAt: new Date()
        },
      }),
    ]);

    return NextResponse.json({ 
      success: true,
      message: 'Vote cast successfully',
      voterName: votingCode.voterName
    });
  } catch (error) {
    console.error('Voting error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

