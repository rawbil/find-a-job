import { AxiosError } from "axios"
import createApi, { handleTokenExpiration } from "../axios.create-api"

//get the 20 latest profiles
export const getLatestProfilesService = async() => {
    try {
        const response = await createApi.get('/profile/latest');
        return response.data;
    } catch (error) {
        if(error instanceof AxiosError) {
            throw error
        } else if (error.message === 'TOKEN_EXPIRED') {
            handleTokenExpiration();
            throw error;
        } else {
            throw new Error("An unexpected error occurred when fetching latest profiles")
        }
    }
}

//get all profiles
export const getAllProfilesService = async() => {
    try {
        const response = await createApi.get('/profile/all');
        return response.data;
    } catch (error) {
        if(error instanceof AxiosError) {
            throw error
        } else if (error.message === 'TOKEN_EXPIRED') {
            handleTokenExpiration();
            throw error;
        } else {
            throw new Error("An unexpected error occurred when fetching latest profiles")
        }
    }
}

//get user profile
export const getUserProfile = async() => {
        try {
        const response = await createApi.get('/profile/get-profile', {
            withCredentials:true
        });
        return response.data;
    } catch (error) {
        if(error instanceof AxiosError) {
            throw error
        } else if (error.message === 'TOKEN_EXPIRED') {
            handleTokenExpiration();
            throw error;
        } else {
            throw new Error("An unexpected error occurred when fetching user profile")
        }
    }
}

//create profile
export const createUserProfileService = async(data) => {
    try {
        const response = await createApi.post('/profile/create', data, {withCredentials: true});
        return response.data;
    } catch (error) {
           if(error instanceof AxiosError) {
            throw error
        } else if (error.message === 'TOKEN_EXPIRED') {
            handleTokenExpiration();
            throw error;
        } else {
            throw new Error("An unexpected error occurred while creating profile")
        }
    }
}

//update profile
export const updateUserProfileService = async(data) => {
    try {
        const response = await createApi.patch('/profile/update', data, {withCredentials: true});
        return response.data;
    } catch (error) {
           if(error instanceof AxiosError) {
            throw error
        } else if (error.message === 'TOKEN_EXPIRED') {
            handleTokenExpiration();
            throw error;
        } else {
            throw new Error("An unexpected error occurred while updating profile")
        }
    }
}