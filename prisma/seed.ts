import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Generate random voting codes
function generateVotingCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function main() {
  console.log(' Starting database seed...');

  // Create admin user (sebastiansinc@hotmail.com)
  const adminPassword = await bcrypt.hash('admin123secure', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'sebastiansinc@hotmail.com' },
    update: {},
    create: {
      email: 'sebastiansinc@hotmail.com',
      name: 'Sebastian Sinclaire',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create voting codes (100 codes for this example)
  const votingCodes = [];
  for (let i = 0; i < 100; i++) {
    let code;
    let isUnique = false;
    
    // Ensure unique codes
    while (!isUnique) {
      code = generateVotingCode();
      const existing = await prisma.votingCode.findUnique({ where: { code } });
      if (!existing) {
        isUnique = true;
      }
    }
    
    const votingCode = await prisma.votingCode.create({
      data: {
        code: code!
      }
    });
    votingCodes.push(votingCode);
  }

  // Create candidates
  const candidates = [
    {
      name: 'Alexander Roosevelt',
      party: 'Progressive Coalition',
      description: 'Champion of education reform, universal healthcare, and economic equality. Fighting for a future where every citizen has equal opportunity.',
      position: 'President'
    },
    {
      name: 'Victoria Sterling',
      party: 'Conservative Alliance',
      description: 'Advocating for fiscal responsibility, national security, and traditional values. Committed to protecting our constitutional rights.',
      position: 'President'
    },
    {
      name: 'Marcus Green',
      party: 'Environmental Party',
      description: 'Leading the fight against climate change with sustainable development and green energy initiatives for future generations.',
      position: 'President'
    },
    {
      name: 'Elena Rodriguez',
      party: 'Unity Movement',
      description: 'Building bridges across communities, focusing on immigration reform and social justice for all Americans.',
      position: 'President'
    },
  ];

  for (const candidateData of candidates) {
    const existingCandidate = await prisma.candidate.findFirst({
      where: { name: candidateData.name },
    });
    
    if (!existingCandidate) {
      await prisma.candidate.create({
        data: candidateData,
      });
    }
  }

  // Create an active election
  await prisma.election.upsert({
    where: { id: 'main-election' },
    update: {},
    create: {
      id: 'main-election',
      title: 'Company CEO Election',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      isActive: true,
    },
  });

  console.log('🎯 Database seeded successfully!');
  console.log(`👤 Admin account: sebastiansinc@hotmail.com / admin123secure`);
  console.log(`🎫 Generated ${votingCodes.length} voting codes`);
  console.log(`🗳️  Created ${candidates.length} candidates`);
  console.log('\n📋 Sample voting codes:');
  votingCodes.slice(0, 100).forEach((code, index) => {
    console.log(`   ${index + 1}. ${code.code}`);
  });
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

