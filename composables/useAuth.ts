import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const useAuth = () => {
  const toast = useToast();
  const router = useRouter();

  // **Login function (calls the backend)**
  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      if (response.error) {
        toast.error(response.error);
        return { error: response.error };
      }

      localStorage.setItem("token", response.token); // Store JWT token
      toast.success("Login successful!");
      return { data: response.user };
    } catch (error) {
      toast.error("Login error: " + error.message);
      return { error: error.message };
    }
  };

  // **Register function**
  const register = async (
    email: string,
    password: string,
    name: string,
    role: string,
    stationId?: string
  ) => {
    try {
      const response = await $fetch("/api/auth/register", {
        method: "POST",
        body: { email, password, name, role, stationId },
      });

      if (response.error) {
        toast.error(response.error);
        return { error: response.error };
      }

      toast.success("Registration successful!");
      return { data: response.user };
    } catch (error) {
      toast.error("Registration error: " + error.message);
      return { error: error.message };
    }
  };

  // **Get user profile**
  const getUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const response = await $fetch("/api/auth/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.error) {
        return null;
      }

      return response.user;
    } catch (error) {
      return null;
    }
  };

  // **Logout function**
  const logout = async () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    router.push("/auth/login");
  };

  return { login, register, getUserProfile, logout };
};

export default useAuth;
