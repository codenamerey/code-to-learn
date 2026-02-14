import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  pool: Pool;
};

function createPrismaClient() {
  const pool =
    globalForPrisma.pool ||
    new Pool({
      host: "localhost",
      port: 5432,
      database: "code-to-learn",
      user: "postgres",
      password: "password",
    });
  const adapter = new PrismaPg(pool);
  return { prisma: new PrismaClient({ adapter }), pool };
}

const { prisma, pool } = globalForPrisma.prisma
  ? { prisma: globalForPrisma.prisma, pool: globalForPrisma.pool! }
  : createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export { prisma };