"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { agentAPI } from "@/config/api";
import { secureStorage } from "@/utils/secureStorage";
import PreLauncherLayout from "@/components/PreLauncherLayout";
import { Eye, EyeOff, ArrowLeft, ShieldCheck, KeyRound } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function AgentLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // 2FA state
    const [is2FARequired, setIs2FARequired] = useState(false);
    const [tempToken, setTempToken] = useState("");
    const [maskedPhone, setMaskedPhone] = useState("");
    const [twoFACode, setTwoFACode] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const data = await agentAPI.login({ email, password });

            if (data.status === "2fa_required") {
                setTempToken(data.data?.tempToken || "");
                setMaskedPhone(data.data?.phone || "");
                setIs2FARequired(true);
                toast.success(data.message || "2FA verification code sent to your phone");
                setIsLoading(false);
                return;
            }

            if (data.status === "success") {
                const agentData = data.data?.agent || data.data?.user || {};
                const token = data.data?.token || "";
                const refreshToken = data.data?.refreshToken || "";
                const agentId = agentData._id || agentData.id || "";

                secureStorage.setUserSession(token, refreshToken, agentId, "agent");
                secureStorage.setUserProfile(agentData);

                toast.success(`Welcome, Agent ${agentData.fullName || agentData.name || ""}!`);
                setTimeout(() => {
                    router.push("/home");
                }, 400);
            } else {
                const msg = data.message || "Invalid email or password. Please verify your credentials.";
                setError(msg);
                toast.error(msg);
                setIsLoading(false);
            }
        } catch (err) {
            const msg = err.message || "Unable to reach the server. Please try again.";
            setError(msg);
            toast.error(msg);
            setIsLoading(false);
        }
    };

    const handle2FASubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const data = await agentAPI.verifyLogin2FA(twoFACode, tempToken);

            if (data.status === "success") {
                const agentData = data.data?.agent || data.data?.user || {};
                const token = data.data?.token || "";
                const refreshToken = data.data?.refreshToken || "";
                const agentId = agentData._id || agentData.id || "";

                secureStorage.setUserSession(token, refreshToken, agentId, "agent");
                secureStorage.setUserProfile(agentData);

                toast.success("2FA verified successfully!");
                setTimeout(() => {
                    router.push("/home");
                }, 400);
            } else {
                const msg = data.message || "Invalid 2FA code. Please try again.";
                setError(msg);
                toast.error(msg);
                setIsLoading(false);
            }
        } catch (err) {
            setError(err.message || "2FA verification failed.");
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "588084495149-vje0ntervc1o8tujusrlkiad027m8ile.apps.googleusercontent.com";
        const redirectUri = `${window.location.origin}/auth/google/callback`;
        const stateArr = new Uint8Array(16);
        window.crypto.getRandomValues(stateArr);
        const state = Array.from(stateArr).map((b) => b.toString(16).padStart(2, "0")).join("");

        sessionStorage.setItem("google_oauth_state", state);
        sessionStorage.setItem("google_oauth_type", "agent");

        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: "code",
            scope: "openid email profile",
            state: state,
            prompt: "select_account"
        });

        window.location.assign(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
    };

    return (
        <PreLauncherLayout>
            <Toaster position="top-center" />
            <div className="flex-1 flex flex-col justify-center py-4">
                <Link
                    href="/welcome"
                    className="inline-flex items-center gap-1.5 text-sm mb-4"
                    style={{ color: "var(--pl-text-secondary)", textDecoration: "none" }}
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Roles
                </Link>

                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1.5">
                        <h1 className="pl-heading">Agent Portal</h1>
                        <span className="pl-badge" style={{ background: "rgba(255, 137, 1, 0.12)", color: "#FF8901" }}>
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified
                        </span>
                    </div>
                    <p className="pl-subtext">Access your verified agent pre-launch hub</p>
                </div>

                <div className="pl-glass-card">
                    {error && (
                        <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {!is2FARequired ? (
                        <form onSubmit={handleLogin}>
                            <div className="pl-input-group">
                                <label className="pl-label">Registered Agent Email</label>
                                <input
                                    type="email"
                                    className="pl-input"
                                    placeholder="agent@agency.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="pl-input-group">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="pl-label" style={{ marginBottom: 0 }}>Password</label>
                                    <Link href="/forgot-password" style={{ textDecoration: "none" }}>
                                        <span className="pl-link text-xs">Forgot?</span>
                                    </Link>
                                </div>
                                <div className="pl-input-wrapper">
                                    <input
                                        type={showPw ? "text" : "password"}
                                        className="pl-input pl-input-with-icon"
                                        placeholder="Enter your agent password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete="current-password"
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

                            <button
                                type="submit"
                                className="pl-btn pl-btn-secondary mt-2"
                                disabled={isLoading}
                            >
                                {isLoading ? "Authenticating Agent..." : "Sign In as Verified Agent"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handle2FASubmit} className="space-y-4">
                            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-[var(--pl-text-secondary)] flex items-start gap-2">
                                <KeyRound className="w-4 h-4 text-[#8C56FC] mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-[var(--pl-text-primary)]">2-Factor Authentication Required</p>
                                    <p className="mt-0.5">Please enter the 6-digit verification code sent to {maskedPhone || "your phone"}.</p>
                                </div>
                            </div>

                            <div className="pl-input-group">
                                <label className="pl-label">Verification Code (OTP)</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    className="pl-input text-center tracking-widest text-lg font-semibold"
                                    placeholder="••••••"
                                    value={twoFACode}
                                    onChange={(e) => setTwoFACode(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                className="pl-btn pl-btn-secondary"
                                disabled={isLoading || twoFACode.length < 4}
                            >
                                {isLoading ? "Verifying Code..." : "Verify & Enter Portal"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setIs2FARequired(false)}
                                className="pl-btn pl-btn-outline text-xs"
                            >
                                ← Back to Email Login
                            </button>
                        </form>
                    )}

                    <div className="pl-divider">
                        <div className="pl-divider-line" />
                        <span className="pl-divider-text">or agent google login</span>
                        <div className="pl-divider-line" />
                    </div>

                    <button
                        type="button"
                        className="pl-btn pl-btn-google"
                        onClick={handleGoogleLogin}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Sign In with Google (Agent)
                    </button>
                </div>

                <p className="text-center mt-6 text-sm" style={{ color: "var(--pl-text-secondary)" }}>
                    Don&apos;t have an account?{" "}
                    <Link href="/agent/register" className="pl-link" style={{ color: "#FF8901" }}>
                        Register
                    </Link>
                </p>
            </div>
        </PreLauncherLayout>
    );
}
