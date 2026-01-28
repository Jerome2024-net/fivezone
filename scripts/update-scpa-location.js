const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📝 Mise à jour détaillée pour SCPA D2A...');

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
          address: "02 BP 2053, Cotonou",
          city: "Cotonou",
          country: "Bénin",
          phone: "+229 0160613103",
          website: "https://scpad2a.org/"
      }
  });

  console.log(`✅ Cabinet mis à jour : ${updated.name}`);
  console.log(`📍 Adresse : ${updated.address}`);
  console.log(`📞 Contact : ${updated.phone}`);
  console.log(`🌐 Site Web : ${updated.website}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
