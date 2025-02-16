import { defineEventHandler, readBody } from "h3";
import prisma from "~/server/utils/db";

// Get all fuel types
export default defineEventHandler(async (event) => {
  if (event.method === "GET") {
    return await prisma.fuelType.findMany();
  }

  if (event.method === "POST") {
    const body = await readBody(event);
    const { name, price_per_liter } = body;

    if (!name || !price_per_liter) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required fields",
      });
    }

    return await prisma.fuelType.create({
      data: { name, price_per_liter: parseFloat(price_per_liter) },
    });
  }
});
