/**
 * Seed script to recreate businesses
 * Run: node scripts/seed-businesses.js
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...\n')

  // Create categories first
  const categories = [
    { name: 'Nettoyage', slug: 'nettoyage' },
    { name: 'Design', slug: 'design' },
    { name: 'Comptabilité', slug: 'comptabilite' },
    { name: 'Tech', slug: 'tech' },
    { name: 'Marketing', slug: 'marketing' },
    { name: 'Business', slug: 'business' },
  ]

  console.log('📁 Creating categories...')
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  // Get category IDs
  const nettoyageCat = await prisma.category.findUnique({ where: { slug: 'nettoyage' } })
  const designCat = await prisma.category.findUnique({ where: { slug: 'design' } })
  const comptaCat = await prisma.category.findUnique({ where: { slug: 'comptabilite' } })

  // Create a default user for business owners
  console.log('👤 Creating default user...')
  const defaultUser = await prisma.user.upsert({
    where: { email: 'owner@fivezone.app' },
    update: {},
    create: {
      email: 'owner@fivezone.app',
      name: 'Business Owner',
      password: 'hashed_password_placeholder',
    },
  })

  // Create businesses
  console.log('🏢 Creating businesses...\n')

  const businesses = [
    {
      name: 'SCPA D2A',
      description: 'Cabinet d\'expertise comptable spécialisé dans l\'accompagnement des entreprises. Audit, comptabilité, conseil fiscal et juridique pour TPE/PME.',
      address: '123 Avenue des Affaires',
      city: 'Abidjan',
      country: 'Côte d\'Ivoire',
      phone: '+225 07 00 00 00',
      website: 'https://scpa-d2a.ci',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
      coverUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200',
      rating: 4.8,
      reviewCount: 24,
      categoryId: comptaCat.id,
      ownerId: defaultUser.id,
      hourlyRate: 75,
      currency: 'EUR',
      skills: ['Comptabilité', 'Audit', 'Fiscalité', 'Conseil juridique', 'Gestion de paie'],
      yearsOfExperience: 15,
      available: true,
      languages: ['Français', 'Anglais'],
      subscriptionTier: 'PRO',
    },
    {
      name: 'Eden Clean',
      description: 'Services de nettoyage professionnel pour particuliers et entreprises. Nettoyage de bureaux, résidences, vitres et espaces commerciaux.',
      address: '45 Rue du Propre',
      city: 'Abidjan',
      country: 'Côte d\'Ivoire',
      phone: '+225 05 00 00 00',
      website: 'https://edenclean.ci',
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
      coverUrl: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=1200',
      rating: 4.6,
      reviewCount: 18,
      categoryId: nettoyageCat.id,
      ownerId: defaultUser.id,
      hourlyRate: 35,
      currency: 'EUR',
      skills: ['Nettoyage bureaux', 'Nettoyage résidentiel', 'Vitres', 'Désinfection', 'Entretien'],
      yearsOfExperience: 8,
      available: true,
      languages: ['Français'],
      subscriptionTier: 'FREE',
    },
    {
      name: 'Creativ Studio',
      description: 'Agence de design créatif. Identité visuelle, logo, web design, supports print et communication digitale pour startups et entreprises.',
      address: '78 Boulevard Créatif',
      city: 'Paris',
      country: 'France',
      phone: '+33 6 00 00 00 00',
      website: 'https://creativ-studio.fr',
      imageUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800',
      coverUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200',
      rating: 4.9,
      reviewCount: 32,
      categoryId: designCat.id,
      ownerId: defaultUser.id,
      hourlyRate: 85,
      currency: 'EUR',
      skills: ['Logo design', 'Identité visuelle', 'Web design', 'UI/UX', 'Print', 'Branding'],
      yearsOfExperience: 10,
      available: true,
      languages: ['Français', 'Anglais'],
      subscriptionTier: 'PRO',
    },
  ]

  for (const biz of businesses) {
    const created = await prisma.business.create({
      data: biz,
    })
    console.log(`  ✅ Created: ${created.name}`)
  }

  console.log('\n🎉 Seeding complete!')
  
  // Show summary
  const count = await prisma.business.count()
  console.log(`\n📊 Total businesses in database: ${count}`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
