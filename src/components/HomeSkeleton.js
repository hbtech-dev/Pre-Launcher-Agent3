"use client";
import React from "react";
import PreLauncherLayout from "@/components/PreLauncherLayout";

export default function HomeSkeleton() {
    return (
        <PreLauncherLayout wide={true}>
            <div className="flex-1 flex flex-col py-2 space-y-6 animate-pulse-subtle">

                {/* Top Profile Card Shimmer */}
                <div className="pl-glass-card p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 border border-[#8C56FC]/20 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
                    {/* Left: Avatar & Info */}
                    <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl pl-shimmer flex-shrink-0" />
                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="h-5 sm:h-6 w-36 sm:w-48 pl-shimmer rounded-lg" />
                                <div className="h-5 w-24 pl-shimmer rounded-full" />
                            </div>
                            <div className="h-3.5 w-40 pl-shimmer rounded-md" />
                        </div>
                    </div>

                    {/* Center: Countdown Timer Shimmer */}
                    <div className="flex items-center justify-center gap-2 py-2 lg:py-0 lg:px-6">
                        {[1, 2, 3, 4].map((n) => (
                            <React.Fragment key={n}>
                                <div className="w-11 sm:w-12 h-12 pl-shimmer rounded-xl" />
                                {n < 4 && <div className="w-1 h-3 pl-shimmer rounded-full" />}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Right: Action Buttons Shimmer */}
                    <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap flex-shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[var(--pl-border-subtle)]">
                        <div className="h-9 w-28 pl-shimmer rounded-xl" />
                        <div className="h-9 w-24 pl-shimmer rounded-xl" />
                    </div>
                </div>

                {/* 4 Metric Cards Grid Shimmer */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="pl-glass-card p-4 sm:p-5 flex flex-col justify-between space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="h-3.5 w-20 pl-shimmer rounded-md" />
                                <div className="w-8 h-8 rounded-xl pl-shimmer flex-shrink-0" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-7 w-28 pl-shimmer rounded-lg" />
                                <div className="h-3 w-32 pl-shimmer rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main 2-Column Dashboard Grid Shimmer */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column — Roadmap Card Shimmer */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="pl-glass-card p-6 space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1.5">
                                    <div className="h-5 w-48 pl-shimmer rounded-lg" />
                                    <div className="h-3 w-36 pl-shimmer rounded-md" />
                                </div>
                                <div className="h-6 w-20 pl-shimmer rounded-full" />
                            </div>

                            {/* Roadmap Nodes Shimmer */}
                            <div className="space-y-4 pt-2">
                                {[1, 2, 3, 4].map((step) => (
                                    <div key={step} className="p-3 rounded-xl border border-[var(--pl-border-subtle)] pl-shimmer flex items-center justify-between h-14">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-white/10" />
                                            <div className="h-3.5 w-32 bg-white/15 rounded" />
                                        </div>
                                        <div className="h-4 w-16 bg-white/10 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column — 3D Pathway Shimmer */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="pl-glass-card p-6 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="space-y-1.5">
                                    <div className="h-5 w-52 pl-shimmer rounded-lg" />
                                    <div className="h-3 w-40 pl-shimmer rounded-md" />
                                </div>
                                <div className="h-6 w-24 pl-shimmer rounded-full" />
                            </div>

                            {/* 7 Feature Pathway Items Shimmer */}
                            <div className="space-y-2.5">
                                {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                                    <div key={item} className="p-3 rounded-xl border border-[var(--pl-border-subtle)] pl-shimmer flex items-center justify-between h-12">
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-lg bg-white/10" />
                                            <div className="h-3 w-40 bg-white/15 rounded" />
                                        </div>
                                        <div className="w-4 h-4 rounded-full bg-white/10" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </PreLauncherLayout>
    );
}
