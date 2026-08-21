"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import PreLauncherLayout from "@/components/PreLauncherLayout";
import { Home, Building2 } from "lucide-react";

const ACTION_WORDS = [
    { word: "Sell.", bg: "#8C56FC" },
    { word: "Rent.", bg: "#FF8901" },
    { word: "Stay.", bg: "#0284c7" },
    { word: "Grow.", bg: "#10b981" }
];

export default function WelcomePage() {
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % ACTION_WORDS.length);
        }, 2400);
        return () => clearInterval(interval);
    }, []);

    const footerContent = (
        <p className="mt-10 text-center text-xs sm:text-sm font-medium" style={{ color: "var(--pl-text-muted)" }}>
            © 2026 <a href="https://truepropagents.com/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-[var(--pl-accent-primary)] transition-colors">True Prop Agents</a> · Pakistan
        </p>
    );

    const currentAction = ACTION_WORDS[wordIndex];

    return (
        <PreLauncherLayout topbarPosition="top" footer={footerContent}>
            <div className="flex-1 flex flex-col items-center justify-center py-6">
                {/* Minimal Hero / Early Access Section */}
                <div className="text-center mb-10 w-full max-w-4xl mx-auto">
                    <span className="pl-badge mb-4 text-xs sm:text-sm px-3.5 py-1.5 inline-block font-semibold">🚀 Early Access</span>
                    <h1 className="pl-heading text-3xl sm:text-4xl md:text-5xl mb-3 flex items-center justify-center gap-3 flex-wrap">
                        <span>Welcome to</span>
                        <Image
                            src="/LOGO COLOR.png"
                            alt="Agent3 Logo"
                            width={135}
                            height={42}
                            className="object-contain inline-block"
                            priority
                        />
                    </h1>
                    <p className="pl-subtext text-base sm:text-lg font-medium text-[var(--pl-text-secondary)]">Choose how you&apos;d like to continue</p>

                    {/* Dynamic High-Impact Headline (Image Style) */}
                    <div className="pl-hero-headline">
                        <span>One Place. Every Property Possibility</span>
                        <span
                            key={wordIndex}
                            className="pl-highlight-box"
                            style={{ backgroundColor: currentAction.bg }}
                        >
                            {currentAction.word}
                        </span>
                    </div>
                </div>

                {/* Role Cards */}
                <div className="w-full max-w-md flex flex-col gap-4">
                    <Link href="/user/login" style={{ textDecoration: "none" }}>
                        <div className="pl-welcome-card group">
                            <div className="pl-welcome-icon pl-welcome-icon--host">
                                <Home className="w-7 h-7" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="pl-welcome-title">Customer</div>
                                <div className="pl-welcome-sub">Buy, rent or explore properties</div>
                            </div>
                            <span className="pl-welcome-arrow">→</span>
                        </div>
                    </Link>

                    <Link href="/agent/login" style={{ textDecoration: "none" }}>
                        <div className="pl-welcome-card group">
                            <div className="pl-welcome-icon pl-welcome-icon--seller">
                                <Building2 className="w-7 h-7" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="pl-welcome-title">Host / Agent</div>
                                <div className="pl-welcome-sub">List properties, host stays &amp; manage leads</div>
                            </div>
                            <span className="pl-welcome-arrow">→</span>
                        </div>
                    </Link>
                </div>
            </div>
        </PreLauncherLayout>
    );
}
