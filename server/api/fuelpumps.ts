import { defineEventHandler, getQuery, readBody } from "h3";
import prisma from "~/server/utils/db";
import { getUserFromToken } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const token = event.node.req.headers.authorization?.split(" ")[1];
  const user = await getUserFromToken(token);

  if (!user) {
    return { statusCode: 401, error: "Unauthorized access." };
  }

  try {
    switch (method) {
      case "GET":
        return await getPumps();
      case "POST":
        const newPump = await readBody(event);
        return await addPump(newPump);
      case "PUT":
        const updatedPump = await readBody(event);
        return await updatePump(updatedPump);
      case "DELETE":
        const { id } = getQuery(event);
        return await deletePump(String(id));
      default:
        return { statusCode: 405, error: "Method Not Allowed." };
    }
  } catch (error) {
    console.error("API Error:", error);
    return { statusCode: 500, error: "Internal Server Error." };
  }
});

// ✅ Fetch all pumps
async function getPumps() {
  return await prisma.fuelPump.findMany({
    select: {
      id: true,
      name: true,
      stationId: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

// ✅ Add a new pump
async function addPump(pump: { name: string; stationId: string }) {
  if (!pump.name || !pump.stationId) {
    return { statusCode: 400, error: "Name and Station ID are required." };
  }

  const newPump = await prisma.fuelPump.create({
    data: {
      name: pump.name,
      stationId: pump.stationId,
    },
  });

  return { success: true, data: newPump };
}

async function updatePump(updatedPump: {
  id: string;
  name: string;
  stationId: string;
}) {
  if (!updatedPump.id || !updatedPump.name || !updatedPump.stationId) {
    return new Response(
      JSON.stringify({
        error: "All fields (id, name, stationId) are required.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const updated = await prisma.fuelPump.update({
    where: { id: updatedPump.id },
    data: {
      name: updatedPump.name,
      stationId: updatedPump.stationId,
    },
  });

  return { success: true, data: updated };
}

// ✅ Delete a pump
async function deletePump(id: string) {
  if (!id) {
    return { statusCode: 400, error: "Pump ID is required." };
  }

  await prisma.fuelPump.delete({ where: { id } });
  return { success: true, message: "Pump deleted successfully." };
}
