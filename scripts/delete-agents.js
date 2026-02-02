const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log("🗑️ Suppression des agents Sophie et Nathan...")
  
  const deleted = await prisma.business.deleteMany({
    where: {
      name: { in: ['Sophie', 'Nathan'] },
      isAIAgent: true
    }
  })
  
  console.log(`✅ ${deleted.count} agents supprimés`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
