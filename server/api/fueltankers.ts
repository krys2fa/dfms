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
        console.log("🚀 ~ defineEventHandler ~ updatedTanker:", updatedTanker);
        return await updateTanker(updatedTanker);
      case "DELETE":
        const { id } = getQuery(event);
        console.log("🚀 DELETE Request - Received ID:", id);
        if (!id) {
          return {
            statusCode: 400,
            error: "Tanker ID is missing from request.",
          };
        }
        return await deleteTanker(String(id));
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
  stationId: string;
}) {
  if (
    !fuelTanker.name ||
    !fuelTanker.capacity ||
    !fuelTanker.licensePlate ||
    !fuelTanker.stationId
  ) {
    return {
      statusCode: 400,
      error:
        "All fields (name, capacity, license plate, station) are required.",
    };
  }

  const newtanker = await prisma.fuelTanker.create({
    data: {
      name: fuelTanker.name,
      capacity: Number(fuelTanker.capacity),
      licensePlate: fuelTanker.licensePlate,
      stationId: fuelTanker.stationId,
    },
  });
  console.log("🚀 ~ newtanker:", newtanker);

  return { success: true, data: newtanker };
}

// ✅ Update a fuelTanker
async function updateTanker(updatedTanker: {
  id: number;
  name: string;
  capacity: number;
  licensePlate: string;
  stationId: string;
}) {
  if (
    !updatedTanker.id ||
    !updatedTanker.name ||
    !updatedTanker.capacity ||
    !updatedTanker.licensePlate ||
    !updatedTanker.stationId
  ) {
    return {
      statusCode: 400,
      error:
        "All fields (id, name, capacity, license plate, stationId) are required.",
    };
  }

  const updated = await prisma.fuelTanker.update({
    where: { id: updatedTanker.id },
    data: {
      name: String(updatedTanker.name),
      capacity: Number(updatedTanker.capacity),
      licensePlate: String(updatedTanker.licensePlate),
      stationId: String(updatedTanker.stationId),
    },
  });
  console.log("🚀 ~ updated:", updated);

  return { success: true, data: updated };
}

// ✅ Delete a fuelTanker
async function deleteTanker(id: string) {
  if (!id) {
    return { statusCode: 400, error: "Tanker ID is required." };
  }

  await prisma.fuelTanker.delete({ where: { id } });
  return { success: true };
}
