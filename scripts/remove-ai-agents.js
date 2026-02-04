/**
 * Script to remove AI agents from the database
 * Run: node scripts/remove-ai-agents.js
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Removing AI agents from database...\n')
  
  // Find all AI agents
  const aiAgents = await prisma.business.findMany({
    where: { isAIAgent: true },
    select: { id: true, name: true }
  })
  
  console.log(`Found ${aiAgents.length} AI agents to remove:\n`)
  aiAgents.forEach(agent => console.log(`  - ${agent.name} (${agent.id})`))
  
  if (aiAgents.length === 0) {
    console.log('\n✅ No AI agents found. Database is clean.')
    return
  }
  
  // Delete AI conversations first (if they exist)
  try {
    const deletedConversations = await prisma.aIConversation.deleteMany({
      where: { agentId: { in: aiAgents.map(a => a.id) } }
    })
    console.log(`\nDeleted ${deletedConversations.count} AI conversations`)
  } catch (e) {
    console.log('\nNo AI conversations table found (already removed)')
  }
  
  // Delete the AI agent businesses
  const deleted = await prisma.business.deleteMany({
    where: { isAIAgent: true }
  })
  
  console.log(`\n✅ Deleted ${deleted.count} AI agents from the database`)
  
  // Also delete the AI system user if exists
  try {
    await prisma.user.delete({
      where: { email: 'ai-system@fivezone.io' }
    })
    console.log('✅ Deleted AI system user')
  } catch (e) {
    console.log('No AI system user found')
  }
  
  console.log('\n🎉 Database cleaned successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
