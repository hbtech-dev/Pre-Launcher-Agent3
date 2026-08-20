"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shield, Lock, Eye, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicyPage() {
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
                        <Shield className="w-3.5 h-3.5" /> Official Policy Document
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-2">
                        Privacy Policy &amp; Data Protection
                    </h1>
                    <p className="text-sm text-slate-500">
                        Effective Date: August 20, 2026 • Agent3 PropTech Platform
                    </p>
                </div>

                <div className="space-y-8 text-sm leading-relaxed text-slate-700">
                    {/* Section 1 */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-[#8C56FC]" />
                            1. Security Controls &amp; Data Protection
                        </h2>
                        <p>
                            At Agent3, protecting the personal and transactional data of our community members, hosts, and partner agents is our highest commitment. We employ enterprise-grade security protocols across all our web, backend, and mobile systems:
                        </p>
                        <ul className="space-y-2 pl-4">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#8C56FC] flex-shrink-0 mt-0.5" />
                                <span><strong>End-to-End Transit Encryption:</strong> All communications between your browser, mobile app, and our cloud cluster are encrypted using TLS 1.3 cryptographic protocols.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#8C56FC] flex-shrink-0 mt-0.5" />
                                <span><strong>Database Storage Standards:</strong> Critical profile records, passwords (hashed via salted bcrypt), and KYC documentation are stored in AES-256 encrypted private data stores.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#8C56FC] flex-shrink-0 mt-0.5" />
                                <span><strong>Private Number Shielding:</strong> In-app live chat and audio calling connect buyers and agents without revealing personal mobile numbers.</span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 2 */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-[#FF8901]" />
                            2. Information We Collect
                        </h2>
                        <p>
                            We collect only the essential information necessary to verify accounts, provide seamless property discovery, and ensure genuine transactions:
                        </p>
                        <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
                            <li><strong>Account Identifiers:</strong> Name, verified email address, and phone number for SMS OTP security.</li>
                            <li><strong>Agent KYC Records:</strong> Agency registration, operating territory, and business license copies required for verified partner status.</li>
                            <li><strong>Session &amp; Security Logs:</strong> IP address, device telemetry, and timestamp logs to prevent fraudulent multiple signups.</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">
                            3. Use of Information &amp; Non-Disclosure
                        </h2>
                        <p>
                            Your information is strictly utilized to operate and enhance the Agent3 platform. We maintain a zero-compromise privacy standard:
                        </p>
                        <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
                            <li>We <strong>do not sell, rent, or monetize</strong> your personal details to third-party advertisers.</li>
                            <li>Lead inquiries are routed strictly between the prospective client and the authorized listing agent.</li>
                            <li>You maintain the right to review, update, or request permanent deletion of your profile data at any time.</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">
                            4. Contact Our Data Protection Officer
                        </h2>
                        <p>
                            For inquiries regarding our privacy standards, data handling procedures, or compliance requests, please reach out to our privacy desk:
                        </p>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <p className="font-semibold text-slate-900">Agent3 Compliance &amp; Security Desk</p>
                                <p className="text-xs text-slate-500">Email: privacy@agent3.pk • WhatsApp: +92 330 7864445</p>
                            </div>
                            <a
                                href="https://wa.me/923307864445?text=Hello%20Agent3%20Compliance%20Desk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold bg-[#8C56FC] text-white hover:bg-[#7843e6] transition-colors"
                                style={{ textDecoration: "none" }}
                            >
                                Contact Officer →
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
