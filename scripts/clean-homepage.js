const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning up test data...');

  const targetNames = ["Le Bistrot du Port", "Plomberie Express"];

  for (const name of targetNames) {
      const business = await prisma.business.findFirst({
          where: { name: name }
      });

      if (business) {
          console.log(`Found business: ${business.name} (${business.id})`);
          
          // Delete related data manually to avoid foreign key constraints errors
          // if Cascade is not enabled in DB
          await prisma.service.deleteMany({ where: { businessId: business.id } });
          await prisma.booking.deleteMany({ where: { businessId: business.id } });
          await prisma.review.deleteMany({ where: { businessId: business.id } });
          await prisma.media.deleteMany({ where: { businessId: business.id } });
          await prisma.promotion.deleteMany({ where: { businessId: business.id } });
          
          // Delete Business
          await prisma.business.delete({
              where: { id: business.id }
          });
          console.log(`✅ Deleted business: ${name}`);
      } else {
          console.log(`ℹ️ Business not found: ${name}`);
      }
  }

  // Option: delete test user if no businesses left
  const user = await prisma.user.findUnique({ where: { email: 'demo@fivezone.com' } });
  if (user) {
      const businessCount = await prisma.business.count({ where: { ownerId: user.id } });
      if (businessCount === 0) {
          await prisma.user.delete({ where: { id: user.id } });
          console.log('✅ Deleted test user: demo@fivezone.com');
      }
  }

  console.log('✨ Cleanup complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });