import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Seeding database...");

  // ✅ Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      role: "admin",
      name: "Admin User",
    },
  });

  const attendantUser = await prisma.user.create({
    data: {
      email: "attendant@example.com",
      role: "user",
      name: "Fuel Attendant 1",
    },
  });

  // ✅ Create Stations
  const station = await prisma.station.create({
    data: {
      ownerId: adminUser.id,
      name: "Prime Fuel Station",
      location: "Accra, Ghana",
    },
  });

  // ✅ Create Fuel Types
  const petrol = await prisma.fuelType.create({
    data: { name: "Petrol" },
  });

  const diesel = await prisma.fuelType.create({
    data: { name: "Diesel" },
  });

  // ✅ Assign Fuel Types to Station (Many-to-Many)
  await prisma.stationFuelType.createMany({
    data: [
      { stationId: station.id, fuelTypeId: petrol.id },
      { stationId: station.id, fuelTypeId: diesel.id },
    ],
  });

  // ✅ Create Transactions
  await prisma.transaction.create({
    data: {
      stationId: station.id,
      attendantId: attendantUser.id,
      fuelTypeId: petrol.id,
      amount: 150.0,
      litersSold: 10,
      licensePlate: "GW-1234-21",
    },
  });

  await prisma.transaction.create({
    data: {
      stationId: station.id,
      attendantId: attendantUser.id,
      fuelTypeId: diesel.id,
      amount: 200.0,
      litersSold: 15,
      licensePlate: "GT-5678-23",
    },
  });

  // ✅ Create Daily Reports
  await prisma.dailyReport.create({
    data: {
      stationId: station.id,
      totalSales: 350.0,
      totalLiters: 25,
      reportDate: new Date(),
    },
  });

  console.log("✅ Seeding complete!");
}

// 🚀 Run the seed function
main()
  .catch((e) => {
    console.error("❌ Error seeding database", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
