"use client";
import { useState } from "react";

export default function GiftBox() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="pl-stagger-4" style={{ textAlign: "center" }}>
            <div
                className={`pl-gift-box ${isOpen ? "pl-gift-box--open" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
                role="button"
                tabIndex={0}
                aria-label="Open gift box"
            >
                {/* Ribbon */}
                <div className="pl-gift-box-ribbon" />
                {/* Bow */}
                <div className="pl-gift-box-bow">🎀</div>
                {/* Lid */}
                <div className="pl-gift-box-lid" />
                {/* Body */}
                <div className="pl-gift-box-body" />
                {/* Reveal Content */}
                <div className="pl-gift-reveal">
                    <span style={{ fontSize: 28 }}>🎉</span>
                </div>
            </div>

            <div style={{ marginTop: 16, minHeight: 48 }}>
                {isOpen ? (
                    <div style={{ animation: "pl-fadeInUp 0.4s ease" }}>
                        <p style={{
                            fontSize: 15,
                            fontWeight: 700,
                            background: "var(--pl-accent-gradient)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}>
                            🎁 Early Access Reward!
                        </p>
                        <p style={{
                            fontSize: 12,
                            color: "var(--pl-text-secondary)",
                            marginTop: 4,
                        }}>
                            You&apos;re in! Get exclusive early-bird benefits when we launch.
                        </p>
                    </div>
                ) : (
                    <p style={{
                        fontSize: 13,
                        color: "var(--pl-text-muted)",
                        cursor: "pointer",
                    }}>
                        Tap the gift to reveal your reward 🎁
                    </p>
                )}
            </div>
        </div>
    );
}
