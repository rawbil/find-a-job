import { useEffect, useState } from "react";
import AppContext from "./ContextFunc";

export default function ProviderFunction({ children }) {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if(access_token) {
        setAccessToken(accessToken);
    }
  }, [accessToken])

  return (
    <AppContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AppContext.Provider>
  );
}
