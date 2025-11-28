import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  // ✔ Check Auth
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.error("Error checking auth:", error?.message);
      set({ authUser: null });
    } finally {
      set({ isCheckAuth: false });
    }
  },

  // ✔ Signup
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully!");
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Signup failed";
      toast.error(msg);
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ✔ Login
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully!");
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
      throw error;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ✔ Logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
    } catch (error) {
      const msg = error.response?.data?.message || "Error logging out";
      toast.error(msg);
    }
  },

  // ✔ Update Profile
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      const msg = error.response?.data?.message || "Error updating profile";
      toast.error(msg);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
