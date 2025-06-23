import axios from "axios";
import { useEffect } from "react";

const useAxiosInterceptor = (setAccessToken) => {
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          setAccessToken(null);
          localStorage.removeItem("access_token");
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [setAccessToken]);
};

export default useAxiosInterceptor;
