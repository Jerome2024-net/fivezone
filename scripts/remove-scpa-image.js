const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🗑️ Suppression de l\'image pour SCPA D2A...');

  const business = await prisma.business.findFirst({
      where: {
          name: "SCPA D2A"
      }
  });

  if (!business) {
      console.log('❌ Cabinet SCPA D2A non trouvé.');
      return;
  }

  await prisma.business.update({
      where: { id: business.id },
      data: {
          imageUrl: null,
          coverUrl: null
      }
  });

  console.log('✅ Image supprimée pour SCPA D2A.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
