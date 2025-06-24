import { useEffect } from "react";
import createApi from "./axios.create-api";



const useAxiosInterceptor = (setAccessToken) => {
  useEffect(() => {
    const interceptor = createApi.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          setAccessToken(null);
          localStorage.removeItem("access_token");
          //  window.location.href="/"
        }
        return Promise.reject(error);
      }
    );
    return () => {
      createApi.interceptors.response.eject(interceptor);
    };
  }, [setAccessToken]);
};

export default useAxiosInterceptor;
