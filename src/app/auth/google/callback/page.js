"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { secureStorage } from "@/utils/secureStorage";
import PreLauncherLayout from "@/components/PreLauncherLayout";

export const dynamic = 'force-dynamic';

function GoogleCallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState("");
    const [status, setStatus] = useState("Completing Google Sign In...");

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get("code");
            const state = searchParams.get("state");
            const errorParam = searchParams.get("error");

            if (errorParam) {
                setError(errorParam);
                return;
            }

            if (!code) {
                setError("Missing Google authorization code");
                return;
            }

            const expectedState = sessionStorage.getItem("google_oauth_state");
            const oauthType = sessionStorage.getItem("google_oauth_type") || "user";

            if (!expectedState || !state || state !== expectedState) {
                setError("Invalid login session state. Please retry.");
                return;
            }

            sessionStorage.removeItem("google_oauth_state");
            sessionStorage.removeItem("google_oauth_type");

            try {
                const redirectUri = `${window.location.origin}/auth/google/callback`;
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend-server-agent3-production.up.railway.app";

                if (oauthType === 'agent') {
                    setStatus("Verifying Agent profile...");
                    const res = await fetch(`${apiUrl}/api/v1/agent/google/code`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ code, redirectUri })
                    });
                    const data = await res.json();

                    if (!res.ok || (data?.status !== "success" && data?.status !== "2fa_required")) {
                        throw new Error(data?.message || data?.error || "Agent Google verification failed");
                    }

                    const agent = data.data?.agent || data.data?.user || {};
                    const agentId = agent._id || agent.id || '';

                    secureStorage.setUserSession(
                        data.data?.token || "agent_google_token",
                        data.data?.refreshToken || "",
                        agentId,
                        "agent"
                    );
                    secureStorage.setUserProfile(agent);
                } else {
                    setStatus("Verifying Customer profile...");
                    const res = await fetch(`${apiUrl}/api/v1/auth/google/code`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ code, redirectUri })
                    });
                    const data = await res.json();

                    if (!res.ok || data?.status !== "success") {
                        throw new Error(data?.message || data?.error || "Customer Google verification failed");
                    }

                    const user = data.data?.user || {};
                    const userId = user._id || user.id || '';

                    secureStorage.setUserSession(
                        data.data?.token || "user_google_token",
                        data.data?.refreshToken || "",
                        userId,
                        "user"
                    );
                    secureStorage.setUserProfile(user);
                }

                router.replace("/home");
            } catch (err) {
                console.error("Google Auth error:", err);
                setError(err.message || "Failed to complete Google authentication");
            }
        };

        handleCallback();
    }, [searchParams, router]);

    return (
        <PreLauncherLayout>
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <div className="pl-glass-card max-w-sm w-full p-8">
                    {error ? (
                        <div>
                            <div className="text-3xl mb-3">⚠️</div>
                            <h2 className="font-semibold text-lg text-[var(--pl-text-primary)] mb-2">Authentication Failed</h2>
                            <p className="text-xs text-red-400 mb-6">{error}</p>
                            <button
                                onClick={() => router.push("/welcome")}
                                className="pl-btn pl-btn-primary text-xs"
                            >
                                Back to Welcome
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="w-10 h-10 border-3 border-[#8C56FC] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <h2 className="font-semibold text-base text-[var(--pl-text-primary)] mb-1">{status}</h2>
                            <p className="text-xs text-[var(--pl-text-muted)]">Securely connecting to Agent3 cloud</p>
                        </div>
                    )}
                </div>
            </div>
        </PreLauncherLayout>
    );
}

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#8C56FC] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <GoogleCallbackHandler />
        </Suspense>
    );
}
