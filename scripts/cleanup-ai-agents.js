const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Les 6 agents à garder
const KEEP_AGENTS = ['Léa', 'Marco', 'Alex', 'Luna', 'Hugo', 'Emma']

async function main() {
  // Lister tous les agents IA
  const allAgents = await prisma.business.findMany({
    where: { isAIAgent: true },
    select: { id: true, name: true }
  })
  
  console.log("📋 Agents IA actuels:")
  allAgents.forEach(a => console.log(`  - ${a.name}`))
  console.log(`\nTotal: ${allAgents.length} agents`)
  
  // Supprimer ceux qui ne sont pas dans la liste
  const toDelete = allAgents.filter(a => !KEEP_AGENTS.includes(a.name))
  
  if (toDelete.length > 0) {
    console.log("\n🗑️ Suppression des agents en trop:")
    toDelete.forEach(a => console.log(`  - ${a.name}`))
    
    await prisma.business.deleteMany({
      where: {
        id: { in: toDelete.map(a => a.id) }
      }
    })
    
    console.log(`\n✅ ${toDelete.length} agents supprimés`)
  } else {
    console.log("\n✅ Aucun agent à supprimer")
  }
  
  // Vérifier le résultat
  const remaining = await prisma.business.count({ where: { isAIAgent: true } })
  console.log(`\n📊 Agents IA restants: ${remaining}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
