"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    Sparkles,
    X,
    Coins,
    Gift,
    Clock,
    Award,
    CheckCircle2,
    ArrowRight,
    Trophy,
    Flame,
    RotateCw,
    Lock,
    ShieldCheck,
    Smartphone,
    Wallet,
    Loader2
} from "lucide-react";
import toast from "react-hot-toast";
import VerifiedBadge from "@/components/VerifiedBadge";
import { luckyWheelAPI } from "@/config/api";

// 8 Slices (45 deg each) — Alternating Rewards (2500, 1000, 2000, 200) & Empty Slots
// System rule: The wheel only stops and wins on slot 6 (Rs 200) once every 72 hours
const SLOTS = [
    {
        id: 0,
        label: "Rs 2500",
        type: "reward",
        amount: 2500,
        subtext: "Grand Prize 👑",
        color: "#f59e0b",
        bg: "#3b0764",
        textFill: "#fbbf24",
        isJackpot: true
    },
    {
        id: 1,
        label: "Empty",
        type: "empty",
        amount: 0,
        subtext: "Try Tomorrow",
        color: "#64748b",
        bg: "#111827",
        textFill: "#94a3b8",
        isJackpot: false
    },
    {
        id: 2,
        label: "Rs 1000",
        type: "reward",
        amount: 1000,
        subtext: "VIP Cash 💎",
        color: "#8C56FC",
        bg: "#2e1065",
        textFill: "#c084fc",
        isJackpot: false
    },
    {
        id: 3,
        label: "Empty",
        type: "empty",
        amount: 0,
        subtext: "Better Luck",
        color: "#64748b",
        bg: "#111827",
        textFill: "#94a3b8",
        isJackpot: false
    },
    {
        id: 4,
        label: "Rs 2000",
        type: "reward",
        amount: 2000,
        subtext: "Super Cash 🪙",
        color: "#06b6d4",
        bg: "#083344",
        textFill: "#22d3ee",
        isJackpot: false
    },
    {
        id: 5,
        label: "Empty",
        type: "empty",
        amount: 0,
        subtext: "Try Tomorrow",
        color: "#64748b",
        bg: "#111827",
        textFill: "#94a3b8",
        isJackpot: false
    },
    {
        id: 6,
        label: "Rs 200",
        type: "reward",
        amount: 200,
        subtext: "Cash Prize ⚡",
        color: "#10b981",
        bg: "#064e3b",
        textFill: "#34d399",
        isJackpot: true
    },
    {
        id: 7,
        label: "Empty",
        type: "empty",
        amount: 0,
        subtext: "Better Luck",
        color: "#64748b",
        bg: "#111827",
        textFill: "#94a3b8",
        isJackpot: false
    }
];

