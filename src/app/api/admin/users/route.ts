import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Get voting code statistics
    const totalCodes = await prisma.votingCode.count();
    const usedCodes = await prisma.votingCode.count({
      where: { isUsed: true }
    });
    const availableCodes = totalCodes - usedCodes;
    
    // Get recent voting activity
    const recentVotes = await prisma.votingCode.findMany({
      where: { isUsed: true },
      select: {
        id: true,
        code: true,
        voterName: true,
        usedAt: true,
        votes: {
          select: {
            candidate: {
              select: {
                name: true,
                party: true
              }
            }
          }
        }
      },
      orderBy: { usedAt: 'desc' },
      take: 20
    });

    return NextResponse.json({
      statistics: {
        totalCodes,
        usedCodes,
        availableCodes,
        participationRate: totalCodes > 0 ? ((usedCodes / totalCodes) * 100).toFixed(1) : '0'
      },
      recentActivity: recentVotes
    });
  } catch (error) {
    console.error('Error fetching voting statistics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

