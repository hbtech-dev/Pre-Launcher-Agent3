"use client";
import { useState, useEffect } from "react";
import {
    Gift,
    Sparkles,
    CheckCircle2,
    Clock,
    Zap,
    Coins,
    Award,
    TrendingUp,
    ChevronDown,
    ChevronUp,
    ShieldCheck,
    Bot,
    Compass
} from "lucide-react";
import toast from "react-hot-toast";

const STREAK_DAYS = [
    { day: 1, points: 50, label: "Day 1", icon: "🪙" },
    { day: 2, points: 100, label: "Day 2", icon: "🪙" },
    { day: 3, points: 150, label: "Day 3", icon: "💎" },
    { day: 4, points: 200, label: "Day 4", icon: "🪙" },
    { day: 5, points: 300, label: "Day 5", icon: "💎" },
    { day: 6, points: 500, label: "Day 6", icon: "🔥" },
    { day: 7, points: 1000, label: "Day 7", isMega: true, icon: "👑" },
];

const REDEEM_PERKS = [
    {
        icon: Zap,
        title: "Featured Listing Boosts",
        desc: "Pin your properties to the top of search results for maximum buyer views.",
        cost: "250 Credits / Boost",
        color: "#8C56FC"
    },
    {
        icon: Bot,
        title: "TrueProp AI Valuations",
        desc: "Instant automated market pricing & investment return reports on any plot.",
        cost: "100 Credits / Report",
        color: "#FF8901"
    },
    {
        icon: ShieldCheck,
        title: "VIP Verified Partner Badge",
        desc: "Exclusive golden verification trust badge on your public agent profile.",
        cost: "500 Credits / Month",
        color: "#10b981"
    },
    {
        icon: Compass,
        title: "Masterplan Plot Coordinates",
        desc: "Full vector boundary & landmark overlay exports for Islamabad & Rawalpindi.",
        cost: "150 Credits / Map",
        color: "#38bdf8"
    }
];

