// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import prisma from "../../server/utils/db";
// import "dotenv/config"; // Load environment variables

// export const handler = async (event) => {
//   try {
//     if (event.httpMethod !== "POST") {
//       return {
//         statusCode: 405,
//         body: JSON.stringify({ error: "Method Not Allowed" }),
//       };
//     }

//     const body = JSON.parse(event.body);
//     const { email, password, name, role, stationId } = body;

//     // Check if user exists
//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     if (existingUser) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ error: "Email already in use" }),
//       };
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const user = await prisma.user.create({
//       data: {
//         email,
//         password: hashedPassword,
//         name,
//         role,
//         stationId: stationId || null,
//       },
//     });

//     // Ensure JWT_SECRET is set
//     if (!process.env.JWT_SECRET) {
//       throw new Error("Missing JWT_SECRET in environment variables");
//     }

//     // Generate JWT Token
//     const token = jwt.sign(
//       { id: user.id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     return {
//       statusCode: 201,
//       body: JSON.stringify({ user, token }),
//     };
//   } catch (error) {
//     console.error("Registration Error:", error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: "Internal Server Error" }),
//     };
//   }
// };

// import "dotenv/config"; // Load environment variables

// export const handler = async (event) => {
//   try {
//     if (event.httpMethod !== "POST") {
//       return {
//         statusCode: 405,
//         body: JSON.stringify({ error: "Method Not Allowed" }),
//       };
//     }

//     const body = JSON.parse(event.body);
//     const { email, password, name, role, stationId } = body;

//     // Check if user exists
//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     if (existingUser) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ error: "Email already in use" }),
//       };
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const user = await prisma.user.create({
//       data: {
//         email,
//         password: hashedPassword,
//         name,
//         role,
//         stationId: stationId || null,
//       },
//     });

//     // Ensure JWT_SECRET is set
//     if (!process.env.JWT_SECRET) {
//       throw new Error("Missing JWT_SECRET in environment variables");
//     }

//     // Generate JWT Token
//     const token = jwt.sign(
//       { id: user.id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     return {
//       statusCode: 201,
//       body: JSON.stringify({ user, token }),
//     };
//   } catch (error) {
//     console.error("Registration Error:", error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: "Internal Server Error" }),
//     };
//   }
// };
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Handler } from "@netlify/functions";
import prisma from "../../server/utils/db";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const { email, password, name, role, stationId } = JSON.parse(
    event.body || "{}"
  );

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Email already in use" }),
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
      stationId: stationId || null,
    },
  });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { statusCode: 201, body: JSON.stringify({ user, token }) };
};
