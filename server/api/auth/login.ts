import { defineEventHandler, readBody } from "h3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../utils/db"; // ✅ Correct import

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  // ✅ Find user in database
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "User not found" };

  // ✅ Compare hashed password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return { error: "Incorrect password" };

  // ✅ Ensure JWT_SECRET is set
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables");
  }

  // ✅ Generate JWT Token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user: { id: user.id, email: user.email, role: user.role }, token };
});
