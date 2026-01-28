const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Nettoyage du SIRET pour SCPA D2A...');

  const business = await prisma.business.findFirst({
      where: {
          name: "SCPA D2A"
      }
  });

  if (!business) {
      console.log('❌ Cabinet non trouvé.');
      return;
  }

  const updated = await prisma.business.update({
      where: { id: business.id },
      data: {
          siret: null
      }
  });

  console.log(`✅ SIRET supprimé pour : ${updated.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
