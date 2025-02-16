import { defineEventHandler, readBody } from "h3";
import prisma from "~/server/utils/db";
export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || "0");

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid ID" });
  }

  if (event.method === "GET") {
    const fuelType = await prisma.fuelType.findUnique({ where: { id } });
    if (!fuelType) {
      throw createError({
        statusCode: 404,
        statusMessage: "Fuel type not found",
      });
    }
    return fuelType;
  }

  if (event.method === "PUT") {
    const body = await readBody(event);
    const { name, price_per_liter } = body;

    return await prisma.fuelType.update({
      where: { id },
      data: {
        name,
        price_per_liter: price_per_liter
          ? parseFloat(price_per_liter)
          : undefined,
      },
    });
  }

  if (event.method === "DELETE") {
    return await prisma.fuelType.delete({ where: { id } });
  }
});
