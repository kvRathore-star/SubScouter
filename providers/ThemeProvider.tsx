"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme(): ThemeContextType {
    const ctx = useContext(ThemeContext);
    // SSR-safe: return defaults during prerendering
    if (!ctx) return { theme: 'dark', toggleTheme: () => { }, setTheme: () => { } };
    return ctx;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("subscout_theme") as Theme | null;
        const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const initial = stored || preferred;
        setThemeState(initial);
        document.documentElement.classList.toggle("dark", initial === "dark");
        setMounted(true);
    }, []);

    const setTheme = (t: Theme) => {
        setThemeState(t);
        localStorage.setItem("subscout_theme", t);
        document.documentElement.classList.toggle("dark", t === "dark");
    };

    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

    // Prevent flash of wrong theme
    if (!mounted) return <div style={{ visibility: "hidden" }}>{children}</div>;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
