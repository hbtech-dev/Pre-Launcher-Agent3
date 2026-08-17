"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { secureStorage } from "@/utils/secureStorage";
import { statsAPI } from "@/config/api";
import PreLauncherLayout from "@/components/PreLauncherLayout";
import CountdownTimer from "@/components/CountdownTimer";
import DailyReward from "@/components/DailyReward";
import ProgressMap from "@/components/ProgressMap";
import {
    ShieldCheck,
    User,
    LogOut,
    Sparkles,
    Building2,
    MapPin,
    Bell,
    Users,
    Activity,
    Layers,
    Share2,
    Mail,
    Send,
    TrendingUp
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const LAUNCH_DATE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

const ANNOUNCEMENTS = [
    {
        icon: "📱",
        title: "Agent3 Mobile App in Final Testing",
        desc: "Native iOS & Android builds have entered closed internal beta. Push notification pipeline and WebRTC audio/video calling are fully operational.",
        tag: "Mobile App",
        badgeColor: "#8C56FC",
        date: "Today"
    },
    {
        icon: "🤖",
        title: "TrueProp Agent AI Assistant Integrated",
        desc: "Automated real estate valuation and conversational lead qualifying engine powered by TrueProp intelligence is now live.",
        tag: "AI Engine",
        badgeColor: "#FF8901",
        date: "Yesterday"
    },
    {
        icon: "🗺️",
        title: "Interactive Masterplan Maps for F-11 & DHA",
        desc: "High-precision vector overlays and plot-by-plot data points available for Islamabad and Rawalpindi prime sectors.",
        tag: "Maps System",
        badgeColor: "#10b981",
        date: "Aug 14"
    },
    {
        icon: "💳",
        title: "Bank-Grade In-App Escrow Wallet",
        desc: "Secure end-to-end tokenized payment gateway configured for instant booking reservations and verified agent payouts.",
        tag: "FinTech",
        badgeColor: "#8C56FC",
        date: "Aug 12"
    }
];

export default function HomePage() {
    const router = useRouter();
    const [user, setUser] = useState({});
    const [role, setRole] = useState("user");
    const [copied, setCopied] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [liveStats, setLiveStats] = useState({
        totalUsers: null,
        verifiedAgents: null,
        totalAgents: null,
        mappedSocieties: null,
        totalProperties: null,
        platformStatus: "80%"
    });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const session = secureStorage.getUserSession();
        const profile = secureStorage.getUserProfile?.() || {};

        if (!session || !session.token) {
            router.replace("/welcome");
            return;
        }

        setIsAuthenticated(true);
        setIsCheckingAuth(false);
        setRole(session.userType || session.role || "user");
        setUser(profile);

        // Fetch real-time live platform statistics from database
        const fetchLiveStats = async () => {
            try {
                const res = await statsAPI.getStats();
                if (res && res.status === "success" && res.data) {
                    setLiveStats(res.data);
                }
            } catch (err) {
                console.error("Live stats fetch error:", err);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchLiveStats();
    }, [router]);

    const handleLogout = () => {
        secureStorage.clearAll?.();
        router.push("/welcome");
    };

    const handleShare = () => {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(window.location.origin + "/welcome");
            setCopied(true);
            toast.success("Invite link copied to clipboard!");
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const displayName = user.fullName || user.name || (role === "agent" ? "Verified Agent" : "Valued Member");
    const displayEmail = user.email || "Registered Member";
    const displayCity = user.operatingCity || user.location || (user.residentialAddress?.permanent ? user.residentialAddress.permanent.split(",").pop().trim() : "Islamabad / Rawalpindi");

    // Dynamic metrics based on REAL database values
    const metrics = [
        {
            label: "Early Signups",
            value: liveStats.totalUsers !== null ? `${liveStats.totalUsers.toLocaleString()}` : "...",
            change: "Real-time registered users",
            icon: Users,
            color: "#8C56FC",
            bg: "rgba(140, 86, 252, 0.12)",
            trend: "up"
        },
        {
            label: "Verified Agents",
            value: liveStats.verifiedAgents !== null ? `${liveStats.verifiedAgents.toLocaleString()}` : "...",
            change: liveStats.totalAgents !== null ? `Out of ${liveStats.totalAgents} registered` : "KYC Approved Agents",
            icon: ShieldCheck,
            color: "#FF8901",
            bg: "rgba(255, 137, 1, 0.12)",
            trend: "up"
        },
        {
            label: "Mapped Societies",
            value: liveStats.mappedSocieties !== null ? `${liveStats.mappedSocieties.toLocaleString()}` : "...",
            change: "Masterplans & Plots",
            icon: Layers,
            color: "#10b981",
            bg: "rgba(16, 185, 129, 0.12)",
            trend: "neutral"
        },
        {
            label: "Platform Status",
            value: "80% Ready",
            change: "Phase 3: Testing & Polish",
            icon: Activity,
            color: "#38bdf8",
            bg: "rgba(56, 189, 248, 0.12)",
            trend: "live"
        },
    ];

    if (isCheckingAuth || !isAuthenticated) {
        return (
            <PreLauncherLayout wide={true}>
                <div className="flex-1 flex items-center justify-center min-h-[50vh]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-[#8C56FC] border-t-transparent animate-spin" />
                        <span className="text-xs text-[var(--pl-text-muted)] font-medium">Verifying authorization...</span>
                    </div>
                </div>
            </PreLauncherLayout>
        );
    }

    return (
        <PreLauncherLayout wide={true}>
            <Toaster position="top-center" />
            <div className="flex-1 flex flex-col py-2 space-y-6">

                {/* Top Profile Card with Embedded Countdown Timer */}
                <div className="pl-glass-card p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Left: User / Agent Info */}
                    <div className="flex items-center gap-4">
                        <div
                            className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white font-semibold text-xl shadow-lg flex-shrink-0"
                            style={{
                                background: role === "agent"
                                    ? "linear-gradient(135deg, #FF8901 0%, #d97000 100%)"
                                    : "linear-gradient(135deg, #8C56FC 0%, #6e3dd9 100%)"
                            }}
                        >
                            {role === "agent" ? <Building2 className="w-7 h-7" /> : <User className="w-7 h-7" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="font-semibold text-lg sm:text-2xl text-[var(--pl-text-primary)]">
                                    {displayName}
                                </h1>
                                <span
                                    className="pl-badge text-xs px-2.5 py-1"
                                    style={{
                                        background: role === "agent" ? "rgba(255, 137, 1, 0.15)" : "rgba(140, 86, 252, 0.15)",
                                        color: role === "agent" ? "#FF8901" : "#8C56FC"
                                    }}
                                >
                                    {role === "agent" ? "🛡️ Verified Partner Agent" : "🌟 Early VIP Customer"}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs sm:text-sm text-[var(--pl-text-secondary)] mt-1.5 flex-wrap">
                                <span className="flex items-center gap-1">
                                    <Mail className="w-3.5 h-3.5 text-[#8C56FC]" /> {displayEmail}
                                </span>
                                <span className="opacity-40">•</span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-[#FF8901]" /> {displayCity}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Embedded Live Countdown Timer & Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:self-center">
                        <div className="flex flex-col items-start sm:items-end justify-center">
                            <CountdownTimer targetDate={LAUNCH_DATE} compact={true} />
                        </div>

                        <div className="flex items-center gap-2 self-stretch sm:self-auto pt-2 sm:pt-0 sm:border-l sm:border-[var(--pl-border-subtle)] sm:pl-4">
                            <button
                                type="button"
                                onClick={handleShare}
                                className="pl-btn pl-btn-outline flex-1 sm:flex-initial"
                                style={{ width: "auto", padding: "8px 14px", fontSize: "12px" }}
                            >
                                <Share2 className="w-3.5 h-3.5 text-[#8C56FC]" />
                                <span>{copied ? "Copied!" : "Invite"}</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="pl-btn pl-btn-outline flex-1 sm:flex-initial"
                                style={{ width: "auto", padding: "8px 14px", fontSize: "12px" }}
                                title="Sign Out"
                            >
                                <LogOut className="w-3.5 h-3.5 text-red-400" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Real Data Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={i}
                                className="pl-glass-card p-4 sm:p-5 flex flex-col justify-between hover:border-[#8C56FC] hover:shadow-lg transition-all"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-[var(--pl-text-muted)]">{stat.label}</span>
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: stat.bg, color: stat.color }}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--pl-text-primary)]">
                                        {stat.value}
                                    </div>
                                    <div className="flex items-center gap-1 text-[11px] font-medium text-[var(--pl-text-secondary)] mt-1">
                                        {stat.trend === "up" && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                                        {stat.trend === "live" && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse inline-block" />}
                                        <span className="truncate">{stat.change}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main 2-Column Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Main Column (7 Cols on desktop) */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* Development Progress Roadmap */}
                        <div className="pl-glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-base sm:text-lg font-semibold text-[var(--pl-text-primary)] flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-[#8C56FC]" />
                                        Development & Rollout Roadmap
                                    </h2>
                                    <p className="text-xs text-[var(--pl-text-secondary)] mt-0.5">
                                        Live backend and product infrastructure milestones
                                    </p>
                                </div>
                                <span className="pl-badge text-xs" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                                    Phase 3 of 4
                                </span>
                            </div>

                            <ProgressMap />
                        </div>

                        {/* Early Feedback & Support Card */}
                        <div className="pl-glass-card p-5 bg-gradient-to-br from-[rgba(140,86,252,0.08)] to-[rgba(255,137,1,0.06)]">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold text-sm text-[var(--pl-text-primary)] mb-1 flex items-center gap-2">
                                        <Send className="w-4 h-4 text-[#8C56FC]" />
                                        Have Early Feedback or Feature Requests?
                                    </h3>
                                    <p className="text-xs text-[var(--pl-text-secondary)] leading-relaxed">
                                        Help us shape Agent3 into Pakistan&apos;s ultimate real estate platform. We review every community suggestion.
                                    </p>
                                </div>
                                <a
                                    href="mailto:tpa.ofe@gmail.com?subject=Agent3 Pre-Launcher Feedback"
                                    className="pl-btn pl-btn-outline text-xs flex-shrink-0"
                                    style={{ width: "auto", padding: "8px 14px", textDecoration: "none" }}
                                >
                                    Contact Team →
                                </a>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (5 Cols on desktop) */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Interactive Daily Pre-Launch Rewards & Credit Vault */}
                        <DailyReward role={role} />

                        {/* Announcements & Platform Live Feed */}
                        <div className="pl-glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-semibold text-[var(--pl-text-primary)] flex items-center gap-2">
                                    <Bell className="w-4 h-4 text-[#8C56FC]" />
                                    Platform Updates
                                </h2>
                                <span className="text-[11px] text-[var(--pl-text-muted)] font-medium">Live Feed</span>
                            </div>

                            <div className="space-y-3.5">
                                {ANNOUNCEMENTS.map((item, i) => (
                                    <div
                                        key={i}
                                        className="p-3.5 rounded-xl border border-[var(--pl-border-subtle)] bg-[var(--pl-bg-input)] hover:border-[#8C56FC] transition-all"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl flex-shrink-0">{item.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-1 mb-1">
                                                    <span className="text-xs font-semibold text-[var(--pl-text-primary)] truncate">
                                                        {item.title}
                                                    </span>
                                                    <span
                                                        className="text-[9px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                                                        style={{ background: `${item.badgeColor}18`, color: item.badgeColor }}
                                                    >
                                                        {item.tag}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-[var(--pl-text-secondary)] leading-relaxed">
                                                    {item.desc}
                                                </p>
                                                <span className="text-[10px] text-[var(--pl-text-muted)] mt-1.5 block">
                                                    {item.date} • Verified by Admin
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="text-center pt-6 pb-4 border-t" style={{ borderColor: "var(--pl-border-subtle)" }}>
                    <p className="text-xs text-[var(--pl-text-muted)]">
                        © 2026 Agent3 Technologies Ltd. • Connected to Production Cloud • All rights reserved.
                    </p>
                </div>
            </div>
        </PreLauncherLayout>
    );
}
