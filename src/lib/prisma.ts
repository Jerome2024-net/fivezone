
import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

const getPrismaClient = () => {
    // ⚠️ HARDCODED CONNECTION STRING AS FALLBACK FOR RAILWAY ISSUES
    // This ensures connectivity even if Environment Variables fail to load.
    const FALLBACK_URL = "postgresql://postgres.klvquwlfknonzjczrljp:hY1yQ6nTuMYrCcGH@aws-1-eu-west-2.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1";
    
    let url = process.env.DATABASE_URL;
    let datasources;

    // Use Fallback if env var is missing
    if (!url || url.length < 5) {
        console.warn("⚠️ DATABASE_URL missing. Using Hardcoded Fallback.");
        url = FALLBACK_URL;
        datasources = { db: { url: FALLBACK_URL } };
    } 
    // Automatic fix for Supabase Transaction Pooler (only if using env var)
    else if (url && url.includes('pooler.supabase.com') && !url.includes('pgbouncer=true')) {
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
