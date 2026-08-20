"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Particles from "./Particles";

export default function PreLauncherLayout({ children, showBack = false, backUrl = "/welcome", wide = false, topbarPosition = "top", footer = null }) {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            return document.documentElement.getAttribute("data-theme") || localStorage.getItem("pl_theme") || "light";
        }
        return "light";
    });

    useEffect(() => {
        const saved = localStorage.getItem("pl_theme") || "light";
        setTheme(saved);
        document.documentElement.classList.remove("pl-theme-dark", "pl-theme-light");
        document.documentElement.classList.add("pl-theme-" + saved);
        document.documentElement.setAttribute("data-theme", saved);
    }, []);

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem("pl_theme", newTheme);
        document.documentElement.classList.remove("pl-theme-dark", "pl-theme-light");
        document.documentElement.classList.add("pl-theme-" + newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    return (
        <div className={`pl-app pl-theme-${theme}`}>
            <Particles />
            <div className={`pl-container ${wide ? "pl-container--dashboard" : ""}`} style={{ position: "relative", zIndex: 1 }}>
                {/* Top Header Bar with Logo and Theme Switch */}
                {topbarPosition === "top" && (
                    <header className="pl-topbar">
                        <div className="flex items-center gap-2 select-none">
                            <Image
                                src="/LOGO COLOR.png"
                                alt="Agent3 Logo"
                                width={130}
                                height={40}
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* Light / Dark Mode Toggle Pill */}
                        <div className="pl-theme-switch" role="group" aria-label="Theme Switcher">
                            <button
                                type="button"
                                className={`pl-theme-opt ${theme === "light" ? "active" : ""}`}
                                onClick={() => changeTheme("light")}
                            >
                                <span>☀️</span> Light
                            </button>
                            <button
                                type="button"
                                className={`pl-theme-opt ${theme === "dark" ? "active" : ""}`}
                                onClick={() => changeTheme("dark")}
                            >
                                <span>🌙</span> Dark
                            </button>
                        </div>
                    </header>
                )}

                {/* Main Content */}
                <main className="flex-1 flex flex-col">
                    {children}
                </main>

                {topbarPosition === "bottom" && (
                    <header className="pl-topbar mt-6">
                        <div className="flex items-center gap-2 select-none">
                            <Image
                                src="/LOGO COLOR.png"
                                alt="Agent3 Logo"
                                width={130}
                                height={40}
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* Light / Dark Mode Toggle Pill */}
                        <div className="pl-theme-switch" role="group" aria-label="Theme Switcher">
                            <button
                                type="button"
                                className={`pl-theme-opt ${theme === "light" ? "active" : ""}`}
                                onClick={() => changeTheme("light")}
                            >
                                <span>☀️</span> Light
                            </button>
                            <button
                                type="button"
                                className={`pl-theme-opt ${theme === "dark" ? "active" : ""}`}
                                onClick={() => changeTheme("dark")}
                            >
                                <span>🌙</span> Dark
                            </button>
                        </div>
                    </header>
                )}

                {footer}
            </div>
        </div>
    );
}
