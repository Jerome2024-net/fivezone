
import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

const getPrismaClient = () => {
    const url = process.env.DATABASE_URL;
    let datasources;

    // Automatic fix for Supabase Transaction Pooler
    if (url && url.includes('pooler.supabase.com') && !url.includes('pgbouncer=true')) {
        const patchedUrl = url.includes('?') 
            ? `${url}&pgbouncer=true` 
            : `${url}?pgbouncer=true&connection_limit=1`;
        
        datasources = {
            db: {
                url: patchedUrl
            }
        };
    }

    return new PrismaClient({
        datasources,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
}

export const prisma = global.prisma || getPrismaClient()

if (process.env.NODE_ENV !== "production") global.prisma = prisma
