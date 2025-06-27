import createApi, { handleTokenExpiration } from "../axios.create-api";

//get user
export const getUserService = async() => {
    try {
        const response = await createApi.get('/users/get', {withCredentials: true});
        return response.data;
    } catch (error) {
        if (error.message === 'TOKEN_EXPIRED') {
            handleTokenExpiration();
            throw error;
        } else {
            throw error;
        }
    }
}

//update user
export const updateUserService = async(data) => {
    try {
        const response = await createApi.patch('/users/update-one', data, {withCredentials: true});
        return response.data;
    } catch (error) {
        if (error.message === 'TOKEN_EXPIRED') {
            handleTokenExpiration();
            throw error;
        } else {
            throw error;
        }
    }
}

//delete user
export const deleteUserService = async(password) => {
    try {
        const response = await createApi.post('/users/delete', { password }, { withCredentials: true });
        return response.data;
    } catch (error) {
        if (error.message === 'TOKEN_EXPIRED') {
            handleTokenExpiration();
            throw error;
        } else {
            throw error;
        }
    }
}