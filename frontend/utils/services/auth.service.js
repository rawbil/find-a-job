import { AxiosError } from "axios";
import createApi, { handleTokenExpiration } from "../axios.create-api";

//login service
export const authLogin = async (userData) => {
  try {
    const response = await createApi.post("/auth/login", userData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Login failed");
    } else if (error.message === 'TOKEN_EXPIRED') {
      handleTokenExpiration();
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};


//register service
export const authRegister = async (data) => {
  try {
    const response = await createApi.post("/auth/register", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response.data.message || "Registration failed");
    } else if (error.message === 'TOKEN_EXPIRED') {
      handleTokenExpiration();
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

//logout service
export const authLogout = async () => {
  try {
    const response = await createApi.post("/auth/logout");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response.data.message || "Registration failed");
    } else if (error.message === 'TOKEN_EXPIRED') {
      handleTokenExpiration();
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
