"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { secureStorage } from "@/utils/secureStorage";
import { statsAPI, phoneVerificationAPI } from "@/config/api";
import PreLauncherLayout from "@/components/PreLauncherLayout";
import CountdownTimer from "@/components/CountdownTimer";
import ProgressMap from "@/components/ProgressMap";
import LuckyWheel from "@/components/LuckyWheel";
import VerifiedBadge from "@/components/VerifiedBadge";
import PhoneVerificationModal from "@/components/PhoneVerificationModal";
import HomeSkeleton from "@/components/HomeSkeleton";
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
    TrendingUp,
    PhoneCall,
    Bot,
    Hotel,
    Wallet,
    LayoutDashboard,
    PlaySquare,
    CheckCircle2,
    Zap,
    ChevronDown,
    ChevronUp,
    Compass
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const LAUNCH_DATE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

const PRIME_FEATURES = [
    {
        id: "ai-concierge",
        number: "01",
        icon: Bot,
        title: "AI Property Concierge & TrueProp™ Valuation",
        tag: "AI Powered",
        badgeColor: "#8C56FC",
        status: "Live Intelligence",
        desc: "Conversational AI assistant that understands your exact property needs, discovers tailored plots and homes instantly, and benchmarks property valuations with live market data.",
        highlights: ["Natural Language Matchmaking", "Instant Plot Price Estimates", "24/7 AI Virtual Assistant"]
    },
    {
        id: "webrtc-call",
        number: "02",
        icon: PhoneCall,
        title: "Pakistan's 1st In-App Chat & Direct Audio Calling",
        tag: "1st in Pakistan",
        badgeColor: "#FF8901",
        status: "PropTech 1st",
        desc: "End-to-end encrypted high-definition audio calling and real-time live chat connecting buyers, hosts, and verified partner agents directly within the app without revealing personal phone numbers.",
        highlights: ["Zero Personal Number Sharing", "Encrypted HD Audio Calling", "Real-Time Direct Agent Chat"]
    },
    {
        id: "verified-listings",
        number: "03",
        icon: ShieldCheck,
        title: "100% Authentic & KYC-Verified Property Listings",
        tag: "100% Verified",
        badgeColor: "#8C56FC",
        status: "Zero Fake Inventory",
        desc: "Every plot, residence, and commercial space is verified with authentic ownership records, precise dimension overlays, and strict admin KYC validation.",
        highlights: ["Verified Partner Agent Badges", "Interactive Vector Society Maps", "Zero Duplicate Listings"]
    },
    {
        id: "guest-stays",
        number: "04",
        icon: Hotel,
        title: "Global Guest Stays & Hotel Room Bookings",
        tag: "Airbnb Style",
        badgeColor: "#8C56FC",
        status: "Worldwide Stays",
        desc: "Integrated short-term stays, boutique hotel reservations, luxury serviced suites, and vacation rentals with instant calendar checkouts and host verification.",
        highlights: ["Instant Room Checkout", "Flexible Short & Long Stays", "Verified Check-in Protocols"]
    },
    {
        id: "escrow-wallet",
        number: "05",
        icon: Wallet,
        title: "Bank-Grade Escrow Vault & Smart Digital Wallet",
        tag: "Escrow Guarded",
        badgeColor: "#FF8901",
        status: "Tokenized Security",
        desc: "Protected in-app escrow wallet engineered for secure booking reservation tokens, digital property token deposits, and fraud-proof agent commission payouts.",
        highlights: ["Tokenized Settlement Gateway", "Escrow Down Payments", "Instant Refund Protection"]
    },
    {
        id: "agent-dashboard",
        number: "06",
        icon: LayoutDashboard,
        title: "Agent Pro CRM & Modern VIP Command Suite",
        tag: "VIP Pro Suite",
        badgeColor: "#8C56FC",
        status: "Enterprise Grade",
        desc: "A futuristic real estate CRM built for top agencies: live buyer lead queues, automated listing analytics, society plot overlays, and VIP verified agent badges.",
        highlights: ["Live Lead Queues & Inquiries", "Plot Coordinate Mapping Tools", "Agency Analytics Tracker"]
    },
    {
        id: "property-stories",
        number: "07",
        icon: PlaySquare,
        title: "Property Stories & Immersive 4K Video Reels",
        tag: "Visual Feed",
        badgeColor: "#8C56FC",
        status: "Dynamic 24h Feed",
        desc: "Instagram-style 24-hour property video reels, cinematic 4K drone walkthroughs, and neighborhood highlights for dynamic and visual property discovery.",
        highlights: ["24-Hour Ephemeral Stories", "4K Video Walkthroughs", "Neighborhood Highlights"]
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
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

    useEffect(() => {
        const session = secureStorage.getUserSession();
        const profile = secureStorage.getUserProfile?.() || {};

        if (!session || !session.token) {
            router.replace("/welcome");
            return;
        }

        setIsAuthenticated(true);
        setIsCheckingAuth(false);
        const currentUserRole = session.userType || session.role || "user";
        setRole(currentUserRole);
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

        // Check if user is WhatsApp phone verified (only for regular users; agents are verified automatically)
        const checkPhoneVerification = async () => {
            if (currentUserRole === "agent") {
                setIsPhoneVerified(true);
                return;
            }

            try {
                const res = await phoneVerificationAPI.getStatus();
                if (res && (res.status === "success" || res.success) && res.data) {
                    setIsPhoneVerified(Boolean(res.data.isVerified));
                }
            } catch (err) {
                console.error("Phone verification check error:", err);
            }
        };

        fetchLiveStats();
        checkPhoneVerification();
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
            value: liveStats.readinessPercent !== undefined ? `${liveStats.readinessPercent}% Ready` : (liveStats.platformStatus || "80% Ready"),
            change: liveStats.phaseSubtext || "Phase 3: Testing & Polish",
            icon: Activity,
            color: "#38bdf8",
            bg: "rgba(56, 189, 248, 0.12)",
            trend: "live"
        },
    ];

    if (isCheckingAuth || !isAuthenticated) {
        return <HomeSkeleton />;
    }

    return (
        <PreLauncherLayout wide={true}>
            <Toaster position="top-center" />
            <div className="flex-1 flex flex-col py-2 space-y-6">

                {/* 3D Sleek Top Profile Card with Centered Countdown Timer */}
                <div className="pl-glass-card p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 border border-[#8C56FC]/20 shadow-[0_16px_40px_rgba(0,0,0,0.06)] hover:border-[#8C56FC]/40 transition-all duration-300">
                    {/* Left Column: User / Agent Info */}
                    <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                        <div
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white font-semibold text-xl shadow-lg flex-shrink-0 ring-2 ring-[#8C56FC]/30"
                            style={{
                                background: role === "agent"
                                    ? "linear-gradient(135deg, #FF8901 0%, #d97000 100%)"
                                    : "linear-gradient(135deg, #8C56FC 0%, #6e3dd9 100%)"
                            }}
                        >
                            {role === "agent" ? <Building2 className="w-6 h-6 sm:w-7 sm:h-7" /> : <User className="w-6 h-6 sm:w-7 sm:h-7" />}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="font-semibold text-lg sm:text-2xl text-[var(--pl-text-primary)] flex items-center gap-1.5 truncate">
                                    <span>{displayName}</span>
                                    {role !== "agent" && isPhoneVerified && <VerifiedBadge size="sm" />}
                                </h1>
                                <span
                                    className="pl-badge text-xs px-2.5 py-1 font-semibold whitespace-nowrap"
                                    style={{
                                        background: role === "agent" ? "rgba(255, 137, 1, 0.15)" : "rgba(140, 86, 252, 0.15)",
                                        color: role === "agent" ? "#FF8901" : "#8C56FC"
                                    }}
                                >
                                    {role === "agent" ? "🛡️ Host / Partner Agent" : "🌟 Early VIP Customer"}
                                </span>

                                {role !== "agent" && !isPhoneVerified && (
                                    <button
                                        type="button"
                                        onClick={() => setIsVerificationModalOpen(true)}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#0095F6]/10 text-[#0095F6] border border-[#0095F6]/30 hover:bg-[#0095F6]/20 transition-all cursor-pointer whitespace-nowrap"
                                        title="Verify your WhatsApp number to unlock Lucky Wheel spins"
                                    >
                                        <VerifiedBadge size="xs" /> Get Verified Badge
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-xs sm:text-sm text-[var(--pl-text-secondary)] mt-1.5 flex-wrap">
                                <span className="flex items-center gap-1.5 font-medium truncate">
                                    <Mail className="w-3.5 h-3.5 text-[#8C56FC] flex-shrink-0" /> {displayEmail}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Center Column: Countdown Timer in the Exact Center */}
                    <div className="flex items-center justify-center flex-shrink-0 py-2 lg:py-0 lg:px-6">
                        <CountdownTimer targetDate={liveStats.launchDate || LAUNCH_DATE} compact={true} />
                    </div>

                    {/* Right Column: Actions (Original Invite Friends & Sign Out Buttons) */}
                    <div className="flex items-center justify-start lg:justify-end gap-2.5 flex-wrap sm:flex-nowrap flex-shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[var(--pl-border-subtle)]">
                        <button
                            type="button"
                            onClick={handleShare}
                            className="pl-btn pl-btn-outline flex-1 sm:flex-initial"
                            style={{ width: "auto", padding: "8px 16px", fontSize: "12px" }}
                        >
                            <Share2 className="w-3.5 h-3.5 text-[#8C56FC]" />
                            <span>{copied ? "Copied!" : "Invite Friends"}</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="pl-btn pl-btn-outline flex-1 sm:flex-initial"
                            style={{ width: "auto", padding: "8px 16px", fontSize: "12px" }}
                        >
                            <LogOut className="w-3.5 h-3.5 text-red-400" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>

                {/* Live Real Database Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map((metric, i) => {
                        const IconComponent = metric.icon;
                        return (
                            <div key={i} className="pl-glass-card p-4 sm:p-5 flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-200">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold text-[var(--pl-text-muted)] tracking-wide">
                                        {metric.label}
                                    </span>
                                    <div
                                        className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs"
                                        style={{ background: metric.bg, color: metric.color }}
                                    >
                                        <IconComponent className="w-4 h-4" />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xl sm:text-2xl font-bold text-[var(--pl-text-primary)] mb-1 flex items-baseline gap-1">
                                        {loadingStats && metric.value === "..." ? (
                                            <div className="h-7 w-20 pl-shimmer rounded my-0.5" />
                                        ) : (
                                            metric.value
                                        )}
                                    </div>
                                    <div className="text-[11px] text-[var(--pl-text-secondary)] flex items-center gap-1 font-medium">
                                        {metric.trend === "up" && <TrendingUp className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
                                        {metric.trend === "live" && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse flex-shrink-0 inline-block" />}
                                        <span className="truncate">{metric.change}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main 2-Column Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Left Column (6 Cols on desktop) — Roadmap & Support */}
                    <div className="lg:col-span-6 space-y-6">

                        {/* Development Progress Roadmap */}
                        <div className="pl-glass-card p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-base sm:text-lg font-semibold text-[var(--pl-text-primary)] flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-[#8C56FC]" />
                                        Development &amp; Rollout Roadmap
                                    </h2>
                                    <p className="text-xs text-[var(--pl-text-secondary)] mt-0.5">
                                        Live backend and product infrastructure milestones
                                    </p>
                                </div>
                                <span className="pl-badge text-xs" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                                    {liveStats.phaseTitle || "Phase 3 of 4"}
                                </span>
                            </div>

                            <ProgressMap />
                        </div>

                        {/* Early Feedback & Support Card */}
                        <div className="pl-glass-card p-5 bg-gradient-to-br from-[rgba(140,86,252,0.08)] to-[rgba(255,137,1,0.06)] border border-[#8C56FC]/20">
                            <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-sm sm:text-base text-[var(--pl-text-primary)] mb-1.5 flex items-center gap-2">
                                        <Send className="w-4 h-4 text-[#8C56FC] flex-shrink-0" />
                                        <span>Have Early Feedback or Feature Requests?</span>
                                    </h3>
                                    <p className="text-xs sm:text-sm text-[var(--pl-text-secondary)] leading-relaxed">
                                        Help us shape Agent3 into Pakistan&apos;s ultimate real estate platform. We review every community suggestion.
                                    </p>
                                </div>
                                <div className="flex-shrink-0 pt-1 2xl:pt-0">
                                    <a
                                        href="https://wa.me/923307864445?text=Hello%20TrueProp%20Agent,%20I%20am%20reaching%20out%20from%20Agent3%20Early%20Access."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pl-btn pl-btn-outline text-xs sm:text-sm font-semibold inline-flex items-center justify-center whitespace-nowrap text-center"
                                        style={{ width: "auto", padding: "10px 18px", textDecoration: "none" }}
                                    >
                                        Chat with TrueProp Agent →
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (6 Cols on desktop) — Futuristic 3D Feature Pathway */}
                    <div className="lg:col-span-6 space-y-6">

                        {/* 3D Platform Updates & Prime Features Pathway */}
                        <div className="pl-glass-card p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-[#8C56FC]/15 flex items-center justify-center text-[#8C56FC]">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <h2 className="text-base sm:text-lg font-semibold text-[var(--pl-text-primary)]">
                                            Platform Updates &amp; Core Innovations
                                        </h2>
                                    </div>
                                    <p className="text-xs text-[var(--pl-text-secondary)] mt-0.5">
                                        Hover any module below to explore feature architecture
                                    </p>
                                </div>
                                <span className="pl-badge text-xs self-start sm:self-auto" style={{ background: "rgba(140, 86, 252, 0.15)", color: "#8C56FC" }}>
                                    <Zap className="w-3 h-3 inline mr-1" /> 7 Prime Modules
                                </span>
                            </div>

                            {/* Connected 3D Feature Pathway with Hover-Expand (Minimal View by Default) */}
                            <div className="space-y-3">
                                {PRIME_FEATURES.map((feat) => {
                                    const IconComponent = feat.icon;

                                    return (
                                        <div 
                                            key={feat.id}
                                            className="pl-feature-compact-card group cursor-pointer"
                                        >
                                            {/* Minimalist Heading View (Always Visible) */}
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    {/* Compact Icon */}
                                                    <div 
                                                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-110"
                                                        style={{ 
                                                            background: `linear-gradient(135deg, ${feat.badgeColor}22 0%, ${feat.badgeColor}08 100%)`,
                                                            border: `1.5px solid ${feat.badgeColor}40`,
                                                            color: feat.badgeColor
                                                        }}
                                                    >
                                                        <IconComponent className="w-4 h-4" />
                                                    </div>

                                                    {/* Number & Title */}
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span className="pl-feature-num flex-shrink-0">
                                                            {feat.number}
                                                        </span>
                                                        <h3 className="text-xs sm:text-sm font-semibold text-[var(--pl-text-primary)] truncate group-hover:text-[#8C56FC] transition-colors">
                                                            {feat.title}
                                                        </h3>
                                                    </div>
                                                </div>

                                                {/* Badge / Status */}
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <span
                                                        className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                                                        style={{ 
                                                            background: `${feat.badgeColor}18`, 
                                                            color: feat.badgeColor,
                                                            border: `1px solid ${feat.badgeColor}33`
                                                        }}
                                                    >
                                                        {feat.tag}
                                                    </span>
                                                    <span className="text-[10px] text-[var(--pl-text-muted)] group-hover:text-[#8C56FC] transition-colors hidden sm:inline">
                                                        Hover ▾
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Collapsible Details Drawer (Reveals On HOVER) */}
                                            <div className="pl-hover-drawer">
                                                <div className="pt-2.5 border-t border-[var(--pl-border-subtle)] space-y-2.5">
                                                    <p className="text-xs text-[var(--pl-text-secondary)] leading-relaxed pl-1">
                                                        {feat.desc}
                                                    </p>

                                                    {/* Highlights Grid */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] pl-1">
                                                        {feat.highlights.map((bullet, bIdx) => (
                                                            <div key={bIdx} className="flex items-center gap-1.5 text-[var(--pl-text-muted)]">
                                                                <CheckCircle2 className="w-3 h-3 text-[#8C56FC] flex-shrink-0" />
                                                                <span className="truncate">{bullet}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Status Bar */}
                                                    <div className="flex items-center justify-between pt-1 text-[10px] text-[var(--pl-text-muted)]">
                                                        <div className="flex items-center gap-1.5">
                                                            <span 
                                                                className="pl-live-dot"
                                                                style={{ background: feat.badgeColor }}
                                                            />
                                                            <span className="font-semibold uppercase tracking-wider" style={{ color: feat.badgeColor }}>
                                                                {feat.status}
                                                            </span>
                                                        </div>
                                                        <span className="text-[#8C56FC] font-semibold">
                                                            Verified Architecture →
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="text-center pt-6 pb-4 border-t" style={{ borderColor: "var(--pl-border-subtle)" }}>
                    <div className="flex justify-center items-center gap-4 mb-2 text-xs flex-wrap">
                        <Link href="/winners" className="pl-link hover:underline text-[#8C56FC] font-semibold flex items-center gap-1" style={{ fontSize: "11px", textDecoration: "none" }}>
                            <span>🏆 Lucky Winners</span>
                        </Link>
                        <span className="text-[var(--pl-text-muted)] opacity-40 text-[11px]">•</span>
                        <Link href="/privacy" target="_blank" className="pl-link hover:underline text-[var(--pl-text-muted)]" style={{ color: "var(--pl-text-muted)", fontSize: "11px", textDecoration: "none" }}>
                            Privacy Policy &amp; Data Protection
                        </Link>
                        <span className="text-[var(--pl-text-muted)] opacity-40 text-[11px]">•</span>
                        <Link href="/terms" target="_blank" className="pl-link hover:underline text-[var(--pl-text-muted)]" style={{ color: "var(--pl-text-muted)", fontSize: "11px", textDecoration: "none" }}>
                            Terms &amp; Conditions
                        </Link>
                    </div>
                    <p className="text-xs text-[var(--pl-text-muted)]" style={{ fontSize: "11px" }}>
                        © 2026 <a href="https://truepropagents.com/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-[var(--pl-text-primary)] transition-colors">True Prop Agents</a> • Connected to Production Cloud • All rights reserved.
                    </p>
                </div>
            </div>

            {/* Floating Lucky Spin Wheel */}
            <LuckyWheel
                isVerified={role === "agent" || isPhoneVerified}
                onOpenVerification={() => setIsVerificationModalOpen(true)}
            />

            {/* WhatsApp Phone Verification Modal */}
            <PhoneVerificationModal
                isOpen={isVerificationModalOpen}
                onClose={() => setIsVerificationModalOpen(false)}
                onVerified={() => setIsPhoneVerified(true)}
            />
        </PreLauncherLayout>
    );
}

