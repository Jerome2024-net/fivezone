const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create a Test User
  const password = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@fivezone.com' },
    update: {},
    create: {
      email: 'demo@fivezone.com',
      name: 'Demo User',
      password: password,
      role: 'USER',
    },
  });
  console.log(`👤 User created/found: ${user.email}`);

  // 2. Create Categories
  const categoriesData = [
    { name: 'Restauration', slug: 'restaurant' },
    { name: 'Shopping', slug: 'shop' },
    { name: 'Services', slug: 'service' },
    { name: 'Artisans', slug: 'artisan' }
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
    });
  }
  console.log('📂 Categories upserted');

  const restaurantCat = await prisma.category.findUnique({ where: { slug: 'restaurant' } });

  // 3. Create Featured Business
  const business = await prisma.business.create({
    data: {
      name: "Le Bistrot du Port",
      description: "Une cuisine authentique avec une vue imprenable sur le port. Produits frais et locaux garantis.",
      address: "12 Quai du Port",
      city: "Marseille",
      phone: "04 91 00 00 00",
      website: "https://lebistrotduport.com",
      imageUrl: "https://images.unsplash.com/photo-1550966871-3ed3c6221741?q=80&w=800&auto=format&fit=crop",
      coverUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop", // Important for homepage
      rating: 4.8,
      reviewCount: 125,
      categoryId: restaurantCat.id,
      ownerId: user.id,
      subscriptionTier: 'PRO', // To show "Recommandé" badge
      whatsapp: "33600000000",
    }
  });

  console.log(`🏢 Business created: ${business.name} (PRO)`);

    // 4. Create Another Business (Artisan)
    const artisanCat = await prisma.category.findUnique({ where: { slug: 'artisan' } });
    await prisma.business.create({
        data: {
        name: "Plomberie Express",
        description: "Dépannage d'urgence 24/7. Fuites, débouchage, installation.",
        address: "45 Rue de la République",
        city: "Lyon",
        phone: "06 12 34 56 78",
        imageUrl: "https://images.unsplash.com/photo-1505798577917-a651a5d60181?q=80&w=800&auto=format&fit=crop",
        coverUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop",
        rating: 4.5,
        reviewCount: 42,
        categoryId: artisanCat.id,
        ownerId: user.id,
        subscriptionTier: 'FREE',
        }
    });
    console.log(`🏢 Business created: Plomberie Express (FREE)`);

  console.log('✅ Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });