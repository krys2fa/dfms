import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../server/utils/db";
import "dotenv/config"; // Load environment variables

export const loginhandler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    const { email, password } = JSON.parse(event.body);

    // ✅ Check if user exists in the database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    // ✅ Validate password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Incorrect password" }),
      };
    }

    // ✅ Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing JWT_SECRET" }),
      };
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        user: { id: user.id, email: user.email, role: user.role },
        token,
      }),
    };
  } catch (error) {
    console.error("Auth Login Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
