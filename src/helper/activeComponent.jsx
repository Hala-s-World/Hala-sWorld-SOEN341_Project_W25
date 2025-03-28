import React, { createContext, useContext, useState } from "react";

const ActiveComponentContext = createContext();

export const useActiveComponent = () => useContext(ActiveComponentContext);

export const ActiveComponentProvider = ({children}) => {
    const [activeComponent, setActiveComponent] = useState("Chat");
    return(
        <ActiveComponentContext.Provider value={{ activeComponent, setActiveComponent}}>
            {children}
        </ActiveComponentContext.Provider>
    );
};