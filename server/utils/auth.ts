import { jwtDecode } from "jwt-decode"; // Install this package if needed

export const getUserFromToken = () => {
  try {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (!token) return null;

    const decodedToken = jwtDecode(token); // Decode the JWT
    return decodedToken.user || decodedToken; // Return user info (depends on token structure)
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
