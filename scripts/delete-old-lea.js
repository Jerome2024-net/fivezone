const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Delete the old "Léa" with accent
  const deleted = await prisma.business.deleteMany({
    where: {
      name: 'Léa',
      isAIAgent: true
    }
  })
  console.log('Deleted old Léa:', deleted.count)
  
  // Count remaining
  const count = await prisma.business.count({
    where: { isAIAgent: true }
  })
  console.log('Total AI agents:', count)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
