"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Scale, Users, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            {/* Clean White Top Navigation Header */}
            <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/home" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
                        <Image
                            src="/LOGO COLOR.png"
                            alt="Agent3 Logo"
                            width={130}
                            height={34}
                            className="object-contain"
                            priority
                        />
                    </Link>

                    <Link
                        href="/home"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300"
                        style={{ textDecoration: "none" }}
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
                    </Link>
                </div>
            </header>

            {/* Document Body */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-10 pb-6 border-b border-slate-200">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-[#8C56FC] border border-purple-100 mb-3">
                        <Scale className="w-3.5 h-3.5" /> Legal Agreement
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-2">
                        Terms of Service &amp; Conditions
                    </h1>
                    <p className="text-sm text-slate-500">
                        Effective Date: August 20, 2026 • Agent3 PropTech Platform
                    </p>
                </div>

                <div className="space-y-8 text-sm leading-relaxed text-slate-700">
                    {/* Section 1 */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Scale className="w-5 h-5 text-[#8C56FC]" />
                            1. Acceptance of Terms
                        </h2>
                        <p>
                            By creating an account, accessing, or registering on the Agent3 platform (whether as an early host, buyer, or verified real estate partner agent), you agree to be bound by these Terms of Service. If you do not agree with any provision, please do not use our services.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Users className="w-5 h-5 text-[#FF8901]" />
                            2. Account Types &amp; Verification Rules
                        </h2>
                        <p>
                            Agent3 provides distinct portal environments designed for verified operations:
                        </p>
                        <ul className="space-y-2 pl-4">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#8C56FC] flex-shrink-0 mt-0.5" />
                                <span><strong>Host / Buyer Profiles:</strong> Accounts designated for property seekers, investors, and clients seeking verified listings or short-term guest stays.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#8C56FC] flex-shrink-0 mt-0.5" />
                                <span><strong>Partner Agent Accounts:</strong> Requires mandatory KYC submission, CNIC verification, and valid agency operating credentials. All agent accounts undergo manual admin vetting before receiving listing permissions.</span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-[#FF8901]" />
                            3. Listing Accuracy &amp; Prohibited Conduct
                        </h2>
                        <p>
                            To maintain 100% authentic inventory across the platform, users agree to the following standards:
                        </p>
                        <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
                            <li>No fraudulent or phantom property listings with fabricated coordinates.</li>
                            <li>No automated scraping, reverse engineering, or unauthorized extraction of society masterplans.</li>
                            <li>Immediate suspension applies to any account attempting escrow manipulation or identity spoofing.</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">
                            4. Legal Assistance &amp; Support
                        </h2>
                        <p>
                            If you have questions regarding our terms or agency agreement terms, please contact our legal desk:
                        </p>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <p className="font-semibold text-slate-900">Agent3 Legal &amp; Governance Team</p>
                                <p className="text-xs text-slate-500">Email: legal@agent3.pk • WhatsApp: +92 330 7864445</p>
                            </div>
                            <a
                                href="https://wa.me/923307864445?text=Hello%20Agent3%20Legal%20Desk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold bg-[#8C56FC] text-white hover:bg-[#7843e6] transition-colors"
                                style={{ textDecoration: "none" }}
                            >
                                Contact Legal →
                            </a>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <footer className="mt-16 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
                    © 2026 Agent3 Technologies Ltd. • All rights reserved.
                </footer>
            </main>
        </div>
    );
}
