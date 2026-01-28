const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Nettoyage des données pour SCPA D2A...');

  const business = await prisma.business.findFirst({
      where: {
          name: "SCPA D2A"
      }
  });

  if (!business) {
      console.log('❌ Cabinet non trouvé.');
      return;
  }

  // 1. Delete Reviews
  const deletedReviews = await prisma.review.deleteMany({
      where: { businessId: business.id }
  });
  console.log(`🗑️ ${deletedReviews.count} avis supprimés.`);

  // 2. Delete Media (Gallery)
  // Ensure Media model exists and is related
  try {
    const deletedMedia = await prisma.media.deleteMany({
        where: { businessId: business.id }
    });
    console.log(`🗑️ ${deletedMedia.count} images de galerie supprimées.`);
  } catch (e) {
      console.log("⚠️ Pas de modèle Media ou erreur suppression medias.");
  }

  // 3. Reset Business Fields (Images, Rating)
  const updated = await prisma.business.update({
      where: { id: business.id },
      data: {
          imageUrl: null,     // Remove profile image
          coverUrl: null,     // Remove cover image
          rating: 0,          // Reset rating
          reviewCount: 0      // Reset review count
      }
  });

  console.log(`✅ Fiche nettoyée : ${updated.name}`);
  console.log(`   - Images de profil/couverture retirées`);
  console.log(`   - Note remise à 0`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
