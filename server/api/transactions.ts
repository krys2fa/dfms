// import { defineEventHandler, getQuery, readBody } from "h3";
// import { prisma } from "~/server/utils/db";
// import { getUserFromToken } from "../utils/auth";

// export default defineEventHandler(async (event) => {
//   const method = event.node.req.method;
//   const token = event.node.req.headers.authorization?.split(" ")[1];

//   // Authenticate user
//   const user = await getUserFromToken();
//   if (!user) return { statusCode: 401, error: "Unauthorized access." };

//   try {
//     switch (method) {
//       case "GET":
//         return await getTransactions();
//       case "POST":
//         const newTransaction = await readBody(event);
//         return await addTransaction(newTransaction);
//       case "PUT":
//         const updatedTransaction = await readBody(event);
//         return await updateTransaction(updatedTransaction);
//       case "DELETE":
//         const { id } = getQuery(event);
//         return await deleteTransaction(Number(id));
//       default:
//         return { statusCode: 405, error: "Method Not Allowed." };
//     }
//   } catch (error) {
//     console.error("API Error:", error);
//     return { statusCode: 500, error: "Internal Server Error." };
//   }
// });

// // ✅ Fetch all transactions
// async function getTransactions() {
//   return await prisma.transactions.findMany({ orderBy: { id: "desc" } });
// }

// // ✅ Add a transaction
// async function addTransaction(transaction) {
//   if (
//     !transaction.license_plate ||
//     !transaction.amount ||
//     !transaction.attendant_id
//   ) {
//     return { statusCode: 400, error: "Missing required fields." };
//   }

//   const newTransaction = await prisma.transactions.create({
//     data: {
//       license_plate: transaction.license_plate,
//       amount: transaction.amount,
//       attendant_id: transaction.attendant_id,
//       station_id: transaction.station_id,
//       liters_sold: transaction.liters_sold,
//       fuel_type_id: transaction.fuel_type_id,
//     },
//   });

//   return { success: true, data: newTransaction };
// }

// // ✅ Update a transaction
// async function updateTransaction(transaction) {
//   if (!transaction.id || !transaction.license_plate || !transaction.amount) {
//     return { statusCode: 400, error: "Missing required fields." };
//   }

//   const updated = await prisma.transactions.update({
//     where: { id: transaction.id },
//     data: {
//       license_plate: transaction.license_plate,
//       amount: transaction.amount,
//       attendant_id: transaction.attendant_id,
//       station_id: transaction.station_id,
//       liters_sold: transaction.liters_sold,
//       fuel_type_id: transaction.fuel_type_id,
//     },
//   });

//   return { success: true, data: updated };
// }

// // ✅ Delete a transaction
// async function deleteTransaction(id) {
//   if (!id) return { statusCode: 400, error: "Transaction ID is required." };

//   await prisma.transactions.delete({ where: { id } });
//   return { success: true, message: "Transaction deleted successfully." };
// }
