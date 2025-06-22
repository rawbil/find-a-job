import { AxiosError } from "axios"
import createApi from "../axios.create-api"


export const getLatestProfilesService = async() => {
    try {
        const response = await createApi.get('/profile/latest', {withCredentials: true});
        return response.data;
    } catch (error) {
        if(error instanceof AxiosError) {
            throw error
        } else {
            throw new Error("An unexpected error occurred when fetching latest profiles")
        }
    }
}