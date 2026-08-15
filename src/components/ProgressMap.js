"use client";
import { useState } from "react";
import {
    CheckCircle2,
    Clock,
    Rocket,
    Server,
    Globe,
    LayoutDashboard,
    Smartphone,
    Users,
    ChevronRight,
    Sparkles
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
        color: "#10b981",
        tags: ["APIs v1", "MongoDB", "2FA Security", "KYC Engine"],
        completion: "100%"
    },
    {
        id: "phase-2",
        phase: "Phase 2",
        title: "Web Application & Portals",
        desc: "Complete responsive customer portal, verified agent dashboards, property listing engines, and live lead management.",
        status: "completed",
        statusText: "Completed",
        icon: Globe,
        color: "#10b981",
        tags: ["Customer Web", "Agent Dashboard", "Live Chat", "Society Maps"],
        completion: "100%"
    },
    {
        id: "phase-3",
        phase: "Phase 3",
        title: "Admin Command Center",
        desc: "Super admin management system for agent KYC approvals, dispute resolution, analytics, and notification broadcasting.",
        status: "completed",
        statusText: "Completed",
        icon: LayoutDashboard,
        color: "#10b981",
        tags: ["KYC Approvals", "Analytics", "Live Ticket Chat", "Notification Center"],
        completion: "100%"
    },
    {
        id: "phase-4",
        phase: "Phase 4 • Current Focus",
        title: "Mobile App Development",
        desc: "Native iOS & Android mobile applications with WebRTC voice/video calls, location-based lead discovery, and push notifications.",
        status: "active",
        statusText: "In Progress (85%)",
        icon: Smartphone,
        color: "#8C56FC",
        tags: ["iOS Native", "Android APK", "WebRTC Calling", "Push Notifications"],
        completion: "85%"
    },
    {
        id: "phase-5",
        phase: "Phase 5",
        title: "Private Beta & VIP Testing",
        desc: "Exclusive closed beta access for early registered agents and property seekers to stress-test high-traffic live bidding.",
        status: "upcoming",
        statusText: "Upcoming",
        icon: Users,
        color: "#FF8901",
        tags: ["Invite-Only", "Agent Feedback", "Performance Tuning"],
        completion: "0%"
    },
    {
        id: "phase-6",
        phase: "Phase 6",
        title: "Official Public Launch 🚀",
        desc: "Nationwide rollout across Pakistan with public App Store & Google Play releases and regional marketing campaigns.",
        status: "upcoming",
        statusText: "Target: 30 Days",
        icon: Rocket,
        color: "#64748b",
        tags: ["App Store", "Google Play", "Nationwide Campaign"],
        completion: "0%"
    },
];

export default function ProgressMap() {
    const [activeTab, setActiveTab] = useState(null);

    return (
        <div className="space-y-4">
            {/* Top Roadmap Progress Overview Bar */}
            <div className="p-4 rounded-2xl border border-[var(--pl-border-subtle)] bg-[var(--pl-bg-input)]">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#8C56FC] animate-pulse" />
                        <span className="text-xs font-semibold text-[var(--pl-text-primary)]">
                            Current Stage: Mobile App Engineering
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
                            background: "linear-gradient(90deg, #10b981 0%, #8C56FC 75%, #FF8901 100%)"
                        }}
                    />
                </div>

                <div className="flex justify-between items-center text-[10px] text-[var(--pl-text-muted)] mt-2 font-medium">
                    <span>Phase 1: Backend</span>
                    <span>Phase 4: Mobile (Active)</span>
                    <span>Phase 6: Public Launch</span>
                </div>
            </div>

            {/* Timeline Milestones List */}
            <div className="space-y-3 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-[2px] before:bg-[var(--pl-border-subtle)]">
                {MILESTONES.map((m, idx) => {
                    const Icon = m.icon;
                    const isCompleted = m.status === "completed";
                    const isActive = m.status === "active";
                    const isUpcoming = m.status === "upcoming";

                    return (
                        <div
                            key={m.id}
                            onClick={() => setActiveTab(activeTab === m.id ? null : m.id)}
                            className={`relative pl-12 sm:pl-14 transition-all cursor-pointer group`}
                        >
                            {/* Timeline Node Indicator */}
                            <div
                                className={`absolute left-3.5 -translate-x-1/2 top-4 w-7 h-7 rounded-full flex items-center justify-center border-2 z-10 transition-all ${
                                    isCompleted
                                        ? "bg-[#10b981] border-[#10b981] text-white shadow-sm"
                                        : isActive
                                        ? "bg-[#8C56FC] border-[#8C56FC] text-white ring-4 ring-[rgba(140,86,252,0.25)] shadow-lg animate-pulse"
                                        : "bg-[var(--pl-bg-card)] border-[var(--pl-border-subtle)] text-[var(--pl-text-muted)]"
                                }`}
                            >
                                {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : isActive ? (
                                    <span className="w-2 h-2 rounded-full bg-white" />
                                ) : (
                                    <span className="text-[11px] font-semibold">{idx + 1}</span>
                                )}
                            </div>

                            {/* Milestone Card */}
                            <div
                                className={`p-4 rounded-2xl border transition-all ${
                                    isActive
                                        ? "border-[#8C56FC] bg-[rgba(140,86,252,0.06)] shadow-md"
                                        : isCompleted
                                        ? "border-[var(--pl-border-subtle)] bg-[var(--pl-bg-input)] hover:border-[#10b981]"
                                        : "border-[var(--pl-border-subtle)] bg-[var(--pl-bg-input)] opacity-75 hover:opacity-100"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{
                                                background: isActive
                                                    ? "rgba(140, 86, 252, 0.15)"
                                                    : isCompleted
                                                    ? "rgba(16, 185, 129, 0.15)"
                                                    : "rgba(255, 255, 255, 0.05)",
                                                color: isCompleted ? "#10b981" : isActive ? "#8C56FC" : "var(--pl-text-muted)"
                                            }}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--pl-text-muted)]">
                                                    {m.phase}
                                                </span>
                                                <h3 className="font-semibold text-xs sm:text-sm text-[var(--pl-text-primary)]">
                                                    {m.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <span
                                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                                        style={{
                                            background: isCompleted
                                                ? "rgba(16, 185, 129, 0.15)"
                                                : isActive
                                                ? "rgba(140, 86, 252, 0.18)"
                                                : "rgba(255, 137, 1, 0.12)",
                                            color: isCompleted
                                                ? "#10b981"
                                                : isActive
                                                ? "#8C56FC"
                                                : "#FF8901"
                                        }}
                                    >
                                        {isCompleted ? "✓ " : isActive ? "⚡ " : "⏳ "}
                                        {m.statusText}
                                    </span>
                                </div>

                                <p className="text-xs text-[var(--pl-text-secondary)] mt-2 leading-relaxed pl-10">
                                    {m.desc}
                                </p>

                                {/* Tags Breakdown */}
                                <div className="flex flex-wrap gap-1.5 mt-3 pl-10">
                                    {m.tags.map((tag, tIdx) => (
                                        <span
                                            key={tIdx}
                                            className="text-[10px] font-medium px-2 py-0.5 rounded-md border border-[var(--pl-border-subtle)] bg-[var(--pl-bg-card)] text-[var(--pl-text-secondary)]"
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