export default function LuckyWheel({ isVerified = false, onOpenVerification }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [hasSpunToday, setHasSpunToday] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");
    const [resultModal, setResultModal] = useState(null);
    const [isTicking, setIsTicking] = useState(false);
    const [totalCredits, setTotalCredits] = useState(500);
    const [showVerificationGate, setShowVerificationGate] = useState(false);
    const [nextSpinTimestamp, setNextSpinTimestamp] = useState(null);

    // Payout Claim Form state
    const [claimedReward, setClaimedReward] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("jazzcash"); // jazzcash or easypaisa
    const [accountTitle, setAccountTitle] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
    const [claimSubmitted, setClaimSubmitted] = useState(false);

    const rotationRef = useRef(0);

    // Initialize spin status directly from the Database (no client-side bypass)
    const fetchUserStatus = async () => {
        try {
            const res = await luckyWheelAPI.getStatus();
            if (res && res.status === "success" && res.data) {
                const { canSpin, nextSpinAt, claimedReward: dbReward } = res.data;
                setHasSpunToday(!canSpin);
                if (nextSpinAt) {
                    setNextSpinTimestamp(new Date(nextSpinAt).getTime());
                } else {
                    setNextSpinTimestamp(null);
                }
                if (dbReward) {
                    setClaimedReward(dbReward);
                }
            }
        } catch (e) {
            console.error("Lucky wheel status fetch error:", e);
        }
    };

    useEffect(() => {
        fetchUserStatus();
    }, []);

    // Live countdown timer based on real DB nextSpinTimestamp
    useEffect(() => {
        const updateTimer = () => {
            if (!nextSpinTimestamp) {
                setTimeLeft("Available Now!");
                return;
            }

            const diff = nextSpinTimestamp - Date.now();
            if (diff <= 0) {
                setHasSpunToday(false);
                setTimeLeft("Available Now!");
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(
                `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}min ${String(seconds).padStart(2, "0")}sec`
            );
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [nextSpinTimestamp]);

    const spinWheel = async () => {
        if (!isVerified) {
            setShowVerificationGate(true);
            return;
        }

        if (isSpinning) return;

        if (hasSpunToday) {
            toast(`⏳ You have already used your daily free spin. Next spin available in ${timeLeft || "tomorrow"}.`, {
                icon: "⏱️",
                style: { background: "#0f1422", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }
            });
            return;
        }

        setIsSpinning(true);
        setIsTicking(true);

        let targetIndex = 1; // Default empty slot
        let isWin = false;
        let wonAmount = 0;

        try {
            // Query backend 24-hour limit & 72-hour prize window engine in MongoDB
            const res = await luckyWheelAPI.spin();
            if (res && res.status === "success" && res.data) {
                targetIndex = res.data.slotId !== undefined ? res.data.slotId : 1;
                isWin = Boolean(res.data.isWin);
                wonAmount = res.data.amount || 0;
            } else if (res && (res.status === "error" || res.message)) {
                setIsSpinning(false);
                setIsTicking(false);
                toast(res?.message || "You have already spun today. Next spin available tomorrow.", {
                    icon: "⏱️",
                    style: { background: "#0f1422", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }
                });
                fetchUserStatus();
                return;
            } else {
                // Offline fallback to empty slot
                const emptySlots = [1, 2, 3, 4, 5, 7];
                targetIndex = emptySlots[Math.floor(Math.random() * emptySlots.length)];
            }
        } catch (e) {
            // Offline fallback
            const emptySlots = [1, 2, 3, 4, 5, 7];
            targetIndex = emptySlots[Math.floor(Math.random() * emptySlots.length)];
        }

        const winningSlot = SLOTS[targetIndex] || SLOTS[1];

        // Sector size = 45 deg (360 / 8)
        const sectorAngle = 360 / SLOTS.length; // 45
        const fullRotations = (5 + Math.floor(Math.random() * 3)) * 360;

        // Target angle to land sector under the top needle (12 o'clock = 0 deg)
        const currentRot = rotationRef.current;
        const targetSlotCenter = targetIndex * sectorAngle + sectorAngle / 2;
        const finalRotation = currentRot + fullRotations + (360 - (currentRot % 360)) + (360 - targetSlotCenter);

        rotationRef.current = finalRotation;
        setRotation(finalRotation);

        // Stop needle tick after spin completes
        setTimeout(() => {
            setIsSpinning(false);
            setIsTicking(false);
            setHasSpunToday(true);
            setNextSpinTimestamp(Date.now() + 24 * 60 * 60 * 1000);

            if (isWin || winningSlot.type === "reward") {
                toast.success(`🎉 JACKPOT! You won Rs 200 Cash Reward!`, {
                    style: { background: "#0f1422", color: "#fff", border: "1px solid #10b981" }
                });
            } else {
                toast("💨 Empty slot! Better luck tomorrow.", {
                    icon: "🎲",
                    style: { background: "#0f1422", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)" }
                });
            }

            setResultModal(isWin ? { ...winningSlot, isJackpot: true } : winningSlot);
            fetchUserStatus();
        }, 4600);
    };

    const handleClaimPayout = async (e) => {
        if (e) e.preventDefault();

        if (!accountTitle.trim()) {
            toast.error("Please enter the account title / holder name");
            return;
        }

        const cleanNumber = accountNumber.replace(/\D/g, "");
        if (cleanNumber.length < 10 || cleanNumber.length > 11) {
            toast.error("Please enter a valid 11-digit Pakistani mobile number");
            return;
        }

        setIsSubmittingClaim(true);
        try {
            const res = await luckyWheelAPI.claimReward({
                paymentMethod,
                accountTitle: accountTitle.trim(),
                accountNumber: cleanNumber
            });

            if (res && (res.status === "success" || res.status === 201 || res.data)) {
                toast.success("🎉 Reward claimed! Our team will transfer Rs 200 to your account.");
                setClaimSubmitted(true);
                setClaimedReward(res.data || {
                    rewardAmount: 200,
                    paymentMethod,
                    accountTitle,
                    accountNumber: cleanNumber,
                    status: "pending"
                });
            } else {
                toast.error(res?.message || "Failed to claim reward. Please try again.");
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
        } finally {
            setIsSubmittingClaim(false);
        }
    };

    return (
        <>
            {/* ── FLOATING LUCKY WHEEL TRIGGER BUTTON ── */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="pl-wheel-floating-btn"
                aria-label="Open Lucky Spin Wheel"
            >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center animate-spin" style={{ animationDuration: "6s" }}>
                    <RotateCw className="w-3.5 h-3.5 text-white" />
                </div>
                <span>Lucky Wheel</span>
                {!hasSpunToday && (
                    <span className="pl-wheel-badge-pulse">1 FREE</span>
                )}
            </button>

            {/* ── LUCKY WHEEL FULL MODAL ── */}
            {isOpen && (
                <div className="pl-modal-backdrop" onClick={() => !isSpinning && setIsOpen(false)}>
                    <div
                        className="pl-modal-card"
                        style={{ maxWidth: "560px", padding: "28px 20px" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        {!isSpinning && (
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-[var(--pl-text-muted)] hover:text-white p-1.5 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}

                        {/* Modal Header */}
                        <div className="mb-3">
                            <span className="pl-badge text-[11px] mb-1.5" style={{ background: "rgba(140, 86, 252, 0.2)", color: "#c084fc" }}>
                                <Sparkles className="w-3.5 h-3.5 inline mr-1" /> Daily Reward Spin
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{
                                background: "linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #facc15 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                            }}>
                                SPIN LUCKY WHEEL!
                            </h2>
                            <p className="text-xs text-[var(--pl-text-secondary)] mt-1 max-w-sm mx-auto">
                                Spin the wheel daily for a chance to win cash rewards sent directly to your JazzCash / EasyPaisa!
                            </p>
                            <div className="text-[11px] text-[var(--pl-text-muted)] mt-1 flex items-center justify-center gap-1">
                                <Clock className="w-3 h-3 text-[#FF8901]" />
                                {hasSpunToday ? (
                                    <span>Next free spin in <strong className="text-[#a855f7]">{timeLeft}</strong></span>
                                ) : (
                                    <span className="text-[#10b981] font-semibold">1 Free Spin Available Right Now!</span>
                                )}
                            </div>
                        </div>

                        {/* Claimed Reward Status Banner (If User Already Won) */}
                        {claimedReward && (
                            <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-[#10b981]/15 to-[#8C56FC]/15 border border-[#10b981]/40 flex items-center justify-between gap-3 text-left">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center text-[#10b981] flex-shrink-0">
                                        <Trophy className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-bold text-[var(--pl-text-primary)]">
                                                Rs 200 Cash Reward Claimed 🎉
                                            </span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                                claimedReward.status === "completed"
                                                    ? "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40"
                                                    : "bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40"
                                            }`}>
                                                {claimedReward.status === "completed" ? "✓ Transferred" : "⏳ Transfer Pending"}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-[var(--pl-text-secondary)] mt-0.5">
                                            {claimedReward.paymentMethod?.toUpperCase()}: {claimedReward.accountNumber} ({claimedReward.accountTitle})
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* WhatsApp Verification Required Notice Banner (For Unverified Users) */}
                        {!isVerified && (
                            <div className="mb-3 p-3 rounded-xl bg-[#0095F6]/10 border border-[#0095F6]/30 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-left">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-[#0095F6]/20 flex items-center justify-center flex-shrink-0 text-[#0095F6]">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[var(--pl-text-primary)] flex items-center gap-1">
                                            WhatsApp Verification Required <VerifiedBadge size="xs" />
                                        </p>
                                        <p className="text-[10px] text-[var(--pl-text-secondary)] leading-tight">
                                            Verify your number on WhatsApp to unlock spins &amp; earn your Verified Blue Badge.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsOpen(false);
                                        if (onOpenVerification) onOpenVerification();
                                    }}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0095F6] text-white hover:bg-[#0080d4] transition-colors flex-shrink-0 shadow-xs"
                                >
                                    Verify on WhatsApp →
                                </button>
                            </div>
                        )}

                        {/* ── THE CIRCULAR WHEEL ── */}
                        <div
                            className="relative mx-auto my-3 flex items-center justify-center cursor-pointer"
                            style={{ width: "310px", height: "310px" }}
                            onClick={() => !isSpinning && spinWheel()}
                        >
                            {/* Top Pointer / Needle Indicator */}
                            <div className={`pl-wheel-pointer ${isTicking ? "ticking" : ""}`} style={{ zIndex: 35 }}>
                                <svg width="34" height="42" viewBox="0 0 34 42" fill="none">
                                    <path
                                        d="M17 40L6 14C3 8 7.5 1 14.5 1H19.5C26.5 1 31 8 28 14L17 40Z"
                                        fill="url(#needleGrad)"
                                        stroke="#facc15"
                                        strokeWidth="2"
                                    />
                                    <circle cx="17" cy="14" r="5" fill="#facc15" />
                                    <defs>
                                        <linearGradient id="needleGrad" x1="17" y1="1" x2="17" y2="40" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#a855f7" />
                                            <stop offset="1" stopColor="#581c87" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>

                            {/* Outer Golden Bulb Frame */}
                            <div className="pl-wheel-rim" style={{ width: "300px", height: "300px", position: "relative" }}>
                                {/* Rotating SVG Wheel */}
                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        transform: `rotate(${rotation}deg)`,
                                        transition: isSpinning ? "transform 4.5s cubic-bezier(0.12, 0.8, 0.18, 1)" : "none"
                                    }}
                                >
                                    <svg viewBox="0 0 300 300" className="w-full h-full">
                                        <defs>
                                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                                <feGaussianBlur stdDeviation="3" result="blur" />
                                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                            </filter>
                                        </defs>

                                        {/* 8 Slices — 45 degrees each */}
                                        {SLOTS.map((slot, i) => {
                                            const angle = 45;
                                            const startAngle = i * angle - 90;
                                            const endAngle = startAngle + angle;
                                            const rad1 = (startAngle * Math.PI) / 180;
                                            const rad2 = (endAngle * Math.PI) / 180;
                                            const x1 = 150 + 145 * Math.cos(rad1);
                                            const y1 = 150 + 145 * Math.sin(rad1);
                                            const x2 = 150 + 145 * Math.cos(rad2);
                                            const y2 = 150 + 145 * Math.sin(rad2);

                                            // Text angle and positioning
                                            const midAngle = startAngle + angle / 2;
                                            const textRad = (midAngle * Math.PI) / 180;
                                            const textX = 150 + 95 * Math.cos(textRad);
                                            const textY = 150 + 95 * Math.sin(textRad);

                                            return (
                                                <g key={slot.id}>
                                                    {/* Slice Path */}
                                                    <path
                                                        d={`M150,150 L${x1},${y1} A145,145 0 0,1 ${x2},${y2} Z`}
                                                        fill={slot.bg}
                                                        stroke="rgba(255, 255, 255, 0.12)"
                                                        strokeWidth="1.5"
                                                    />

                                                    {/* Inner Sector Accent Border */}
                                                    <path
                                                        d={`M150,150 L${x1},${y1}`}
                                                        stroke={slot.isJackpot ? "#facc15" : "rgba(255,255,255,0.15)"}
                                                        strokeWidth={slot.isJackpot ? "2" : "1"}
                                                    />

                                                    {/* Slice Text / Label */}
                                                    <g transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}>
                                                        <text
                                                            x={textX}
                                                            y={textY - 4}
                                                            textAnchor="middle"
                                                            fill={slot.textFill}
                                                            fontSize={slot.isJackpot ? "13" : "11"}
                                                            fontWeight="800"
                                                            letterSpacing="0.5"
                                                            style={{ textShadow: slot.isJackpot ? "0 0 10px rgba(250,204,21,0.6)" : "none" }}
                                                        >
                                                            {slot.label}
                                                        </text>
                                                        <text
                                                            x={textX}
                                                            y={textY + 9}
                                                            textAnchor="middle"
                                                            fill={slot.isJackpot ? "#fef08a" : "#64748b"}
                                                            fontSize="8"
                                                            fontWeight="600"
                                                        >
                                                            {slot.subtext}
                                                        </text>
                                                    </g>
                                                </g>
                                            );
                                        })}

                                        {/* Golden Perimeter Ring */}
                                        <circle cx="150" cy="150" r="145" fill="none" stroke="rgba(250, 204, 21, 0.4)" strokeWidth="3" />
                                    </svg>
                                </div>
                            </div>

                            {/* Center Spin Button Knob (Placed at exact center with high z-index) */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    spinWheel();
                                }}
                                disabled={isSpinning}
                                className={`pl-wheel-center-btn ${isSpinning ? "spinning" : ""} ${hasSpunToday ? "disabled" : ""}`}
                                style={{ zIndex: 30 }}
                                aria-label="Spin Wheel"
                            >
                                <Sparkles className="w-5 h-5 text-[#facc15] mb-0.5" />
                                <span className="text-[11px] font-black tracking-wider text-white uppercase">
                                    {isSpinning ? "SPINNING" : hasSpunToday ? "DONE" : "SPIN"}
                                </span>
                            </button>
                        </div>

                        {/* Prominent Bottom Spin Button Action */}
                        <button
                            type="button"
                            onClick={spinWheel}
                            disabled={isSpinning}
                            className="pl-btn pl-btn-primary w-full mt-3 py-3 text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
                            style={{
                                background: hasSpunToday
                                    ? "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)"
                                    : "linear-gradient(135deg, #8C56FC 0%, #a855f7 50%, #FF8901 100%)",
                                borderColor: hasSpunToday ? "rgba(255,255,255,0.15)" : "#facc15",
                                color: hasSpunToday ? "var(--pl-text-muted)" : "#ffffff"
                            }}
                        >
                            {isSpinning ? (
                                <>
                                    <RotateCw className="w-4 h-4 animate-spin text-[#facc15]" />
                                    <span>SPINNING THE WHEEL...</span>
                                </>
                            ) : hasSpunToday ? (
                                <>
                                    <Clock className="w-4 h-4 text-[#FF8901]" />
                                    <span>Next Free Spin in {timeLeft}</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 text-[#facc15]" />
                                    <span>🎯 SPIN WHEEL NOW (1 FREE SPIN)</span>
                                </>
                            )}
                        </button>

                        {/* Footer Info Box */}
                        <div className="mt-3 p-3 bg-[var(--pl-bg-input)] border border-[var(--pl-border-subtle)] rounded-xl flex items-center justify-between text-xs">
                            <div className="text-left">
                                <span className="text-[10px] text-[var(--pl-text-muted)] font-semibold uppercase tracking-wider block">
                                    Your Status
                                </span>
                                <span className="text-xs font-bold text-[var(--pl-text-primary)]">
                                    {hasSpunToday ? "0 Spins Remaining Today" : "1 Daily Free Spin Available"}
                                </span>
                            </div>

                            <div className="text-right">
                                <span className="text-[10px] text-[var(--pl-text-muted)] font-semibold uppercase tracking-wider block">
                                    Grand Prize
                                </span>
                                <span className="text-xs font-bold text-[#f59e0b]">
                                    Rs 2500 Cash 💰
                                </span>
                            </div>
                        </div>

                        {/* Hall of Winners Link Bar */}
                        <div className="mt-2.5 pt-2 border-t border-[var(--pl-border-subtle)] flex items-center justify-between text-xs px-1">
                            <div className="flex items-center gap-1.5 text-[var(--pl-text-muted)] text-[11px]">
                                <Trophy className="w-3.5 h-3.5 text-[#f59e0b]" />
                                <span>Recent Lucky Winners</span>
                            </div>
                            <Link
                                href="/winners"
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C56FC] hover:text-[#a855f7] hover:underline transition-colors"
                            >
                                <span>View Winners List</span>
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* ── WIN / RESULT MODAL ── */}
            {resultModal && (
                <div className="pl-modal-backdrop" onClick={() => !isSubmittingClaim && setResultModal(null)}>
                    <div className="pl-modal-card" style={{ maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
                        {!isSubmittingClaim && (
                            <button
                                type="button"
                                onClick={() => setResultModal(null)}
                                className="absolute top-4 right-4 text-[var(--pl-text-muted)] hover:text-white p-1 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}

                        <div className="pl-modal-icon-ring">
                            {resultModal.type === "reward" ? (
                                <Trophy className="w-12 h-12 text-[#10b981]" />
                            ) : (
                                <span className="text-4xl">🎲</span>
                            )}
                        </div>

                        {resultModal.type === "reward" ? (
                            <>
                                <span className="pl-badge text-xs mb-2" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                                    <Sparkles className="w-3.5 h-3.5 inline mr-1" /> GRAND CASH WINNER!
                                </span>
                                <h3 className="pl-heading text-2xl sm:text-3xl mb-1">
                                    Congratulations!
                                </h3>
                                <p className="text-xs sm:text-sm text-[var(--pl-text-secondary)] mb-4">
                                    You landed on <strong className="text-white">Rs 200 Cash Prize</strong>! Enter your JazzCash or EasyPaisa details below so our team can transfer the amount to you.
                                </p>

                                {!claimSubmitted ? (
                                    /* Payout Details Form */
                                    <form onSubmit={handleClaimPayout} className="space-y-3.5 text-left mb-4">
                                        <div className="p-3 bg-[var(--pl-bg-input)] border border-[#10b981]/30 rounded-xl text-center">
                                            <span className="text-[11px] text-[var(--pl-text-muted)] font-semibold uppercase">Prize Amount</span>
                                            <div className="text-2xl font-extrabold text-[#10b981]">
                                                Rs 200 Cash
                                            </div>
                                        </div>

                                        {/* Payment Method Selector */}
                                        <div>
                                            <label className="pl-label text-xs">Select Payout Method</label>
                                            <div className="grid grid-cols-2 gap-2 mt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod("jazzcash")}
                                                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                                                        paymentMethod === "jazzcash"
                                                            ? "bg-[#FF8901]/20 border-[#FF8901] text-[#FF8901] ring-1 ring-[#FF8901]"
                                                            : "bg-[var(--pl-bg-input)] border-[var(--pl-border-subtle)] text-[var(--pl-text-secondary)]"
                                                    }`}
                                                >
                                                    <Smartphone className="w-4 h-4 text-[#FF8901]" />
                                                    JazzCash
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod("easypaisa")}
                                                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                                                        paymentMethod === "easypaisa"
                                                            ? "bg-[#10b981]/20 border-[#10b981] text-[#10b981] ring-1 ring-[#10b981]"
                                                            : "bg-[var(--pl-bg-input)] border-[var(--pl-border-subtle)] text-[var(--pl-text-secondary)]"
                                                    }`}
                                                >
                                                    <Wallet className="w-4 h-4 text-[#10b981]" />
                                                    EasyPaisa
                                                </button>
                                            </div>
                                        </div>

                                        {/* Account Title */}
                                        <div className="pl-input-group">
                                            <label className="pl-label text-xs">Account Title / Holder Name</label>
                                            <input
                                                type="text"
                                                className="pl-input text-xs"
                                                placeholder="e.g. Muhammad Ali"
                                                value={accountTitle}
                                                onChange={(e) => setAccountTitle(e.target.value)}
                                                required
                                                disabled={isSubmittingClaim}
                                            />
                                        </div>

                                        {/* Mobile Account Number */}
                                        <div className="pl-input-group">
                                            <label className="pl-label text-xs">
                                                {paymentMethod === "jazzcash" ? "JazzCash" : "EasyPaisa"} Mobile Number
                                            </label>
                                            <input
                                                type="tel"
                                                className="pl-input text-xs font-mono"
                                                placeholder="e.g. 03001234567"
                                                value={accountNumber}
                                                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 11))}
                                                maxLength={11}
                                                required
                                                disabled={isSubmittingClaim}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmittingClaim || !accountTitle || accountNumber.length < 10}
                                            className="pl-btn pl-btn-primary w-full mt-2"
                                            style={{ background: "#10b981", borderColor: "#10b981" }}
                                        >
                                            {isSubmittingClaim ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting Payout Details...
                                                </span>
                                            ) : (
                                                "Submit Payout Details (Rs 200) →"
                                            )}
                                        </button>
                                    </form>
                                ) : (
                                    /* Claim Confirmed Card */
                                    <div className="p-4 rounded-xl bg-[#10b981]/15 border border-[#10b981]/40 text-center mb-5">
                                        <CheckCircle2 className="w-8 h-8 text-[#10b981] mx-auto mb-2" />
                                        <h4 className="font-bold text-sm text-white mb-1">
                                            Payout Details Received!
                                        </h4>
                                        <p className="text-xs text-[var(--pl-text-secondary)] leading-relaxed">
                                            Our finance team will manually review and transfer <strong>Rs 200</strong> to your {paymentMethod.toUpperCase()} ({accountNumber}) within 24-48 hours.
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <span className="pl-badge text-xs mb-2" style={{ background: "rgba(148, 163, 184, 0.15)", color: "#94a3b8" }}>
                                    Empty Slot
                                </span>
                                <h3 className="pl-heading text-2xl mb-1">
                                    Better Luck Tomorrow!
                                </h3>
                                <p className="text-xs sm:text-sm text-[var(--pl-text-secondary)] mb-5">
                                    You landed on an empty slot. Come back tomorrow after midnight for another daily free spin!
                                </p>
                            </>
                        )}

                        <button
                            type="button"
                            onClick={() => setResultModal(null)}
                            className="pl-btn pl-btn-secondary w-full"
                        >
                            {resultModal.type === "reward" && claimSubmitted ? "Done" : "Continue"} <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                </div>
            )}

            {/* ── WHATSAPP VERIFICATION GATE MODAL ── */}
            {showVerificationGate && (
                <div className="pl-modal-backdrop" onClick={() => setShowVerificationGate(false)}>
                    <div className="pl-modal-card" style={{ maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            onClick={() => setShowVerificationGate(false)}
                            className="absolute top-4 right-4 text-[var(--pl-text-muted)] hover:text-white p-1 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="pl-modal-icon-ring" style={{ background: "rgba(0, 149, 246, 0.15)", border: "2px solid #0095F6" }}>
                            <Lock className="w-10 h-10 text-[#0095F6]" />
                        </div>

                        <span className="pl-badge text-xs mb-2" style={{ background: "rgba(0, 149, 246, 0.15)", color: "#0095F6" }}>
                            <VerifiedBadge size="xs" /> Verification Required
                        </span>

                        <h3 className="pl-heading text-2xl mb-1">
                            Verify via WhatsApp
                        </h3>

                        <p className="text-xs sm:text-sm text-[var(--pl-text-secondary)] mb-5 leading-relaxed">
                            To unlock daily spins on the <strong>Lucky Wheel</strong> and claim your official <strong>Blue Verified Badge</strong>, please verify your WhatsApp phone number.
                        </p>

                        <div className="space-y-2.5">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowVerificationGate(false);
                                    setIsOpen(false);
                                    if (onOpenVerification) onOpenVerification();
                                }}
                                className="pl-btn pl-btn-primary w-full"
                                style={{ background: "#0095F6", borderColor: "#0095F6" }}
                            >
                                Verify Phone on WhatsApp →
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowVerificationGate(false)}
                                className="pl-btn pl-btn-outline w-full text-xs"
                            >
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
