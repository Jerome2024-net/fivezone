const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('⚖️ Ajout du cabinet SCPA D2A...');

  // 1. Ensure Category "Juridique" exists
  const legalCat = await prisma.category.upsert({
    where: { slug: 'juridique' },
    update: {},
    create: {
      name: 'Juridique',
      slug: 'juridique'
    },
  });
  console.log('📂 Catégorie Juridique assurée');

  // 2. Find a user to attach to (or create admin)
  // Trying to find the demo user from previous seed
  let user = await prisma.user.findUnique({
    where: { email: 'demo@fivezone.com' }
  });

  if (!user) {
      // Create if doesn't exist (fallback)
      user = await prisma.user.create({
          data: {
              email: 'admin-legal@fivezone.com',
              name: 'Admin Legal',
              password: '$2a$10$EpI/32UwxmC5.0/20349.O/20349.O/20349.O/20349.O', // Placeholder hash
              role: 'ADMIN'
          }
      });
  }

  // 3. Create the Business SCPA D2A
  const business = await prisma.business.create({
    data: {
      name: "SCPA D2A",
      description: "Société Civile Professionnelle d'Avocats. Expertise en droit des affaires, conseil juridique et contentieux. Accompagnement des entreprises et particuliers.",
      address: "Cocody, Abidjan", 
      city: "Abidjan",
      country: "Côte d'Ivoire",
      phone: "+225 27 22 00 00 00", // Exemple
      website: "https://scpad2a.com", // Exemple
      imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop", // Legal/Justice image
      coverUrl: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=1200&auto=format&fit=crop",
      rating: 5.0,
      reviewCount: 3,
      categoryId: legalCat.id,
      ownerId: user.id,
      subscriptionTier: 'PRO',
      verificationStatus: 'VERIFIED',
      siret: "CI-ABJ-2024-B-12345", // Exemple format
    }
  });

  console.log(`✅ Cabinet créé : ${business.name} (ID: ${business.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
