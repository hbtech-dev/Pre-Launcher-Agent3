"use client";
import { useState, useEffect } from "react";
import { X, Phone, ShieldCheck, CheckCircle2, Loader2, MessageSquare, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import { phoneVerificationAPI } from "@/config/api";
import VerifiedBadge from "@/components/VerifiedBadge";

export default function PhoneVerificationModal({ isOpen, onClose, onVerified }) {
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [canResend, setCanResend] = useState(true);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const formatPhoneNumber = (value) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 11) {
            return cleaned;
        }
        return cleaned.slice(0, 11);
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhone(formatted);
    };

    const handleSendOTP = async (e) => {
        if (e) e.preventDefault();

        if (!phone.trim()) {
            toast.error('Please enter your WhatsApp phone number');
            return;
        }

        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length < 10 || cleanPhone.length > 11) {
            toast.error('Please enter a valid 11-digit Pakistani phone number (e.g. 03001234567)');
            return;
        }

        setLoading(true);
        try {
            const res = await phoneVerificationAPI.sendCode(cleanPhone);

            if (res && (res.status === 'success' || res.status === 200 || res.success)) {
                toast.success('WhatsApp verification code sent! 📱');
                setStep(2);
                setCountdown(60);
                setCanResend(false);
            } else {
                toast.error(res?.message || 'Failed to send WhatsApp verification code');
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        if (e) e.preventDefault();

        if (!otp.trim() || otp.length < 4) {
            toast.error('Please enter the verification code sent to your WhatsApp');
            return;
        }

        setLoading(true);
        try {
            const res = await phoneVerificationAPI.verify(otp.trim());

            if (res && (res.status === 'success' || res.status === 200 || res.success)) {
                toast.success('WhatsApp verified! Blue Badge assigned & Lucky Wheel unlocked! 🎉');
                if (onVerified) onVerified();
                handleClose();
            } else {
                toast.error(res?.message || 'Invalid verification code. Please check your WhatsApp.');
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;

        setLoading(true);
        try {
            const res = await phoneVerificationAPI.resend();

            if (res && (res.status === 'success' || res.status === 200 || res.success)) {
                toast.success('New verification code sent to WhatsApp! 📱');
                setCountdown(60);
                setCanResend(false);
                setOtp('');
            } else {
                toast.error(res?.message || 'Failed to resend code');
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setPhone('');
        setOtp('');
        setCountdown(0);
        setCanResend(true);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[150] p-4 animate-in fade-in duration-200">
            <div className="pl-glass-card w-full max-w-md p-6 relative border border-[#8C56FC]/30 shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
                {/* Close Button */}
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-[var(--pl-text-muted)] hover:text-[var(--pl-text-primary)] transition-colors p-1"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header with Verified Badge Preview */}
                <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#0095F6]/15 border border-[#0095F6]/30 flex items-center justify-center mx-auto mb-3 text-[#0095F6]">
                        <VerifiedBadge size="lg" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-[var(--pl-text-primary)] flex items-center justify-center gap-2">
                        WhatsApp Verification <VerifiedBadge size="sm" />
                    </h2>
                    <p className="text-xs text-[var(--pl-text-secondary)] mt-1 max-w-xs mx-auto">
                        Verify your WhatsApp number to unlock the <strong>Daily Lucky Wheel</strong> and get your official <strong>Blue Verified Badge</strong>.
                    </p>
                </div>

                {step === 1 ? (
                    /* Step 1: Enter Phone Number */
                    <form onSubmit={handleSendOTP} className="space-y-4">
                        <div className="pl-input-group mb-2">
                            <label className="pl-label">WhatsApp Mobile Number</label>
                            <div className="pl-input-wrapper">
                                <input
                                    type="tel"
                                    className="pl-input"
                                    placeholder="e.g. 03001234567"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    autoFocus
                                    required
                                    disabled={loading}
                                    maxLength={11}
                                />
                            </div>
                            <span className="text-[11px] text-[var(--pl-text-muted)] mt-1.5 block">
                                Enter your 11-digit Pakistani WhatsApp number. A 6-digit OTP code will be sent.
                            </span>
                        </div>

                        <div className="p-3 rounded-xl bg-[var(--pl-bg-input)] border border-[var(--pl-border-subtle)] space-y-1 text-xs text-[var(--pl-text-secondary)]">
                            <div className="flex items-center gap-2 font-medium text-[var(--pl-text-primary)]">
                                <Sparkles className="w-3.5 h-3.5 text-[#8C56FC]" />
                                Verification Benefits:
                            </div>
                            <ul className="list-disc pl-5 text-[11px] text-[var(--pl-text-muted)] space-y-0.5">
                                <li>Instant Verified Blue Badge next to your name</li>
                                <li>Unlock Daily Spin on the Lucky Wheel for Cash &amp; Rewards</li>
                            </ul>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || phone.length < 10}
                            className="pl-btn pl-btn-primary w-full mt-3"
                            style={{ background: "#0095F6", borderColor: "#0095F6" }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Sending Code...
                                </span>
                            ) : (
                                "Send WhatsApp Code →"
                            )}
                        </button>
                    </form>
                ) : (
                    /* Step 2: Enter OTP Code */
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                        <div className="p-3 bg-[var(--pl-bg-input)] border border-[var(--pl-border-subtle)] rounded-xl text-center">
                            <p className="text-xs text-[var(--pl-text-secondary)]">
                                Enter the 6-digit code sent to:
                            </p>
                            <p className="text-sm font-bold text-[var(--pl-text-primary)] mt-0.5">
                                {phone}
                            </p>
                        </div>

                        <div className="pl-input-group mb-2">
                            <label className="pl-label text-center">6-Digit Verification Code</label>
                            <input
                                type="text"
                                className="pl-input text-center text-xl tracking-[0.3em] font-mono font-bold"
                                placeholder="••••••"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                autoFocus
                                required
                                disabled={loading}
                                maxLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.length < 4}
                            className="pl-btn pl-btn-primary w-full"
                            style={{ background: "#0095F6", borderColor: "#0095F6" }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                                </span>
                            ) : (
                                "Verify & Claim Blue Badge ✓"
                            )}
                        </button>

                        {/* Resend Code Button & Back to Edit */}
                        <div className="flex items-center justify-between text-xs pt-2">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-[var(--pl-text-muted)] hover:text-[var(--pl-text-primary)] transition-colors"
                            >
                                ← Change Number
                            </button>

                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={!canResend || loading}
                                className={`font-semibold ${
                                    canResend
                                        ? "text-[#0095F6] hover:underline"
                                        : "text-[var(--pl-text-muted)] cursor-not-allowed opacity-60"
                                }`}
                            >
                                {canResend ? "Resend Code" : `Resend in ${countdown}s`}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
