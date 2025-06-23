import { createContext, useState } from "react";

 const AppContext = createContext();

export default function ProviderFunction({ children }) {
    const [accessToken, setAccessToken] = useState('')
    return (
        <AppContext.Provider value={{accessToken, setAccessToken}}>{children}</AppContext.Provider>
    )
}