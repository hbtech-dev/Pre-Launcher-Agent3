"use client";
import Link from "next/link";
import PreLauncherLayout from "@/components/PreLauncherLayout";
import { Home, Building2 } from "lucide-react";

export default function WelcomePage() {
    return (
        <PreLauncherLayout>
            <div className="flex-1 flex flex-col items-center justify-center py-10">
                {/* Minimal Hero */}
                <div className="text-center mb-10">
                    <span className="pl-badge mb-4 inline-block">🚀 Early Access</span>
                    <h1 className="pl-heading text-2xl sm:text-3xl mb-2">
                        Welcome to <span style={{ color: "#8C56FC" }}>Agent3</span>
                    </h1>
                    <p className="pl-subtext text-sm">Choose how you&apos;d like to continue</p>
                </div>

                {/* Two Role Cards */}
                <div className="w-full max-w-md flex flex-col gap-4">
                    <Link href="/user/login" style={{ textDecoration: "none" }}>
                        <div className="pl-welcome-card group">
                            <div className="pl-welcome-icon pl-welcome-icon--customer">
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
                                <div className="pl-welcome-title">Seller / Agency</div>
                                <div className="pl-welcome-sub">List properties &amp; manage leads</div>
                            </div>
                            <span className="pl-welcome-arrow">→</span>
                        </div>
                    </Link>
                </div>

                {/* Footer */}
                <p className="mt-12 text-center text-xs" style={{ color: "var(--pl-text-muted)" }}>
                    © 2026 Agent3 Technologies · Pakistan
                </p>
            </div>
        </PreLauncherLayout>
    );
}
