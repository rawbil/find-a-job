import { AxiosError } from "axios";
import createApi, { handleTokenExpiration } from "../axios.create-api";
import toast from "react-hot-toast";

//create
export const createClientPost = async (data) => {
  try {
    const response = await createApi.post("/client/create", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    } else if (error.message === 'TOKEN_EXPIRED') {
      handleTokenExpiration();
      throw error;
    } else {
      throw new Error("An unexpected error occurred when creating post");
    }
  }
};

//update
export const updateClientPost = async (postId, data) => {
  try {
    const response = await createApi.patch(`/client/update/${postId}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response.data.message)
      throw error;
    } else if (error.message === 'TOKEN_EXPIRED') {
      handleTokenExpiration();
      throw error;
    } else {
      throw new Error("An unexpected error occurred when fetching profile");
    }
  }
};

//get profile
export const getClientPost = async (postId) => {
  try {
    const response = await createApi.get(`/client/get-profile/${postId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
     
      toast.error(error.response?.data.message); throw error;
    } else if (error.message === 'TOKEN_EXPIRED') {
      handleTokenExpiration();
      throw error;
    } else {
      throw new Error("An unexpected error occurred when updating post");
    }
  }
};

//get profiles
export const getClientPosts = async () => {
  try {
    const response = await createApi.get("/client/profiles", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    } else if (error.message === 'TOKEN_EXPIRED') {
      handleTokenExpiration();
      throw error;
    } else {
      throw new Error("An unexpected error occurred when fetching all posts");
    }
  }
};

//get latest
export const getLatestClientPosts = async () => {
  try {
    const response = await createApi.get("/client/latest", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    } else if (error.message === 'TOKEN_EXPIRED') {
      handleTokenExpiration();
      throw error;
    } else {
      throw new Error("An unexpected error occurred when fetching latest posts");
    }
  }
};


//delete
export const deleteClientPost = async (postId) => {
  try {
    const response = await createApi.delete(`/client/delete/${postId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    } else if (error.message === 'TOKEN_EXPIRED') {
      handleTokenExpiration();
      throw error;
    } else {
      throw new Error("An unexpected error occurred when fetching latest posts");
    }
  }
};

//get specific user's posts
export const getSpecificUserPosts = async() => {
  try {
    const response = await createApi.get('/client/user-posts', {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}