import { defineEventHandler, readBody } from "h3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../utils/db"; // Ensure you have prisma instance

export default defineEventHandler(async (event) => {
  const { email, password, name, role, stationId } = await readBody(event);

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Email already in use" };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
      name,
      stationId: stationId || null,
    },
  });

  // Generate JWT Token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
});
