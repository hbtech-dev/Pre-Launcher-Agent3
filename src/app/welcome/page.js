"use client";
import Link from "next/link";
import PreLauncherLayout from "@/components/PreLauncherLayout";

export default function WelcomePage() {
    return (
        <PreLauncherLayout>
            <div className="flex-1 flex flex-col justify-center py-6">
                {/* Hero Intro */}
                <div className="text-center mb-8">
                    <div className="inline-block mb-3">
                        <span className="pl-badge">🚀 Early Access Portal</span>
                    </div>

                    <h1 className="pl-heading text-2xl sm:text-3xl mb-3">
                        Welcome to <span style={{ color: "#8C56FC" }}>Agent3</span>
                    </h1>
                    <p className="pl-subtext max-w-sm mx-auto">
                        Pakistan&apos;s Next-Gen Real Estate Ecosystem. Choose your role to access the pre-launch onboarding.
                    </p>
                </div>

                {/* Role Selection Cards */}
                <div className="flex flex-col gap-4 mb-8">
                    <Link href="/user/login" style={{ textDecoration: "none" }}>
                        <div className="pl-role-card">
                            <div className="pl-role-icon pl-role-icon--user">
                                <span>🏠</span>
                            </div>
                            <div className="flex-1">
                                <div className="pl-role-title">Customer & Property Seeker</div>
                                <div className="pl-role-desc">
                                    Explore verified properties, direct chat with agents, and smart investment tools.
                                </div>
                            </div>
                            <span style={{ color: "var(--pl-accent-primary)", fontSize: "18px" }}>→</span>
                        </div>
                    </Link>

                    <Link href="/agent/login" style={{ textDecoration: "none" }}>
                        <div className="pl-role-card">
                            <div className="pl-role-icon pl-role-icon--agent">
                                <span>🏢</span>
                            </div>
                            <div className="flex-1">
                                <div className="pl-role-title">Real Estate Agent / Agency</div>
                                <div className="pl-role-desc">
                                    Complete verified KYC, post listings, receive high-converting buyer leads.
                                </div>
                            </div>
                            <span style={{ color: "var(--pl-accent-secondary)", fontSize: "18px" }}>→</span>
                        </div>
                    </Link>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-auto pt-6 border-t" style={{ borderColor: "var(--pl-border-subtle)" }}>
                    <p style={{ fontSize: "12px", color: "var(--pl-text-muted)" }}>
                        © 2026 Agent3. Building the future of PropTech in Pakistan.
                    </p>
                </div>
            </div>
        </PreLauncherLayout>
    );
}
