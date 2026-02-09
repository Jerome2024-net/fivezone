const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  console.log('🖼️  Updating SCPA D2A images...');

  const updated = await p.business.updateMany({
    where: { name: { contains: 'SCPA' } },
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop',
      coverUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
    }
  });

  console.log(`✅ Updated ${updated.count} business(es)`);
  
  const biz = await p.business.findFirst({
    where: { name: { contains: 'SCPA' } },
    select: { name: true, imageUrl: true, coverUrl: true }
  });
  console.log(JSON.stringify(biz, null, 2));
}

main().finally(() => p.$disconnect());
