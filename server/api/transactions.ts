import { defineEventHandler, getQuery, readBody } from "h3";
import prisma from "~/server/utils/db";
import { getUserFromToken } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const token = event.node.req.headers.authorization?.split(" ")[1];

  // Authenticate user
  const user = await getUserFromToken(token);
  if (!user) return { statusCode: 401, error: "Unauthorized access." };

  try {
    switch (method) {
      case "GET":
        return await getTransactions();
      case "POST":
        const newTransaction = await readBody(event);
        return await addTransaction(newTransaction);
      case "PUT":
        const updatedTransaction = await readBody(event);
        return await updateTransaction(updatedTransaction);
      case "DELETE":
        const { id } = getQuery(event);
        return await deleteTransaction(String(id));
      default:
        return { statusCode: 405, error: "Method Not Allowed." };
    }
  } catch (error) {
    console.error("API Error:", error);
    return { statusCode: 500, error: "Internal Server Error." };
  }
});

// ✅ Fetch all transactions
async function getTransactions() {
  return await prisma.transaction.findMany({ orderBy: { id: "desc" } });
}

// ✅ Add a transaction
async function addTransaction(transaction: {
  license_plate: any;
  amount: any;
  attendant_id: any;
  station_id: any;
  liters_sold: any;
  fuel_type_id: any;
}) {
  if (
    !transaction.license_plate ||
    !transaction.amount ||
    !transaction.attendant_id
  ) {
    return { statusCode: 400, error: "Missing required fields." };
  }

  const newTransaction = await prisma.transaction.create({
    data: {
      licensePlate: transaction.license_plate,
      amount: transaction.amount,
      attendantId: transaction.attendant_id,
      stationId: transaction.station_id,
      litersSold: transaction.liters_sold,
      fuelTypeId: transaction.fuel_type_id,
    },
  });

  return { success: true, data: newTransaction };
}

// ✅ Update a transaction
async function updateTransaction(transaction: {
  id: any;
  license_plate: any;
  amount: any;
  attendant_id: any;
  station_id: any;
  liters_sold: any;
  fuel_type_id: any;
}) {
  if (!transaction.id || !transaction.license_plate || !transaction.amount) {
    return { statusCode: 400, error: "Missing required fields." };
  }

  const updated = await prisma.transaction.update({
    where: { id: transaction.id },
    data: {
      licensePlate: transaction.license_plate,
      amount: transaction.amount,
      attendantId: transaction.attendant_id,
      stationId: transaction.station_id,
      litersSold: transaction.liters_sold,
      fuelTypeId: transaction.fuel_type_id,
    },
  });

  return { success: true, data: updated };
}

// ✅ Delete a transaction
async function deleteTransaction(id: string) {
  if (!id) return { statusCode: 400, error: "Transaction ID is required." };

  await prisma.transaction.delete({ where: { id: String(id) } });
  return { success: true, message: "Transaction deleted successfully." };
}
