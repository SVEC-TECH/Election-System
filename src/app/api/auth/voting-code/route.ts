import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { code, voterName } = await request.json();

    if (!code || !voterName) {
      return NextResponse.json(
        { message: 'Voting code and name are required' },
        { status: 400 }
      );
    }

    // Find the voting code
    const votingCode = await prisma.votingCode.findUnique({
      where: { code: code.toUpperCase() },
      include: { votes: true }
    });

    if (!votingCode) {
      return NextResponse.json(
        { message: 'Invalid voting code' },
        { status: 401 }
      );
    }

    if (votingCode.isUsed) {
      return NextResponse.json(
        { message: 'This voting code has already been used' },
        { status: 401 }
      );
    }

    // Update the voting code with voter name (but don't mark as used yet)
    await prisma.votingCode.update({
      where: { id: votingCode.id },
      data: { voterName: voterName.trim() }
    });

    return NextResponse.json({
      success: true,
      votingCodeId: votingCode.id,
      voterName: voterName.trim(),
      message: 'Authentication successful'
    });

  } catch (error) {
    console.error('Voting code authentication error:', error);
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 500 }
    );
  }
}