export default function DailyReward({ role = "user" }) {
    const [streak, setStreak] = useState(1);
    const [totalCredits, setTotalCredits] = useState(150);
    const [isClaimedToday, setIsClaimedToday] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");
    const [showPerks, setShowPerks] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    const [celebrateDay, setCelebrateDay] = useState(null);

    // Initialize streak and credits from localStorage
    useEffect(() => {
        try {
            const savedCredits = localStorage.getItem("pl_reward_credits");
            const savedStreak = localStorage.getItem("pl_reward_streak");
            const lastClaimDate = localStorage.getItem("pl_reward_last_claim");

            const todayStr = new Date().toISOString().split("T")[0];

            if (savedCredits !== null) {
                setTotalCredits(parseInt(savedCredits, 10) || 0);
            } else {
                // Initial bonus for new visitors
                setTotalCredits(150);
                localStorage.setItem("pl_reward_credits", "150");
            }

            if (savedStreak !== null) {
                setStreak(parseInt(savedStreak, 10) || 1);
            }

            if (lastClaimDate === todayStr) {
                setIsClaimedToday(true);
            } else {
                setIsClaimedToday(false);
            }
        } catch (err) {
            console.error("Reward storage load error:", err);
        }
    }, []);

    // Live countdown timer until next midnight claim window
    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const diff = tomorrow.getTime() - now.getTime();
            if (diff <= 0) {
                setIsClaimedToday(false);
                setTimeLeft("Available Now!");
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(
                `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`
            );
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleClaim = () => {
        if (isClaimedToday || isClaiming) return;

        setIsClaiming(true);
        const currentReward = STREAK_DAYS[Math.min(streak - 1, 6)];
        const pointsToAdd = currentReward.points;

        const nextStreak = streak >= 7 ? 1 : streak + 1;
        const nextCredits = totalCredits + pointsToAdd;
        const todayStr = new Date().toISOString().split("T")[0];

        setTimeout(() => {
            setTotalCredits(nextCredits);
            setStreak(nextStreak);
            setIsClaimedToday(true);
            setIsClaiming(false);
            setCelebrateDay(currentReward.day);

            localStorage.setItem("pl_reward_credits", String(nextCredits));
            localStorage.setItem("pl_reward_streak", String(nextStreak));
            localStorage.setItem("pl_reward_last_claim", todayStr);

            toast.success(`🎉 Claimed +${pointsToAdd} Pre-Launch Credits!`, {
                duration: 4000,
                style: {
                    background: "#0f1422",
                    color: "#fff",
                    border: "1px solid #8C56FC",
                }
            });

            setTimeout(() => setCelebrateDay(null), 3000);
        }, 600);
    };

    const currentDayReward = STREAK_DAYS[Math.min(streak - 1, 6)];

    return (
        <div className="pl-glass-card p-5 sm:p-6 relative overflow-hidden">
            {/* Header with Title & Vault Balance */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[rgba(255,137,1,0.12)] text-[#FF8901] flex items-center justify-center">
                            <Gift className="w-4 h-4" />
                        </div>
                        <h2 className="text-base sm:text-lg font-semibold text-[var(--pl-text-primary)]">
                            Daily Pre-Launch Rewards
                        </h2>
                        <span className="pl-badge text-[10px] px-2 py-0.5" style={{ background: "rgba(140,86,252,0.15)", color: "#8C56FC" }}>
                            <Sparkles className="w-3 h-3 inline mr-1" /> Redeem at Launch
                        </span>
                    </div>
                    <p className="text-xs text-[var(--pl-text-secondary)] mt-1">
                        Log in daily to stack free platform credits before official launch.
                    </p>
                </div>

                {/* Pre-Launch Credit Vault Box */}
                <div className="p-2.5 px-4 rounded-xl bg-gradient-to-r from-[rgba(140,86,252,0.15)] to-[rgba(255,137,1,0.12)] border border-[#8C56FC]/30 flex items-center gap-3 self-start sm:self-auto shadow-sm">
                    <Coins className="w-5 h-5 text-[#FF8901]" />
                    <div>
                        <div className="text-[10px] uppercase font-semibold text-[var(--pl-text-muted)] tracking-wider">
                            Reward Vault
                        </div>
                        <div className="text-base font-bold text-[var(--pl-text-primary)] leading-none">
                            {totalCredits.toLocaleString()} <span className="text-xs font-semibold text-[#8C56FC]">Credits</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 7-Day Streak Road */}
            <div className="mb-5">
                <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-medium text-[var(--pl-text-secondary)] flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" />
                        {streak >= 7 ? "🔥 Mega 7-Day Streak Complete!" : `Day ${streak} of 7 Streak`}
                    </span>
                    <span className="text-[11px] text-[var(--pl-text-muted)]">
                        {isClaimedToday ? "Next reward resets at midnight" : "Claim today to keep your streak"}
                    </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {STREAK_DAYS.map((item) => {
                        const isDone = item.day < streak || (item.day === streak && isClaimedToday);
                        const isCurrent = item.day === streak && !isClaimedToday;
                        const isUpcoming = item.day > streak;

                        return (
                            <div
                                key={item.day}
                                className={`p-2 sm:p-2.5 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${
                                    isDone
                                        ? "border-[#10b981]/40 bg-[rgba(16,185,129,0.08)] text-[#10b981]"
                                        : isCurrent
                                        ? "border-[#8C56FC] bg-[rgba(140,86,252,0.15)] shadow-[0_0_15px_rgba(140,86,252,0.25)] scale-[1.03]"
                                        : "border-[var(--pl-border-subtle)] bg-[var(--pl-bg-input)] opacity-60"
                                }`}
                            >
                                <span className="text-[10px] font-semibold mb-1 opacity-80">
                                    {item.label}
                                </span>

                                <div className="text-xl my-1 relative">
                                    {isDone ? (
                                        <CheckCircle2 className="w-6 h-6 text-[#10b981]" />
                                    ) : (
                                        <span>{item.icon}</span>
                                    )}
                                </div>

                                <div className="text-[11px] font-bold text-[var(--pl-text-primary)]">
                                    +{item.points}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Claim Action Bar */}
            <div className="p-4 rounded-xl bg-[var(--pl-bg-input)] border border-[var(--pl-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(140,86,252,0.12)] flex items-center justify-center text-lg flex-shrink-0">
                        {isClaimedToday ? "✅" : "🎁"}
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-[var(--pl-text-primary)]">
                            {isClaimedToday
                                ? "Today's Reward Claimed!"
                                : `Today's Reward: +${currentDayReward.points} Platform Credits`}
                        </div>
                        <div className="text-[11px] text-[var(--pl-text-muted)] flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-[#FF8901]" />
                            {isClaimedToday
                                ? `Next unlock in: ${timeLeft}`
                                : "Tap claim to deposit credits into your launch vault"}
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleClaim}
                    disabled={isClaimedToday || isClaiming}
                    className={`pl-btn ${isClaimedToday ? "pl-btn-outline opacity-60" : "pl-btn-secondary"} w-full sm:w-auto text-xs`}
                    style={{
                        padding: "10px 22px",
                        whiteSpace: "nowrap",
                        minWidth: "160px"
                    }}
                >
                    {isClaiming ? (
                        "Depositing..."
                    ) : isClaimedToday ? (
                        `Claimed (${timeLeft.split(" ")[0] || "Done"})`
                    ) : (
                        `Claim +${currentDayReward.points} Credits ✨`
                    )}
                </button>
            </div>

            {/* Expandable "How to use these at Launch" Section */}
            <div className="mt-4 pt-3 border-t border-[var(--pl-border-subtle)]">
                <button
                    type="button"
                    onClick={() => setShowPerks(!showPerks)}
                    className="w-full flex items-center justify-between text-xs font-medium text-[var(--pl-text-secondary)] hover:text-[var(--pl-accent-primary)] transition-colors py-1"
                >
                    <span className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-[#8C56FC]" />
                        What can I redeem these credits for when Agent3 launches?
                    </span>
                    {showPerks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showPerks && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-2">
                        {REDEEM_PERKS.map((perk, i) => {
                            const Icon = perk.icon;
                            return (
                                <div
                                    key={i}
                                    className="p-3 rounded-xl border border-[var(--pl-border-subtle)] bg-[var(--pl-bg-primary)] flex items-start gap-3"
                                >
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                                        style={{ background: `${perk.color}18`, color: perk.color }}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1 mb-0.5">
                                            <span className="text-xs font-semibold text-[var(--pl-text-primary)]">
                                                {perk.title}
                                            </span>
                                            <span className="text-[10px] font-medium text-[#FF8901]">
                                                {perk.cost}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-[var(--pl-text-secondary)] leading-tight">
                                            {perk.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
