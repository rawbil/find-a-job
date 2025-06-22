import { createContext } from "react";

 const AppContext = createContext();

export default function ProviderFunction(children) {
    return (
        <AppContext.Provider>{children}</AppContext.Provider>
    )
}