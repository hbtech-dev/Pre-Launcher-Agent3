"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI } from "@/config/api";
import PreLauncherLayout from "@/components/PreLauncherLayout";
import { Eye, EyeOff, ArrowLeft, ShieldAlert, CheckCircle2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setIsVerifying(false);
            setIsValid(false);
            setError("No reset token provided. Please request a new password reset link.");
            return;
        }

        const verifyToken = async () => {
            try {
                const data = await authAPI.verifyResetToken(token);
                if (data.status === "success") {
                    setIsValid(true);
                    setEmail(data.data?.email || "");
                } else {
                    setIsValid(false);
                    setError(data.message || "This password reset link is invalid or has expired.");
                }
            } catch (err) {
                setIsValid(false);
                setError("Unable to verify reset token. Please try again later.");
            } finally {
                setIsVerifying(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleReset = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            toast.error("Passwords do not match!");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            toast.error("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);

        try {
            const data = await authAPI.resetPassword(token, password);

            if (data.status === "success") {
                setIsSuccess(true);
                toast.success("Password reset successfully!");
            } else {
                const msg = data.message || "Reset failed. Please request a new link.";
                setError(msg);
                toast.error(msg);
            }
        } catch (err) {
            const msg = err.message || "An error occurred. Please try again.";
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    if (isVerifying) {
        return (
            <div className="text-center py-12">
                <div className="w-10 h-10 rounded-full border-3 border-[#8C56FC] border-t-transparent animate-spin mx-auto mb-4" />
                <p className="text-sm text-[var(--pl-text-secondary)] font-medium">Verifying reset token...</p>
            </div>
        );
    }

    if (!isValid) {
        return (
            <div className="text-center py-6">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-500">
                    <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg text-[var(--pl-text-primary)] mb-2">Invalid Reset Link</h3>
                <p className="text-xs sm:text-sm text-[var(--pl-text-secondary)] leading-relaxed mb-6">
                    {error || "This password reset token is invalid or has expired."}
                </p>
                <Link href="/forgot-password" style={{ textDecoration: "none" }}>
                    <button className="pl-btn pl-btn-primary w-full">
                        Request New Link
                    </button>
                </Link>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-500">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg text-[var(--pl-text-primary)] mb-2">Password Updated</h3>
                <p className="text-xs sm:text-sm text-[var(--pl-text-secondary)] leading-relaxed mb-6">
                    Your password has been changed successfully. You can now use your new credentials to sign in.
                </p>
                <Link href="/welcome" style={{ textDecoration: "none" }}>
                    <button className="pl-btn pl-btn-primary w-full">
                        Go to Login
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleReset}>
            <div className="mb-4 p-3 bg-[var(--pl-bg-secondary)] border border-[var(--pl-border-subtle)] rounded-xl text-xs text-[var(--pl-text-secondary)]">
                Resetting password for: <strong className="text-[var(--pl-text-primary)]">{email}</strong>
            </div>

            {error && (
                <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium flex items-center gap-2">
                    <span>⚠️</span> {error}
                </div>
            )}

            <div className="pl-input-group">
                <label className="pl-label">New Password</label>
                <div className="pl-input-wrapper">
                    <input
                        type={showPw ? "text" : "password"}
                        className="pl-input pl-input-with-icon"
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        className="pl-icon-btn"
                        onClick={() => setShowPw(!showPw)}
                        aria-label="Toggle password visibility"
                    >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div className="pl-input-group">
                <label className="pl-label">Confirm New Password</label>
                <div className="pl-input-wrapper">
                    <input
                        type={showConfirmPw ? "text" : "password"}
                        className="pl-input pl-input-with-icon"
                        placeholder="Repeat new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        className="pl-icon-btn"
                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                        aria-label="Toggle password visibility"
                    >
                        {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                className="pl-btn pl-btn-primary mt-2"
                disabled={isLoading}
            >
                {isLoading ? "Saving New Password..." : "Update Password"}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <PreLauncherLayout>
            <Toaster position="top-center" />
            <div className="flex-1 flex flex-col justify-center py-4">
                <div className="mb-6">
                    <h1 className="pl-heading mb-1.5">Reset Password</h1>
                    <p className="pl-subtext">Choose a secure new password for your account</p>
                </div>

                <div className="pl-glass-card">
                    <Suspense fallback={
                        <div className="text-center py-12">
                            <div className="w-10 h-10 rounded-full border-3 border-[#8C56FC] border-t-transparent animate-spin mx-auto mb-4" />
                            <p className="text-sm text-[var(--pl-text-secondary)] font-medium">Loading...</p>
                        </div>
                    }>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </PreLauncherLayout>
    );
}
