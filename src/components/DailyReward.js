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
    ChevronDown,
    ChevronUp,
    ShieldCheck,
    Bot,
    Compass,
    Lock,
    Unlock,
    X,
    ArrowRight,
    Flame,
    Crown
} from "lucide-react";
import toast from "react-hot-toast";

const WEEKS = [
    {
        week: 1,
        title: "Week 1",
        subtitle: "Starter Pack",
        points: 500,
        badge: "Early Adopter",
        iconComponent: Coins,
        color: "#8C56FC",
        bg: "rgba(140, 86, 252, 0.15)",
        perk: "+500 Platform Credits",
        desc: "Instant early supporter balance credited to your launch escrow wallet."
    },
    {
        week: 2,
        title: "Week 2",
        subtitle: "VIP Booster",
        points: 750,
        badge: "Power Member",
        iconComponent: Sparkles,
        color: "#FF8901",
        bg: "rgba(255, 137, 1, 0.15)",
        perk: "+750 Credits & AI Tokens",
        desc: "Unlocks 3 complimentary TrueProp AI property market valuation reports."
    },
    {
        week: 3,
        title: "Week 3",
        subtitle: "Elite Vault",
        points: 1250,
        badge: "Elite Partner",
        iconComponent: Flame,
        color: "#10b981",
        bg: "rgba(16, 185, 129, 0.15)",
        perk: "+1,250 Credits & Boost",
        desc: "Grants 1 Top-of-Search Featured Property Pin for 30 consecutive days."
    },
    {
        week: 4,
        title: "Week 4",
        subtitle: "Grand Launch",
        points: 2500,
        badge: "Founder Crate",
        iconComponent: Crown,
        color: "#f59e0b",
        bg: "rgba(245, 158, 11, 0.15)",
        isMega: true,
        perk: "+2,500 Credits & VIP Badge",
        desc: "Official Founding Member Golden Verification Badge + Maximum Launch Bonus."
    },
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
    const [currentWeek, setCurrentWeek] = useState(1);
    const [claimedWeeks, setClaimedWeeks] = useState([]);
    const [totalCredits, setTotalCredits] = useState(500);
    const [timeLeft, setTimeLeft] = useState("");
    const [showPerks, setShowPerks] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    const [claimedModalData, setClaimedModalData] = useState(null);

    // Initialize from localStorage
    useEffect(() => {
        try {
            const savedCredits = localStorage.getItem("pl_weekly_credits");
            const savedClaimedWeeks = localStorage.getItem("pl_claimed_weeks");
            const savedCurrentWeek = localStorage.getItem("pl_current_week");

            if (savedCredits !== null) {
                setTotalCredits(parseInt(savedCredits, 10) || 0);
            } else {
                setTotalCredits(500);
                localStorage.setItem("pl_weekly_credits", "500");
            }

            if (savedClaimedWeeks) {
                setClaimedWeeks(JSON.parse(savedClaimedWeeks));
            }

            if (savedCurrentWeek) {
                setCurrentWeek(parseInt(savedCurrentWeek, 10) || 1);
            }
        } catch (err) {
            console.error("Weekly rewards storage load error:", err);
        }
    }, []);

    // Live countdown timer until next week unlock
    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const dayOfWeek = now.getDay();
            const daysUntilNextSunday = (7 - dayOfWeek) % 7 || 7;
            const nextSunday = new Date(now);
            nextSunday.setDate(now.getDate() + daysUntilNextSunday);
            nextSunday.setHours(0, 0, 0, 0);

            const diff = nextSunday.getTime() - now.getTime();
            if (diff <= 0) {
                setTimeLeft("Next Week Unlocked!");
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(
                `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`
            );
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    const isCurrentWeekClaimed = claimedWeeks.includes(currentWeek);

    const handleClaimWeek = (weekObj) => {
        if (claimedWeeks.includes(weekObj.week) || weekObj.week > currentWeek || isClaiming) return;

        setIsClaiming(true);
        const pointsToAdd = weekObj.points;
        const newClaimed = [...claimedWeeks, weekObj.week];
        const newCredits = totalCredits + pointsToAdd;

        setTimeout(() => {
            setTotalCredits(newCredits);
            setClaimedWeeks(newClaimed);
            setIsClaiming(false);
            setClaimedModalData(weekObj);

            localStorage.setItem("pl_weekly_credits", String(newCredits));
            localStorage.setItem("pl_claimed_weeks", JSON.stringify(newClaimed));

            toast.success(`🎉 Unboxed ${weekObj.title} (+${pointsToAdd} Credits)!`, {
                duration: 4000,
                style: {
                    background: "#0f1422",
                    color: "#fff",
                    border: "1px solid #8C56FC",
                }
            });
        }, 500);
    };

    const activeWeekReward = WEEKS.find((w) => w.week === currentWeek) || WEEKS[0];
    const ActiveIcon = activeWeekReward.iconComponent;

    return (
        <>
            {/* ── CELEBRATION REWARD UNBOXING MODAL ── */}
            {claimedModalData && (
                <div className="pl-modal-backdrop" onClick={() => setClaimedModalData(null)}>
                    <div className="pl-modal-card" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            onClick={() => setClaimedModalData(null)}
                            className="absolute top-4 right-4 text-[var(--pl-text-muted)] hover:text-[var(--pl-text-primary)] p-1.5 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="pl-modal-icon-ring">
                            {(() => {
                                const ModalIcon = claimedModalData.iconComponent;
                                return <ModalIcon className="w-10 h-10" style={{ color: claimedModalData.color }} />;
                            })()}
                        </div>

                        <span className="pl-badge text-xs mb-2" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                            <Sparkles className="w-3.5 h-3.5 inline mr-1" /> {claimedModalData.badge} Unlocked
                        </span>

                        <h3 className="pl-heading text-xl sm:text-2xl mb-1">
                            {claimedModalData.title} Unboxed!
                        </h3>

                        <p className="text-xs sm:text-sm text-[var(--pl-text-secondary)] mb-5">
                            {claimedModalData.desc}
                        </p>

                        {/* Credits Added Callout */}
                        <div className="p-4 rounded-2xl bg-[var(--pl-bg-input)] border border-[#8C56FC]/30 mb-6 flex items-center justify-between">
                            <div className="text-left">
                                <span className="text-[10px] uppercase font-bold text-[var(--pl-text-muted)] tracking-wider">
                                    Reward Deposited
                                </span>
                                <div className="text-xl font-bold text-[#8C56FC]">
                                    +{claimedModalData.points.toLocaleString()} Credits
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] uppercase font-bold text-[var(--pl-text-muted)] tracking-wider">
                                    New Vault Total
                                </span>
                                <div className="text-xl font-bold text-[var(--pl-text-primary)]">
                                    {totalCredits.toLocaleString()} <span className="text-xs text-[#FF8901]">🪙</span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setClaimedModalData(null)}
                            className="pl-btn pl-btn-secondary w-full"
                        >
                            Deposit into Launch Vault <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                </div>
            )}

            {/* ── MAIN WEEKLY REWARDS CARD ── */}
            <div className="pl-glass-card p-5 sm:p-6 relative overflow-hidden">
                {/* Header with Title & Vault Balance */}
                <div className="flex flex-col gap-3 mb-5">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[rgba(140,86,252,0.2)] to-[rgba(255,137,1,0.15)] text-[#8C56FC] flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <Gift className="w-4 h-4" />
                                </div>
                                <h2 className="text-base sm:text-lg font-semibold text-[var(--pl-text-primary)]">
                                    Pre-Launch Weekly Rewards
                                </h2>
                            </div>
                            <p className="text-xs text-[var(--pl-text-secondary)] mt-1">
                                Claim your milestone reward crate once every week before official launch.
                            </p>
                        </div>

                        {/* Pre-Launch Credit Vault Capsule */}
                        <div className="pl-vault-capsule flex-shrink-0">
                            <Coins className="w-4 h-4 text-[#FF8901] flex-shrink-0" />
                            <div>
                                <div className="text-[9px] uppercase font-bold text-[var(--pl-text-muted)] tracking-wider">
                                    Vault
                                </div>
                                <div className="text-xs sm:text-sm font-bold text-[var(--pl-text-primary)] leading-none">
                                    {totalCredits.toLocaleString()} <span className="text-[10px] text-[#8C56FC]">pts</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4-Week Milestone Crates Grid — 2x2 spacious layout */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-5">
                    {WEEKS.map((w) => {
                        const isClaimed = claimedWeeks.includes(w.week);
                        const isCurrent = w.week === currentWeek && !isClaimed;
                        const isLocked = w.week > currentWeek;
                        const CrateIcon = w.iconComponent;

                        return (
                            <div
                                key={w.week}
                                onClick={() => isCurrent && handleClaimWeek(w)}
                                className={`pl-crate-card ${isClaimed ? "claimed" : isCurrent ? "active cursor-pointer" : "locked"}`}
                                style={{ minHeight: "150px" }}
                            >
                                {/* Top row with Week tag and status badge */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--pl-text-muted)]">
                                        {w.title}
                                    </span>
                                    {isClaimed ? (
                                        <div className="flex items-center gap-1 text-[#10b981] text-[10px] font-bold">
                                            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                                            <span>Claimed</span>
                                        </div>
                                    ) : isCurrent ? (
                                        <div className="flex items-center gap-1 text-[#8C56FC] text-[10px] font-bold animate-pulse">
                                            <Unlock className="w-3.5 h-3.5 flex-shrink-0" />
                                            <span>Ready</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-[var(--pl-text-muted)] text-[10px]">
                                            <Lock className="w-3 h-3 flex-shrink-0" />
                                            <span>Locked</span>
                                        </div>
                                    )}
                                </div>

                                {/* Center Icon & Title */}
                                <div className="my-1 text-left">
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center mb-2 shadow-sm"
                                        style={{ background: w.bg, color: w.color }}
                                    >
                                        <CrateIcon className="w-5 h-5" />
                                    </div>
                                    <div className="font-bold text-xs sm:text-sm text-[var(--pl-text-primary)] leading-snug">
                                        {w.subtitle}
                                    </div>
                                    <div className="text-[11px] text-[var(--pl-text-secondary)] mt-0.5 leading-tight">
                                        {w.perk}
                                    </div>
                                </div>

                                {/* Bottom Points Value */}
                                <div className="mt-2.5 pt-2 border-t border-[var(--pl-border-subtle)] flex items-center justify-between">
                                    <span className="text-xs font-extrabold" style={{ color: w.color }}>
                                        +{w.points} pts
                                    </span>
                                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-[var(--pl-bg-input)] text-[var(--pl-text-muted)]">
                                        {w.badge}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Current Week Claim Action Box */}
                <div className="p-4 rounded-2xl bg-[var(--pl-bg-input)] border border-[var(--pl-border-subtle)] space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[rgba(140,86,252,0.15)] to-[rgba(255,137,1,0.12)] flex items-center justify-center text-lg flex-shrink-0 border border-[var(--pl-border-subtle)] shadow-sm">
                            {isCurrentWeekClaimed ? (
                                <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                            ) : (
                                <ActiveIcon className="w-5 h-5 text-[#FF8901]" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs sm:text-sm font-semibold text-[var(--pl-text-primary)] leading-snug">
                                {isCurrentWeekClaimed
                                    ? `${activeWeekReward.title} Crate Unboxed & Deposited!`
                                    : `${activeWeekReward.title} Available: +${activeWeekReward.points} Credits`}
                            </div>
                            <div className="text-[11px] text-[var(--pl-text-muted)] flex items-center gap-1.5 mt-0.5">
                                <Clock className="w-3.5 h-3.5 text-[#FF8901] flex-shrink-0" />
                                <span className="truncate">
                                    {isCurrentWeekClaimed
                                        ? `Next crate unlocks in: ${timeLeft}`
                                        : "Tap below to claim this week's rewards"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleClaimWeek(activeWeekReward)}
                        disabled={isCurrentWeekClaimed || isClaiming}
                        className={`pl-btn ${isCurrentWeekClaimed ? "pl-btn-outline opacity-60" : "pl-btn-secondary"} w-full text-xs font-semibold`}
                        style={{ padding: "10px 16px" }}
                    >
                        {isClaiming ? (
                            "Unboxing..."
                        ) : isCurrentWeekClaimed ? (
                            "Claimed for this Week"
                        ) : (
                            `Claim ${activeWeekReward.title} (+${activeWeekReward.points}) ✨`
                        )}
                    </button>
                </div>

                {/* Expandable "What can I redeem these for at Launch" Section */}
                <div className="mt-4 pt-3 border-t border-[var(--pl-border-subtle)]">
                    <button
                        type="button"
                        onClick={() => setShowPerks(!showPerks)}
                        className="w-full flex items-center justify-between text-xs font-semibold text-[var(--pl-text-secondary)] hover:text-[var(--pl-accent-primary)] transition-colors py-1 text-left"
                    >
                        <span className="flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-[#8C56FC] flex-shrink-0" />
                            <span>What can I redeem these credits for at launch?</span>
                        </span>
                        {showPerks ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
                    </button>

                    {showPerks && (
                        <div className="grid grid-cols-1 gap-2.5 mt-3 pt-1 animate-fadeIn">
                            {REDEEM_PERKS.map((perk, i) => {
                                const Icon = perk.icon;
                                return (
                                    <div
                                        key={i}
                                        className="p-3 rounded-xl border border-[var(--pl-border-subtle)] bg-[var(--pl-bg-primary)] flex items-start gap-3 hover:border-[#8C56FC]/40 transition-colors"
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
                                                <span className="text-[10px] font-bold text-[#FF8901]">
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
        </>
    );
}
