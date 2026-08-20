"use client";
import { useState } from "react";
import Link from "next/link";
import { authAPI } from "@/config/api";
import PreLauncherLayout from "@/components/PreLauncherLayout";
import { ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const data = await authAPI.forgotPassword(email);

            if (data.status === "success") {
                setIsSubmitted(true);
                toast.success(data.message || "Password reset instructions sent to your email!");
            } else {
                const msg = data.message || "Something went wrong. Please check your email and try again.";
                setError(msg);
                toast.error(msg);
            }
        } catch (err) {
            const msg = err.message || "Unable to reach server. Please try again later.";
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PreLauncherLayout>
            <Toaster position="top-center" />
            <div className="flex-1 flex flex-col justify-center py-4">
                <Link
                    href="/welcome"
                    className="inline-flex items-center gap-1.5 text-sm mb-4 animate-fade-in"
                    style={{ color: "var(--pl-text-secondary)", textDecoration: "none" }}
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Roles
                </Link>

                <div className="mb-6">
                    <h1 className="pl-heading mb-1.5">Forgot Password?</h1>
                    <p className="pl-subtext">Enter your email address to receive password reset instructions</p>
                </div>

                <div className="pl-glass-card">
                    {error && (
                        <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit}>
                            <div className="pl-input-group">
                                <label className="pl-label">Registered Email Address</label>
                                <div className="pl-input-wrapper">
                                    <input
                                        type="email"
                                        className="pl-input"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="pl-btn pl-btn-primary mt-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
                                        Sending Instructions...
                                    </>
                                ) : (
                                    "Send Reset Instructions"
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-500 text-2xl">
                                📩
                            </div>
                            <h3 className="font-semibold text-lg text-[var(--pl-text-primary)] mb-2">Check Your Email</h3>
                            <p className="text-xs sm:text-sm text-[var(--pl-text-secondary)] leading-relaxed mb-6">
                                We've sent password reset instructions to <strong className="text-[var(--pl-text-primary)]">{email}</strong>. Please check your inbox and spam folders.
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsSubmitted(false)}
                                className="pl-btn pl-btn-outline w-full text-xs"
                                style={{ padding: "10px 8px" }}
                            >
                                Re-enter email address
                            </button>
                        </div>
                    )}
                </div>

                <div className="text-center mt-6 text-sm" style={{ color: "var(--pl-text-secondary)" }}>
                    Remember your password?{" "}
                    <Link href="/welcome" className="pl-link">
                        Sign In
                    </Link>
                </div>
            </div>
        </PreLauncherLayout>
    );
}
