"use client";
import Link from "next/link";
import PreLauncherLayout from "@/components/PreLauncherLayout";
import { ArrowLeft, Scale, Users, ShieldAlert } from "lucide-react";

export default function TermsPage() {
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
                    <h1 className="pl-heading mb-1.5">Terms of Service</h1>
                    <p className="pl-subtext">Terms & Conditions for using Agent3 PropTech platform</p>
                </div>

                <div className="pl-glass-card space-y-6 text-sm leading-relaxed text-[var(--pl-text-secondary)]">
                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-[var(--pl-text-primary)] flex items-center gap-2">
                            <Scale className="w-4.5 h-4.5 text-[#8C56FC]" />
                            1. Agreement & Acceptance
                        </h2>
                        <p className="text-xs">
                            By creating an account, registering, or signing in as a Host or Partner Agent, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the application.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-[var(--pl-text-primary)] flex items-center gap-2">
                            <Users className="w-4.5 h-4.5 text-[#FF8901]" />
                            2. Account Creation & KYC Registration
                        </h2>
                        <p className="text-xs">
                            To list properties, access map tools, or communicate with potential leads, you must complete the appropriate account setup:
                        </p>
                        <ul className="list-disc pl-5 text-xs space-y-1">
                            <li><strong>Host Accounts:</strong> Reserved for clients, buyers, and renters looking for verified real estate properties.</li>
                            <li><strong>Partner Agent Accounts:</strong> Requires uploading valid business documents, identification, and matching city licensing records. Agent profiles undergo a mandatory manual KYC approval workflow by our admin command center.</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-semibold text-[var(--pl-text-primary)] flex items-center gap-2">
                            <ShieldAlert className="w-4.5 h-4.5 text-red-400" />
                            3. Fair Usage & Prohibited Behavior
                        </h2>
                        <p className="text-xs">
                            We reserve the right to suspend accounts that engage in:
                        </p>
                        <ul className="list-disc pl-5 text-xs space-y-1">
                            <li>Uploading fake property details, misleading society dimension coordinates, or spamming chat systems.</li>
                            <li>Bypassing standard verification channels, scraping coordinates, or reverse engineering map modules.</li>
                            <li>Exploiting session configurations or committing fraud.</li>
                        </ul>
                    </section>

                    <section className="border-t border-[var(--pl-border-subtle)] pt-4 text-center">
                        <p className="text-[11px] text-[var(--pl-text-muted)]">
                            Last updated: August 20, 2026. For terms inquiries, contact us at legal@agent3.pk
                        </p>
                    </section>
                </div>
            </div>
        </PreLauncherLayout>
    );
}
