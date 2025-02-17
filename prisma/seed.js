import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 🔹 Hash passwords for users
  const hashedPassword = await bcrypt.hash("password123", 10);

  // ✅ Super Admin User
  const superAdmin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "SUPERADMIN",
    },
  });

  // ✅ Fuel Station Owners
  const owner1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      role: "OWNER",
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "jane@example.com",
      password: hashedPassword,
      role: "OWNER",
    },
  });

  // ✅ Fuel Stations
  const station1 = await prisma.station.create({
    data: {
      name: "Alpha Fuel Station",
      location: "Accra",
      ownerId: owner1.id,
    },
  });

  const station2 = await prisma.station.create({
    data: {
      name: "Beta Gas Station",
      location: "Kumasi",
      ownerId: owner2.id,
    },
  });

  // ✅ Fuel Pumps
  const pump1 = await prisma.fuelPump.create({
    data: {
      stationId: station1.id,
    },
  });

  const pump2 = await prisma.fuelPump.create({
    data: {
      stationId: station2.id,
    },
  });

  // ✅ Fuel Tankers
  const tanker1 = await prisma.fuelTanker.create({
    data: {
      name: "Big Tanker 1",
      capacity: 5000,
      stationId: station1.id,
    },
  });

  const tanker2 = await prisma.fuelTanker.create({
    data: {
      name: "Big Tanker 2",
      capacity: 7000,
      stationId: station2.id,
    },
  });

  // ✅ Fuel Tanker Driver
  const driver1 = await prisma.user.create({
    data: {
      name: "Michael Driver",
      email: "driver1@example.com",
      password: hashedPassword,
      role: "DRIVER",
      tankerId: tanker1.id, // Assign driver to tanker
    },
  });

  // ✅ Fuel Transfer
  const transfer1 = await prisma.fuelTransfer.create({
    data: {
      source: "Main Depot",
      destination: "Alpha Fuel Station",
      initialLiters: 5000,
      finalLiters: 4800,
      differenceLiters: 200, // 5000 - 4800
      tankerId: tanker1.id,
      driverId: driver1.id,
      stationId: station1.id,
    },
  });

  // ✅ Fuel Attendant
  const attendant1 = await prisma.user.create({
    data: {
      name: "Sarah Attendant",
      email: "attendant1@example.com",
      password: hashedPassword,
      role: "ATTENDANT",
    },
  });

  // ✅ Fuel Sale
  await prisma.fuelSale.create({
    data: {
      attendantId: attendant1.id,
      pumpId: pump1.id,
      liters: 50,
      amount: 250.0,
    },
  });

  // ✅ Receipts
  await prisma.receipt.create({
    data: {
      fileUrl: "https://example.com/receipt1.pdf",
      fileType: "receipt",
      transferId: transfer1.id,
    },
  });

  console.log("✅ Database seeding completed!");
}

// Run the seed function
main()
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
