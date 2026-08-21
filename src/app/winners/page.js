"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { luckyWheelAPI } from "@/config/api";
import PreLauncherLayout from "@/components/PreLauncherLayout";
import VerifiedBadge from "@/components/VerifiedBadge";
import {
    Trophy,
    ArrowLeft,
    Sparkles,
    CheckCircle2,
    Calendar,
    Crown,
    ShieldCheck,
    Users,
    Gift
} from "lucide-react";

export default function LuckyWinnersPage() {
    const [winners, setWinners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const fetchWinners = async () => {
            setIsLoading(true);
            try {
                const res = await luckyWheelAPI.getWinners(1, 50);
                if (res?.status === "success") {
                    setWinners(res.data || []);
                    setTotalCount(res.total || 0);
                }
            } catch (err) {
                console.error("Failed to load winners:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWinners();
    }, []);

    const footerContent = (
        <p className="mt-10 text-center text-xs sm:text-sm font-medium" style={{ color: "var(--pl-text-muted)" }}>
            © 2026 <a href="https://truepropagents.com/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-[var(--pl-accent-primary)] transition-colors">True Prop Agents</a> · Pakistan
        </p>
    );

    return (
        <PreLauncherLayout wide={true} topbarPosition="top" footer={footerContent}>
            <div className="flex-1 flex flex-col py-4 max-w-4xl mx-auto w-full space-y-6">

                {/* Back to Dashboard Navigation Link */}
                <div>
                    <Link
                        href="/home"
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--pl-text-secondary)] hover:text-[var(--pl-accent-primary)] transition-colors px-3 py-1.5 rounded-xl border border-[var(--pl-border-subtle)] bg-[var(--pl-bg-card)] hover:border-[#8C56FC]/40"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </Link>
                </div>

                {/* Hero Header Section */}
                <div className="text-center space-y-3 py-2">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#f59e0b]/15 via-[#8C56FC]/15 to-[#10b981]/15 border border-[#f59e0b]/30 shadow-xs">
                        <Trophy className="w-4 h-4 text-[#f59e0b]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#f59e0b]">
                            Hall of Champions
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--pl-text-primary)]">
                        Lucky Wheel <span className="bg-gradient-to-r from-[#f59e0b] via-[#8C56FC] to-[#10b981] bg-clip-text text-transparent">Winners</span>
                    </h1>

                    <p className="text-xs sm:text-sm text-[var(--pl-text-secondary)] max-w-lg mx-auto leading-relaxed">
                        Meet our verified early access members who successfully spun the wheel and secured cash rewards.
                    </p>
                </div>

                {/* Winners Card / List Container */}
                <div className="pl-glass-card p-4 sm:p-6 border border-[#8C56FC]/20 shadow-[0_16px_40px_rgba(0,0,0,0.06)] space-y-4">
                    
                    {/* Subheader with Total Counter */}
                    <div className="flex items-center justify-between border-b border-[var(--pl-border-subtle)] pb-3">
                        <div className="flex items-center gap-2">
                            <Gift className="w-4 h-4 text-[#8C56FC]" />
                            <span className="text-xs sm:text-sm font-bold text-[var(--pl-text-primary)]">
                                Verified Winners List
                            </span>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#8C56FC]/10 text-[#8C56FC] border border-[#8C56FC]/20">
                            {isLoading ? "Loading..." : `${totalCount} Winners Recorded`}
                        </span>
                    </div>

                    {/* Loading Shimmer State */}
                    {isLoading ? (
                        <div className="space-y-3 py-2">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <div key={n} className="p-3.5 rounded-xl border border-[var(--pl-border-subtle)] pl-shimmer flex items-center justify-between h-14" />
                            ))}
                        </div>
                    ) : winners.length === 0 ? (
                        /* Empty State */
                        <div className="text-center py-12 space-y-3">
                            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#f59e0b]/10 border border-[#f59e0b]/20 flex items-center justify-center text-[#f59e0b]">
                                <Trophy className="w-7 h-7" />
                            </div>
                            <h3 className="text-base font-bold text-[var(--pl-text-primary)]">
                                Be the Next Lucky Winner!
                            </h3>
                            <p className="text-xs text-[var(--pl-text-secondary)] max-w-sm mx-auto">
                                The lucky wheel resets every 24 hours. Spin today for your chance to join the winners board!
                            </p>
                            <div className="pt-2">
                                <Link
                                    href="/home"
                                    className="pl-btn pl-btn-primary inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-xl"
                                    style={{ width: "auto" }}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>Spin Wheel Now</span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* Winners List Items */
                        <div className="divide-y divide-[var(--pl-border-subtle)]">
                            {winners.map((winner, idx) => {
                                const wonDate = winner.wonAt
                                    ? new Date(winner.wonAt).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric"
                                      })
                                    : "Recently";

                                return (
                                    <div
                                        key={winner.id || idx}
                                        className="py-3.5 sm:py-4 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors rounded-xl px-2 sm:px-3"
                                    >
                                        {/* Left Side: Avatar & Masked Name & Badge */}
                                        <div className="flex items-center gap-3 min-w-0">
                                            {/* Position / Trophy Icon */}
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm"
                                                style={{
                                                    background:
                                                        idx === 0
                                                            ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                                                            : idx === 1
                                                            ? "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)"
                                                            : idx === 2
                                                            ? "linear-gradient(135deg, #b45309 0%, #78350f 100%)"
                                                            : "rgba(140, 86, 252, 0.12)",
                                                    color: idx < 3 ? "#ffffff" : "#8C56FC",
                                                    border: idx < 3 ? "none" : "1px solid rgba(140, 86, 252, 0.25)"
                                                }}
                                            >
                                                {idx === 0 ? <Crown className="w-5 h-5" /> : idx < 3 ? <Trophy className="w-4 h-4" /> : `#${idx + 1}`}
                                            </div>

                                            {/* Winner Info */}
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-bold text-sm sm:text-base text-[var(--pl-text-primary)] truncate">
                                                        {winner.name}
                                                    </span>
                                                    <VerifiedBadge size="xs" />
                                                    <span
                                                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                                                        style={{
                                                            background:
                                                                winner.userType === "agent"
                                                                    ? "rgba(255, 137, 1, 0.15)"
                                                                    : "rgba(140, 86, 252, 0.15)",
                                                            color: winner.userType === "agent" ? "#FF8901" : "#8C56FC"
                                                        }}
                                                    >
                                                        {winner.userType === "agent" ? "Partner Agent" : "Early VIP"}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1.5 text-[11px] text-[var(--pl-text-muted)] mt-0.5">
                                                    <Calendar className="w-3 h-3 text-[#8C56FC]" />
                                                    <span>Won on {wonDate}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Winner Status Badge (WITHOUT showing reward amount) */}
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span
                                                className={`text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1.5 ${
                                                    winner.status === "completed"
                                                        ? "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30"
                                                        : "bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30"
                                                }`}
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span>{winner.status === "completed" ? "Reward Sent" : "Verified Winner"}</span>
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer Callout */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#8C56FC]/10 to-[#FF8901]/10 border border-[#8C56FC]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
                    <div className="space-y-0.5">
                        <h4 className="text-xs sm:text-sm font-bold text-[var(--pl-text-primary)]">
                            Want to get your name on this leaderboard?
                        </h4>
                        <p className="text-[11px] sm:text-xs text-[var(--pl-text-secondary)]">
                            Log in every 24 hours to claim your free daily lucky spin!
                        </p>
                    </div>
                    <Link
                        href="/home"
                        className="pl-btn pl-btn-primary text-xs font-semibold py-2 px-4 rounded-xl flex-shrink-0 self-center sm:self-auto"
                        style={{ width: "auto" }}
                    >
                        Try Your Luck →
                    </Link>
                </div>

            </div>
        </PreLauncherLayout>
    );
}
