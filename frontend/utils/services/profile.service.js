import { AxiosError } from "axios"
import createApi from "../axios.create-api"


//get the 20 latest profiles
export const getLatestProfilesService = async() => {
    try {
        const response = await createApi.get('/profile/latest');
        return response.data;
    } catch (error) {
        if(error instanceof AxiosError) {
            throw error
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
        } else {
            throw new Error("An unexpected error occurred when fetching latest profiles")
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
        } else {
            throw new Error("An unexpected error occurred while creating profile")
        }
    }
}