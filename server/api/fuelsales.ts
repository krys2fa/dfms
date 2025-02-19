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
        return await getSales();
      case "POST":
        const newSale = await readBody(event);
        return await addSale(newSale);
      case "PUT":
        const updatedSale = await readBody(event);
        return await updateSale(updatedSale);
      case "DELETE":
        const { id } = getQuery(event);
        return await deleteSale(Number(id));
      default:
        return { statusCode: 405, error: "Method Not Allowed." };
    }
  } catch (error) {
    console.error("API Error:", error);
    return { statusCode: 500, error: "Internal Server Error." };
  }
});

// ✅ Fetch all tankers
async function getSales() {
  return await prisma.fuelTanker.findMany({
    orderBy: { id: "desc" },
  });
}

// ✅ Add a new fuelTanker
async function addSale(fuelSale: {
  amount: number;
  liters: number;
  attendantId: string;
  pumpId: string;
  receipt: string;
  createdAt: datetime;
}) {
  if (
    !fuelSale.id ||
    !fuelSale.amount ||
    !fuelSale.liters ||
    !fuelSale.attendantId ||
    !fuelSale.pumpId ||
    !fuelSale.receipt ||
    !fuelSale.createdAt
  ) {
    return {
      statusCode: 400,
      error:
        "All fields (id, amount, receipt, liters, pumpId, attendantId, createdAt) are required.",
    };
  }

  const newsale = await prisma.fuelSale.create({
    data: {
      amount: fuelSale.amount,
      liters: fuelSale.liters,
      attendantId: fuelSale.attendantId,
      pumpId: fuelSale.pumpId,
      receipt: fuelSale.receipt,
      createdAt: fuelSale.createdAt,
    },
  });

  return { success: true, data: newsale };
}

async function updateSale(updatedSale: {
  id: string;
  amount: number;
  liters: number;
  attendantId: string;
  pumpId: string;
  receipt: string;
  createdAt: datetime;
}) {
  if (
    !updatedSale.id ||
    !updatedSale.amount ||
    !updatedSale.liters ||
    !updatedSale.attendantId ||
    !updatedSale.pumpId ||
    !updatedSale.receipt ||
    !updatedSale.createdAt
  ) {
    return {
      statusCode: 400,
      error:
        "All fields (id, amount, receipt, liters, pumpId, attendantId, createdAt) are required.",
    };
  }

  const updated = await prisma.fuelSale.update({
    where: { id: updatedSale.id },
    data: {
      amount: updatedSale.amount,
      liters: updatedSale.liters,
      attendantId: updatedSale.attendantId,
      pumpId: updatedSale.pumpId,
      receipt: updatedSale.receipt,
      createdAt: updatedSale.createdAt,
    },
  });

  return { success: true, data: updated };
}

async function deleteSale(id: number) {
  if (!id) {
    return { statusCode: 400, error: "Sale ID is required." };
  }

  await prisma.fuelSale.delete({ where: { id } });
  return { success: true, message: "Sale deleted successfully." };
}
