const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const b = await p.business.findFirst({
    where: { name: { contains: 'SCPA' } },
    select: { id: true, name: true, imageUrl: true, coverUrl: true }
  });
  console.log(JSON.stringify(b, null, 2));
}

main().finally(() => p.$disconnect());
