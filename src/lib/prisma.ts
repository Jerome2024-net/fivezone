import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// PREVENT CRASH IF DATABASE_URL IS MISSING
const prismaClientSingleton = () => {
  try {
    return new PrismaClient()
  } catch (e) {
    console.error("Failed to init Prisma (likely missing DATABASE_URL). Using dummy.", e);
    return new Proxy({}, {
        get: () => {
            return async () => { throw new Error("Database is disabled") }
        }
    }) as unknown as PrismaClient
  }
}

export const prisma = globalForPrisma.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
