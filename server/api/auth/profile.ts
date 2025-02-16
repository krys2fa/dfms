import { defineEventHandler, getHeader } from "h3";
import jwt from "jsonwebtoken";
import prisma from "../../utils/db";

export default defineEventHandler(async (event) => {
  const token = getHeader(event, "Authorization")?.split(" ")[1];
  if (!token) return { error: "Unauthorized" };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    return { user };
  } catch {
    return { error: "Invalid token" };
  }
});
