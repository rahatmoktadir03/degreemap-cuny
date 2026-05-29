import React, { createContext, useContext, useEffect, useState } from "react";
const DarkModeContext = createContext(undefined);
export const DarkModeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        try {
            const stored = localStorage.getItem("darkMode");
            if (stored !== null && stored !== undefined) {
                return stored === "true";
            }
        }
        catch (e) {
            console.warn("Failed to read darkMode from localStorage:", e);
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        }
        else {
            document.documentElement.classList.remove("dark");
        }
        try {
            localStorage.setItem("darkMode", isDarkMode.toString());
        }
        catch (e) {
            console.warn("Failed to write darkMode to localStorage:", e);
        }
    }, [isDarkMode]);
    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
    };
    return (<DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>);
};
export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error("useDarkMode must be used within DarkModeProvider");
    }
    return context;
};
