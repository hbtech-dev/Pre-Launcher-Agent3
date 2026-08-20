"use client";
import Link from "next/link";
import PreLauncherLayout from "@/components/PreLauncherLayout";
import { ArrowLeft, ShieldCheck, Lock, Eye } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <PreLauncherLayout>
            <div className="flex-1 flex flex-col justify-center py-4">
                <Link
                    href="/home"
                    className="inline-flex items-center gap-1.5 text-sm mb-4"
                    style={{ color: "var(--pl-text-secondary)", textDecoration: "none" }}
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="mb-6">
                    <h1 className="pl-heading mb-1.5">Privacy Policy</h1>
                    <p className="pl-subtext">Data Protection & Privacy guidelines for Agent3 Ecosystem</p>
                </div>

                <div className="pl-glass-card space-y-6 text-sm leading-relaxed text-[var(--pl-text-secondary)]">
                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-[var(--pl-text-primary)] flex items-center gap-2">
                            <Lock className="w-4.5 h-4.5 text-[#8C56FC]" />
                            1. Security & Data Protection
                        </h2>
                        <p className="text-xs">
                            At Agent3, data protection is our highest priority. We implement bank-grade security controls to keep your personal information and documents safe:
                        </p>
                        <ul className="list-disc pl-5 text-xs space-y-1">
                            <li><strong>Encryption:</strong> All sensitive data is encrypted both in transit (using TLS 1.3) and at rest (using AES-256 encryption standards).</li>
                            <li><strong>Encrypted KYC pipelines:</strong> Documents uploaded for Agent Verification are encrypted and stored in secure, private cloud vaults.</li>
                            <li><strong>Access Auditing:</strong> Strict authentication boundaries prevent unauthorized staff or external systems from accessing user profiles.</li>
                            <li><strong>Two-Factor Authentication (2FA):</strong> Real-time SMS and phone-based OTP protection for secure agent registration and sign-in.</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-[var(--pl-text-primary)] flex items-center gap-2">
                            <Eye className="w-4.5 h-4.5 text-[#FF8901]" />
                            2. Information We Collect
                        </h2>
                        <p className="text-xs">
                            We collect only the essential information required to verify identity and connect hosts with verified real estate partners:
                        </p>
                        <ul className="list-disc pl-5 text-xs space-y-1">
                            <li>Name, email address, and phone number on account creation.</li>
                            <li>Agency details, business license, and operating city for verified partner agents.</li>
                            <li>IP address, device type, and login timestamps to secure sessions and prevent multi-account abuse.</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-[var(--pl-text-primary)] flex items-center gap-2">
                            <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                            3. Usage & Sharing
                        </h2>
                        <p className="text-xs">
                            Your personal data is solely used to power transaction pipelines, verify credentials, and manage early leads.
                        </p>
                        <p className="text-xs">
                            We do not sell, rent, or trade your data to third-party advertisers. All listings, Society plot overlays, and transaction parameters are handled inside our secure PropTech network.
                        </p>
                    </section>

                    <section className="border-t border-[var(--pl-border-subtle)] pt-4 text-center">
                        <p className="text-[11px] text-[var(--pl-text-muted)]">
                            Last updated: August 20, 2026. For privacy questions, contact us at privacy@agent3.pk
                        </p>
                    </section>
                </div>
            </div>
        </PreLauncherLayout>
    );
}
