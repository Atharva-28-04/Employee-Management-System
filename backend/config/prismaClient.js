import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// Set up the V7 connection pool
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Initialize Prisma with the adapter
const prisma = new PrismaClient({ adapter });

// Modern default export so your controllers can import it perfectly!
export default prisma;