"use client";
import { useState, useEffect, useRef } from "react";
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
    ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";
import VerifiedBadge from "@/components/VerifiedBadge";

// 8 Slices (45 deg each) — Alternating Reward & Empty as requested (Max reward Rs 500)
const SLOTS = [
    {
        id: 0,
        label: "Rs 500",
        type: "reward",
        amount: 500,
        subtext: "Max Reward 👑",
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
        label: "Rs 400",
        type: "reward",
        amount: 400,
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
        label: "Rs 300",
        type: "reward",
        amount: 300,
        subtext: "Bonus 🪙",
        color: "#10b981",
        bg: "#064e3b",
        textFill: "#34d399",
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
        subtext: "Starter ⚡",
        color: "#38bdf8",
        bg: "#0c4a6e",
        textFill: "#38bdf8",
        isJackpot: false
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

    const rotationRef = useRef(0);

    // Initialize spin status from localStorage
    useEffect(() => {
        try {
            const lastSpinDate = localStorage.getItem("pl_wheel_last_spin");
            const savedCredits = localStorage.getItem("pl_weekly_credits");
            const todayStr = new Date().toISOString().split("T")[0];

            if (savedCredits) {
                setTotalCredits(parseInt(savedCredits, 10) || 500);
            }

            if (lastSpinDate === todayStr) {
                setHasSpunToday(true);
            } else {
                setHasSpunToday(false);
            }
        } catch (e) {}
    }, []);

    // Live countdown timer until midnight for next free spin
    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const diff = tomorrow.getTime() - now.getTime();
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
    }, []);

    const spinWheel = () => {
        if (!isVerified) {
            setShowVerificationGate(true);
            return;
        }

        if (isSpinning || hasSpunToday) return;

        setIsSpinning(true);
        setIsTicking(true);

        // Pick a random target slot (fair probabilistic distribution)
        const targetIndex = Math.floor(Math.random() * SLOTS.length);
        const winningSlot = SLOTS[targetIndex];

        // Sector size = 45 deg (360 / 8)
        // Top pointer is at 0 deg (12 o'clock)
        const sectorAngle = 360 / SLOTS.length; // 45
        const fullRotations = (5 + Math.floor(Math.random() * 3)) * 360; // 5 to 7 full 360 loops

        // Target angle to land sector under the top needle:
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

            const todayStr = new Date().toISOString().split("T")[0];
            localStorage.setItem("pl_wheel_last_spin", todayStr);

            if (winningSlot.type === "reward") {
                const currentSaved = parseInt(localStorage.getItem("pl_weekly_credits") || "500", 10);
                const newTotal = currentSaved + winningSlot.amount;
                setTotalCredits(newTotal);
                localStorage.setItem("pl_weekly_credits", String(newTotal));
                toast.success(`🎉 Won ${winningSlot.label} Launch Credits!`, {
                    style: { background: "#0f1422", color: "#fff", border: "1px solid #f59e0b" }
                });
            } else {
                toast("💨 Empty slot! Better luck on your next spin.", {
                    icon: "🎲",
                    style: { background: "#0f1422", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)" }
                });
            }

            setResultModal(winningSlot);
        }, 4600);
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
                        <div className="mb-4">
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
                                Spin the wheel once daily to win up to <strong className="text-[#facc15]">Rs 500</strong> in Launch Credits!
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

                        {/* WhatsApp Verification Required Notice Banner */}
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
                        <div className="relative mx-auto my-3 flex items-center justify-center" style={{ width: "310px", height: "310px" }}>
                            {/* Top Pointer / Needle Indicator */}
                            <div className={`pl-wheel-pointer ${isTicking ? "ticking" : ""}`}>
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
                            <div className="pl-wheel-rim" style={{ width: "300px", height: "300px" }}>
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
                                            {/* Slices gradients */}
                                            <linearGradient id="goldSlot" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor="#4c1d95" />
                                                <stop offset="100%" stopColor="#1e1b4b" />
                                            </linearGradient>
                                            <linearGradient id="emptySlot" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor="#0f172a" />
                                                <stop offset="100%" stopColor="#020617" />
                                            </linearGradient>
                                            <linearGradient id="purpleSlot" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor="#3b0764" />
                                                <stop offset="100%" stopColor="#1e1b4b" />
                                            </linearGradient>
                                            <linearGradient id="greenSlot" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor="#064e3b" />
                                                <stop offset="100%" stopColor="#022c22" />
                                            </linearGradient>
                                            <linearGradient id="blueSlot" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor="#0c4a6e" />
                                                <stop offset="100%" stopColor="#082f49" />
                                            </linearGradient>
                                        </defs>

                                        {/* 8 Slices Geometry */}
                                        {SLOTS.map((slot, index) => {
                                            const angle = 45; // 360 / 8
                                            const startAngle = index * angle;
                                            const endAngle = startAngle + angle;

                                            // Convert to radians (0 is at top 12 o'clock, rotate by -90 deg)
                                            const startRad = ((startAngle - 90) * Math.PI) / 180;
                                            const endRad = ((endAngle - 90) * Math.PI) / 180;

                                            const x1 = 150 + 150 * Math.cos(startRad);
                                            const y1 = 150 + 150 * Math.sin(startRad);
                                            const x2 = 150 + 150 * Math.cos(endRad);
                                            const y2 = 150 + 150 * Math.sin(endRad);

                                            const pathData = `M 150 150 L ${x1} ${y1} A 150 150 0 0 1 ${x2} ${y2} Z`;

                                            // Text orientation angle
                                            const midAngle = startAngle + angle / 2;

                                            return (
                                                <g key={slot.id}>
                                                    <path
                                                        d={pathData}
                                                        fill={
                                                            slot.type === "empty"
                                                                ? "url(#emptySlot)"
                                                                : slot.isJackpot
                                                                ? "url(#goldSlot)"
                                                                : index === 2
                                                                ? "url(#purpleSlot)"
                                                                : index === 4
                                                                ? "url(#greenSlot)"
                                                                : "url(#blueSlot)"
                                                        }
                                                        stroke="rgba(250, 204, 21, 0.4)"
                                                        strokeWidth="1.5"
                                                    />

                                                    {/* Text & Value on Slice */}
                                                    <g transform={`rotate(${midAngle}, 150, 150)`}>
                                                        <text
                                                            x="150"
                                                            y="52"
                                                            fill={slot.textFill}
                                                            fontSize={slot.isJackpot ? "14" : "13"}
                                                            fontWeight="800"
                                                            textAnchor="middle"
                                                            letterSpacing="0.02em"
                                                        >
                                                            {slot.label}
                                                        </text>
                                                        <text
                                                            x="150"
                                                            y="68"
                                                            fill="rgba(255,255,255,0.7)"
                                                            fontSize="8.5"
                                                            fontWeight="600"
                                                            textAnchor="middle"
                                                        >
                                                            {slot.subtext}
                                                        </text>
                                                    </g>
                                                </g>
                                            );
                                        })}
                                    </svg>
                                </div>
                            </div>

                            {/* Center SPIN Button */}
                            <button
                                type="button"
                                onClick={spinWheel}
                                disabled={isSpinning || hasSpunToday}
                                className="pl-wheel-center-btn"
                                aria-label="Spin the wheel"
                            >
                                <span style={{ color: "#facc15" }}>SPIN</span>
                            </button>
                        </div>

                        {/* Bottom Status & Info */}
                        <div className="mt-4 pt-3 border-t border-[var(--pl-border-subtle)] flex items-center justify-between">
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
                                    Launch Vault
                                </span>
                                <span className="text-xs font-bold text-[#8C56FC]">
                                    {totalCredits.toLocaleString()} Credits 🪙
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── WIN / RESULT MODAL ── */}
            {resultModal && (
                <div className="pl-modal-backdrop" onClick={() => setResultModal(null)}>
                    <div className="pl-modal-card" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            onClick={() => setResultModal(null)}
                            className="absolute top-4 right-4 text-[var(--pl-text-muted)] hover:text-white p-1 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="pl-modal-icon-ring">
                            {resultModal.type === "reward" ? (
                                <Trophy className="w-12 h-12 text-[#facc15]" />
                            ) : (
                                <span className="text-4xl">💨</span>
                            )}
                        </div>

                        {resultModal.type === "reward" ? (
                            <>
                                <span className="pl-badge text-xs mb-2" style={{ background: "rgba(250, 204, 21, 0.15)", color: "#facc15" }}>
                                    <Sparkles className="w-3.5 h-3.5 inline mr-1" /> {resultModal.isJackpot ? "JACKPOT WINNER!" : "REWARD WON!"}
                                </span>
                                <h3 className="pl-heading text-2xl mb-1">
                                    Congratulations!
                                </h3>
                                <p className="text-xs sm:text-sm text-[var(--pl-text-secondary)] mb-4">
                                    You landed on <strong className="text-white">{resultModal.label}</strong>! Credits have been deposited into your launch vault.
                                </p>
                                <div className="p-4 rounded-xl bg-[var(--pl-bg-input)] border border-[#facc15]/30 mb-5 text-center">
                                    <span className="text-xs text-[var(--pl-text-muted)] font-semibold uppercase">Prize Added</span>
                                    <div className="text-2xl font-extrabold text-[#facc15]">
                                        +{resultModal.amount} Credits
                                    </div>
                                </div>
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
                                    You landed on an empty slot. Come back tomorrow after midnight for another free spin!
                                </p>
                            </>
                        )}

                        <button
                            type="button"
                            onClick={() => setResultModal(null)}
                            className="pl-btn pl-btn-secondary w-full"
                        >
                            Continue <ArrowRight className="w-4 h-4 ml-1" />
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
