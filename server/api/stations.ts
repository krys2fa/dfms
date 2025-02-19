import { defineEventHandler, getQuery, readBody } from "h3";
import prisma from "~/server/utils/db"; // Assuming you're using Prisma for DB
import { getUserFromToken } from "~/server/utils/auth"; // Function to verify user authentication

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
        return await getStations();
      case "POST":
        const newStation = await readBody(event);
        return await addStation(newStation);
      case "PUT":
        const updatedStation = await readBody(event);
        return await updateStation(updatedStation);
      case "DELETE":
        const { id } = getQuery(event);
        return await deleteStation(Number(id));
      default:
        return { statusCode: 405, error: "Method Not Allowed." };
    }
  } catch (error) {
    console.error("API Error:", error);
    return { statusCode: 500, error: "Internal Server Error." };
  }
});

// ✅ Fetch all stations
async function getStations() {
  return await prisma.station.findMany({
    orderBy: { id: "desc" },
  });
}

// ✅ Add a new station
async function addStation(station: {
  name: string;
  location: string;
  ownerId: string;
}) {
  if (!station.name || !station.location || !station.ownerId) {
    return {
      statusCode: 400,
      error: "All fields (name, location, owner) are required.",
    };
  }

  const newStation = await prisma.station.create({
    data: {
      name: station.name,
      location: station.location,
      ownerId: station.ownerId,
    },
  });

  return { success: true, data: newStation };
}

// ✅ Update a station
async function updateStation(updatedStation: {
  id: number;
  name: string;
  location: string;
  ownerId: string;
}) {
  if (
    !updatedStation.id ||
    !updatedStation.name ||
    !updatedStation.location ||
    !updatedStation.ownerId
  ) {
    return {
      statusCode: 400,
      error: "All fields (id, name, location, owner) are required.",
    };
  }

  const updated = await prisma.station.update({
    where: { id: updatedStation.id },
    data: {
      name: updatedStation.name,
      location: updatedStation.location,
      ownerId: updatedStation.ownerId,
    },
  });

  return { success: true, data: updated };
}

// ✅ Delete a station
async function deleteStation(id: number) {
  if (!id) {
    return { statusCode: 400, error: "Station ID is required." };
  }

  await prisma.station.delete({ where: { id } });
  return { success: true, message: "Station deleted successfully." };
}
