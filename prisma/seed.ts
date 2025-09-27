import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@acrux.life' },
    update: {},
    create: {
      email: 'admin@acrux.life',
      name: 'Admin User',
      hashedPassword,
      role: 'ADMIN',
      language: 'en'
    }
  })

  console.log('✅ Admin user created:', admin.email)

  // Create sample member user
  const memberPassword = await bcrypt.hash('member123', 12)

  const member = await prisma.user.upsert({
    where: { email: 'member@acrux.life' },
    update: {},
    create: {
      email: 'member@acrux.life',
      name: 'Team Member',
      hashedPassword: memberPassword,
      role: 'MEMBER',
      language: 'en'
    }
  })

  console.log('✅ Member user created:', member.email)

  // Create sample objective
  const objective = await prisma.objective.upsert({
    where: { id: 'sample-objective-1' },
    update: {},
    create: {
      id: 'sample-objective-1',
      title: 'Improve Team Productivity',
      description: 'Implement new tools and processes to boost team productivity by 25%',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      healthScore: 85,
      progress: 60,
      targetDate: new Date('2025-12-31'),
      createdBy: admin.id
    }
  })

  console.log('✅ Sample objective created:', objective.title)

  // Assign member to objective
  await prisma.objectiveAssignment.upsert({
    where: {
      objectiveId_userId: {
        objectiveId: objective.id,
        userId: member.id
      }
    },
    update: {},
    create: {
      objectiveId: objective.id,
      userId: member.id
    }
  })

  console.log('✅ Member assigned to objective')

  console.log('🎉 Database seeded successfully!')
  console.log('')
  console.log('📋 Test Accounts:')
  console.log('Admin: admin@acrux.life / admin123')
  console.log('Member: member@acrux.life / member123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })