import { defineEventHandler, getQuery, readBody } from "h3";
import prisma from "~/server/utils/db";
import { getUserFromToken } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const token = event.node.req.headers.authorization?.split(" ")[1];

  // Ensure user is authenticated
  const user = await getUserFromToken(token);
  console.log("Authenticated User:", user);
  if (!user) {
    return { statusCode: 401, error: "Unauthorized access." };
  }

  try {
    switch (method) {
      case "GET":
        const query = getQuery(event);
        if (query.role) {
          return await fetchUsersByRole(query.role as string);
        }
        return await getUsers();

      case "POST":
      case "PUT":
      case "DELETE":
      default:
        return { statusCode: 405, error: "Method Not Allowed." };
    }
  } catch (error) {
    console.error("API Error:", error);
    return { statusCode: 500, error: "Internal Server Error." };
  }
});

// ✅ Fetch all users
async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { id: "desc" },
  });
}

// ✅ Fetch users by role (Fix: Ensures filtering works correctly)
async function fetchUsersByRole(role: string) {
  if (!role || typeof role !== "string") {
    return { statusCode: 400, error: "Valid role is required." };
  }

  const users = await prisma.user.findMany({
    where: { role: role.trim() }, // Ensure no leading/trailing spaces
    orderBy: { id: "desc" },
  });

  if (users.length === 0) {
    return { success: false, message: `No users found for role: ${role}` };
  }

  console.log(`Users fetched for role "${role}":`, users);

  return { success: true, data: users };
}
