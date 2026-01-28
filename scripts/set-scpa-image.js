const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('⚖️ Mise à jour de l\'image pour SCPA D2A (Balance de Justice)...');

  const business = await prisma.business.findFirst({
      where: {
          name: "SCPA D2A"
      }
  });

  if (!business) {
      console.log('❌ Cabinet SCPA D2A non trouvé.');
      return;
  }

  // Image "Balance de la justice" (Scale of Justice)
  // Source: Unsplash https://unsplash.com/photos/scales-of-justice-close-up-vnO2k0vOaY0
  const scaleImage = "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop";

  await prisma.business.update({
      where: { id: business.id },
      data: {
          imageUrl: scaleImage,
          coverUrl: scaleImage // On met la même pour l'instant ou une version large
      }
  });

  console.log('✅ Image "Balance" appliquée avec succès pour SCPA D2A.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
