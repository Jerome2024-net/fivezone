const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    const businessCount = await prisma.business.count();
    console.log(`Users: ${userCount}`);
    console.log(`Businesses: ${businessCount}`);
    
    const businesses = await prisma.business.findMany({ include: { category: true } });
    console.log("First 3 businesses:", JSON.stringify(businesses.slice(0, 3), null, 2));
  } catch (e) {
    console.error("Error connecting to DB:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
