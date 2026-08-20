"use client";
import {
    CheckCircle2,
    Server,
    Globe,
    LayoutDashboard,
    Smartphone,
    Users,
    Rocket
} from "lucide-react";

const MILESTONES = [
    {
        id: "phase-1",
        phase: "Phase 1",
        title: "Backend Infrastructure & Security",
        desc: "High-performance Node.js & MongoDB architecture with 2FA, JWT token rotations, and encrypted KYC pipelines.",
        status: "completed",
        statusText: "Completed",
        icon: Server,
        tags: ["APIs v1", "MongoDB", "2FA Security", "KYC Engine"]
    },
    {
        id: "phase-2",
        phase: "Phase 2",
        title: "Web Application & Portals",
        desc: "Complete responsive host portal, verified agent dashboards, property listing engines, and live lead management.",
        status: "completed",
        statusText: "Completed",
        icon: Globe,
        tags: ["Host Web", "Agent Dashboard", "Live Chat", "Society Maps"]
    },
    {
        id: "phase-3",
        phase: "Phase 3",
        title: "Admin Command Center",
        desc: "Super admin management system for agent KYC approvals, dispute resolution, analytics, and notification broadcasting.",
        status: "completed",
        statusText: "Completed",
        icon: LayoutDashboard,
        tags: ["KYC Approvals", "Analytics", "Live Ticket Chat", "Notification Center"]
    },
    {
        id: "phase-4",
        phase: "Phase 4",
        title: "Mobile App Engineering",
        desc: "Native iOS & Android mobile applications with real-time chat, in-app audio calls, location-based lead discovery, and push notifications.",
        status: "active",
        statusText: "In Progress (80%)",
        icon: Smartphone,
        tags: ["iOS Native", "Android APK", "Audio Calling", "Live Chat", "Push Notifications"]
    },
    {
        id: "phase-5",
        phase: "Phase 5",
        title: "Private Beta & VIP Testing",
        desc: "Exclusive closed beta access for early registered agents and property seekers to test high-traffic live matching.",
        status: "upcoming",
        statusText: "Upcoming",
        icon: Users,
        tags: ["Invite-Only", "Agent Feedback", "Performance Tuning"]
    },
    {
        id: "phase-6",
        phase: "Phase 6",
        title: "Official Public Launch",
        desc: "Nationwide rollout across Pakistan with public App Store & Google Play releases and regional marketing campaigns.",
        status: "upcoming",
        statusText: "Target: 30 Days",
        icon: Rocket,
        tags: ["App Store", "Google Play", "Nationwide Campaign"]
    },
];

export default function ProgressMap() {
    return (
        <div className="space-y-4">
            {/* Top Roadmap Progress Overview Bar */}
            <div className="p-4 rounded-xl border border-[var(--pl-border-subtle)] bg-[var(--pl-bg-input)]">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#8C56FC] animate-pulse" />
                        <span className="text-xs font-semibold text-[var(--pl-text-primary)]">
                            Current Milestone: Phase 4 (Mobile Engineering)
                        </span>
                    </div>
                    <span className="text-xs font-semibold text-[#8C56FC]">
                        80% Overall Progress
                    </span>
                </div>

                {/* Progress Visual Bar */}
                <div className="w-full h-2 rounded-full bg-[var(--pl-bg-card)] overflow-hidden p-0.5 border border-[var(--pl-border-subtle)]">
                    <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                            width: "80%",
                            background: "linear-gradient(90deg, #8C56FC 0%, #a855f7 70%, #FF8901 100%)"
                        }}
                    />
                </div>

                <div className="flex justify-between items-center text-[10px] text-[var(--pl-text-muted)] mt-2 font-medium">
                    <span>Phase 1: Backend</span>
                    <span className="text-[#8C56FC] font-semibold">Phase 4: Mobile App (Active)</span>
                    <span>Phase 6: Launch</span>
                </div>
            </div>

            {/* Clean & Minimalist Roadmap Timeline */}
            <div className="pl-roadmap-timeline">
                {MILESTONES.map((m, idx) => {
                    const isCompleted = m.status === "completed";
                    const isActive = m.status === "active";

                    return (
                        <div
                            key={m.id}
                            className={`pl-roadmap-card ${
                                isCompleted ? "completed" : isActive ? "active" : ""
                            }`}
                        >
                            {/* Step Node */}
                            <div className="pl-roadmap-node">
                                {isCompleted ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#8C56FC]" />
                                ) : (
                                    <span>{idx + 1}</span>
                                )}
                            </div>

                            {/* Milestone Header (Always Visible) */}
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--pl-text-muted)] flex-shrink-0">
                                        {m.phase}
                                    </span>
                                    <h3 className="font-semibold text-xs sm:text-sm text-[var(--pl-text-primary)] truncate">
                                        {m.title}
                                    </h3>
                                </div>

                                <span
                                    className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0"
                                    style={{
                                        background: isActive
                                            ? "rgba(140, 86, 252, 0.15)"
                                            : isCompleted
                                            ? "rgba(140, 86, 252, 0.08)"
                                            : "rgba(255, 255, 255, 0.05)",
                                        color: isActive
                                            ? "#8C56FC"
                                            : isCompleted
                                            ? "#8C56FC"
                                            : "var(--pl-text-muted)",
                                        border: isActive
                                            ? "1px solid rgba(140, 86, 252, 0.3)"
                                            : "1px solid var(--pl-border-subtle)"
                                    }}
                                >
                                    {isCompleted ? "✓ " : isActive ? "⚡ " : "⏳ "}
                                    {m.statusText}
                                </span>
                            </div>

                            {/* Hover-Expanded Drawer */}
                            <div className="pl-hover-drawer">
                                <p className="text-xs text-[var(--pl-text-secondary)] leading-relaxed pt-2 border-t border-[var(--pl-border-subtle)]">
                                    {m.desc}
                                </p>

                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {m.tags.map((tag, tIdx) => (
                                        <span
                                            key={tIdx}
                                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[var(--pl-bg-card)] text-[var(--pl-text-secondary)] border border-[var(--pl-border-subtle)]"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


