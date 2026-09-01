import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { PrismaClient } from "../app/generated/prisma/client";

config({ path: ".env" });
config({ path: ".env.local", override: true });

function getAdminEmail() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) {
    throw new Error("ADMIN_EMAIL is not set");
  }

  return email;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
}

async function main() {
  const email = getAdminEmail();
  const prisma = createPrismaClient();

  try {
    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        role: "ADMIN",
        isActive: true,
      },
      create: {
        email,
        role: "ADMIN",
        isActive: true,
      },
    });

    console.log(`Admin user ready: ${admin.email} (${admin.role})`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
