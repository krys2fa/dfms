import { PrismaClient } from "@prisma/client";

// ✅ Create a single Prisma instance (Singleton Pattern)
const prisma = new PrismaClient();

export default prisma; // ✅ Correct Export
