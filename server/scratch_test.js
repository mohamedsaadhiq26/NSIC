import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.bqalyrbxvpcmrqyamlrf:97efclz6L7zCd3E3@3.111.105.85:5432/postgres?sslmode=require',
    },
  },
});

async function test() {
  try {
    await prisma.$connect();
    console.log('Successfully connected via IPv4 3.111.105.85:5432!');
  } catch (err) {
    console.error('Error connecting via IPv4:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
