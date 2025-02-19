import { defineEventHandler, getQuery, readBody } from "h3";
import prisma from "~/server/utils/db";
import { getUserFromToken } from "~/server/utils/auth";
export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const token = event.node.req.headers.authorization?.split(" ")[1];

  // Ensure user is authenticated
  const user = await getUserFromToken(token);
  if (!user) {
    return { statusCode: 401, error: "Unauthorized access." };
  }

  try {
    switch (method) {
      case "GET":
        return await getTankers();
      case "POST":
        const newTanker = await readBody(event);
        return await addTanker(newTanker);
      case "PUT":
        const updatedTanker = await readBody(event);
        return await updateTanker(updatedTanker);
      case "DELETE":
        const { id } = getQuery(event);
        return await deleteTanker(Number(id));
      default:
        return { statusCode: 405, error: "Method Not Allowed." };
    }
  } catch (error) {
    console.error("API Error:", error);
    return { statusCode: 500, error: "Internal Server Error." };
  }
});

// ✅ Fetch all tankers
async function getTankers() {
  return await prisma.fuelTanker.findMany({
    orderBy: { id: "desc" },
  });
}

// ✅ Add a new fuelTanker
async function addTanker(fuelTanker: {
  name: string;
  capacity: number;
  licensePlate: string;
}) {
  if (!fuelTanker.name || !fuelTanker.capacity || !fuelTanker.licensePlate) {
    return {
      statusCode: 400,
      error: "All fields (name, capacity, license plate) are required.",
    };
  }

  const newtanker = await prisma.fuelTanker.create({
    data: {
      name: fuelTanker.name,
      capacity: fuelTanker.capacity,
      licensePlate: fuelTanker.licensePlate,
    },
  });

  return { success: true, data: newtanker };
}

// ✅ Update a fuelTanker
async function updateTanker(updatedTanker: {
  id: number;
  name: string;
  capacity: number;
  licensePlate: string;
}) {
  if (
    !updatedTanker.id ||
    !updatedTanker.name ||
    !updatedTanker.capacity ||
    !updatedTanker.licensePlate
  ) {
    return {
      statusCode: 400,
      error: "All fields (id, name, capacity, license plate) are required.",
    };
  }

  const updated = await prisma.fuelTanker.update({
    where: { id: updatedTanker.id },
    data: {
      name: updatedTanker.name,
      capacity: updatedTanker.capacity,
      licensePlate: updatedTanker.licensePlate,
    },
  });

  return { success: true, data: updated };
}

// ✅ Delete a fuelTanker
async function deleteTanker(id: number) {
  if (!id) {
    return { statusCode: 400, error: "Tanker ID is required." };
  }

  await prisma.fuelTanker.delete({ where: { id } });
  return { success: true, message: "Tanker deleted successfully." };
}
