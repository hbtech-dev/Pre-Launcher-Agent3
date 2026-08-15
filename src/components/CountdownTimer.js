"use client";
import { useState, useEffect, useCallback } from "react";

export default function CountdownTimer({ targetDate }) {
    const calcRemaining = useCallback(() => {
        const now = new Date().getTime();
        const target = new Date(targetDate).getTime();
        const diff = Math.max(0, target - now);
        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
        };
    }, [targetDate]);

    const [time, setTime] = useState(calcRemaining);

    useEffect(() => {
        const interval = setInterval(() => setTime(calcRemaining()), 1000);
        return () => clearInterval(interval);
    }, [calcRemaining]);

    const pad = (n) => String(n).padStart(2, "0");

    return (
        <div className="pl-countdown pl-stagger-3">
            <div className="pl-countdown-unit">
                <span className="pl-countdown-value">{pad(time.days)}</span>
                <span className="pl-countdown-label">Days</span>
            </div>
            <span className="pl-countdown-sep">:</span>
            <div className="pl-countdown-unit">
                <span className="pl-countdown-value">{pad(time.hours)}</span>
                <span className="pl-countdown-label">Hours</span>
            </div>
            <span className="pl-countdown-sep">:</span>
            <div className="pl-countdown-unit">
                <span className="pl-countdown-value">{pad(time.minutes)}</span>
                <span className="pl-countdown-label">Mins</span>
            </div>
            <span className="pl-countdown-sep">:</span>
            <div className="pl-countdown-unit">
                <span className="pl-countdown-value">{pad(time.seconds)}</span>
                <span className="pl-countdown-label">Secs</span>
            </div>
        </div>
    );
}
