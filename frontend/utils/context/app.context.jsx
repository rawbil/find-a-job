import { useEffect, useState } from "react";
import AppContext from "./ContextFunc";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { authLogout } from "../services/auth.service";

export default function ProviderFunction({ children }) {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if(access_token) {
        setAccessToken(access_token);
    }
  }, []);

  //handle logout functionality
  const handleLogout = async() => {
    try {
      const response = await authLogout();
      if(response.success) {
        toast.success(response.message);
        setAccessToken(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      if(error instanceof AxiosError) {
        toast.error(error.message);
        console.log(error.message)
      }
      else {
        console.log(error.message);
        toast.error(error.message)
      }
    }
  }

  return (
    <AppContext.Provider value={{ accessToken, setAccessToken, handleLogout }}>
      {children}
    </AppContext.Provider>
  );
}
