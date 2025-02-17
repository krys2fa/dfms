import { jwtDecode } from "jwt-decode"; // Install this package if needed

export const getUserFromToken = (token: string | undefined) => {
  console.log("🚀 ~ getUserFromToken ~ token:", token);
  try {
    if (!token) return null;

    const decodedToken = jwtDecode(token); // Decode the JWT
    return (decodedToken as any).user || decodedToken; // Return user info (depends on token structure)
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
