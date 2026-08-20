"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import PreLauncherLayout from "@/components/PreLauncherLayout";
import { secureStorage } from "@/utils/secureStorage";
import { Compass, Home, ArrowLeft, Sparkles, Building2, User } from "lucide-react";

export default function NotFound() {
    const [hasSession, setHasSession] = useState(false);

    useEffect(() => {
        const session = secureStorage.getUserSession();
        if (session && session.token) {
            setHasSession(true);
        }
    }, []);

    return (
        <PreLauncherLayout>
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center animate-fadeIn">
                {/* 404 Glowing Badge / Ring */}
                <div className="relative mb-6">
                    <div
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center mx-auto"
                        style={{
                            background: "radial-gradient(circle, rgba(140, 86, 252, 0.2) 0%, rgba(255, 137, 1, 0.08) 70%, transparent 100%)",
                            border: "2px solid rgba(140, 86, 252, 0.35)",
                            boxShadow: "0 0 40px rgba(140, 86, 252, 0.3)"
                        }}
                    >
                        <Compass className="w-12 h-12 sm:w-14 sm:h-14 text-[#8C56FC] animate-spin" style={{ animationDuration: "12s" }} />
                    </div>

                    <span
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
                        style={{
                            background: "linear-gradient(135deg, #8C56FC 0%, #FF8901 100%)",
                            color: "#fff",
                            boxShadow: "0 4px 12px rgba(140, 86, 252, 0.4)"
                        }}
                    >
                        Error 404
                    </span>
                </div>

                {/* Big Gradient Number */}
                <h1
                    className="font-extrabold text-5xl sm:text-7xl mb-2 tracking-tight"
                    style={{
                        background: "linear-gradient(135deg, #ffffff 0%, #8C56FC 50%, #FF8901 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                    }}
                >
                    404
                </h1>

                <h2 className="pl-heading text-xl sm:text-2xl mb-2">
                    Lost in the Real Estate Space?
                </h2>

                <p className="pl-subtext max-w-md mx-auto mb-8 text-xs sm:text-sm">
                    The page you are looking for does not exist, may have moved, or is scheduled for our upcoming platform launch.
                </p>

                {/* Navigation Action Links Card */}
                <div className="pl-glass-card max-w-md w-full p-5 sm:p-6 mb-6">
                    <div className="text-xs font-semibold text-[var(--pl-text-muted)] uppercase tracking-wider mb-3">
                        Quick Destinations
                    </div>

                    <div className="flex flex-col gap-2.5">
                        {hasSession ? (
                            <Link href="/home" style={{ textDecoration: "none" }}>
                                <button type="button" className="pl-btn pl-btn-primary w-full text-xs sm:text-sm">
                                    <Home className="w-4 h-4 mr-1.5" /> Return to Dashboard
                                </button>
                            </Link>
                        ) : (
                            <Link href="/welcome" style={{ textDecoration: "none" }}>
                                <button type="button" className="pl-btn pl-btn-primary w-full text-xs sm:text-sm">
                                    <Sparkles className="w-4 h-4 mr-1.5" /> Back to Welcome Portal
                                </button>
                            </Link>
                        )}

                        <div className="grid grid-cols-2 gap-2 mt-1">
                            <Link href="/agent/login" style={{ textDecoration: "none" }}>
                                <button type="button" className="pl-btn pl-btn-outline w-full text-xs" style={{ padding: "10px 8px" }}>
                                    <Building2 className="w-3.5 h-3.5 mr-1 text-[#FF8901]" /> Agent Login
                                </button>
                            </Link>

                            <Link href="/user/login" style={{ textDecoration: "none" }}>
                                <button type="button" className="pl-btn pl-btn-outline w-full text-xs" style={{ padding: "10px 8px" }}>
                                    <User className="w-3.5 h-3.5 mr-1 text-[#8C56FC]" /> Host Login
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-[var(--pl-text-muted)]">
                    Need assistance? Contact support at{" "}
                    <a href="mailto:tpa.ofe@gmail.com" className="pl-link">
                        tpa.ofe@gmail.com
                    </a>
                </p>
            </div>
        </PreLauncherLayout>
    );
}
