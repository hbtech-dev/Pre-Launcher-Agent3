"use client";
import { useEffect, useRef } from "react";

const CONFETTI_COLORS = [
    "#8C56FC", "#FF8901", "#a855f7", "#10b981",
    "#fbbf24", "#f472b6", "#60a5fa", "#34d399",
    "#e879f9", "#fb923c", "#38bdf8", "#facc15",
];

const SHAPES = ["circle", "square", "star", "ribbon"];

function randomBetween(a, b) {
    return a + Math.random() * (b - a);
}

function createConfetti(canvas) {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return {
        x: Math.random() * canvas.width,
        y: randomBetween(-canvas.height * 0.3, -20),
        size: randomBetween(4, 10),
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        speedY: randomBetween(0.6, 2.2),
        speedX: randomBetween(-0.8, 0.8),
        rotation: Math.random() * 360,
        rotationSpeed: randomBetween(-3, 3),
        wobble: randomBetween(0.5, 2),
        wobbleSpeed: randomBetween(0.02, 0.06),
        wobbleOffset: Math.random() * Math.PI * 2,
        opacity: randomBetween(0.55, 0.95),
        shape,
        // For ribbons
        width: randomBetween(3, 6),
        height: randomBetween(10, 18),
    };
}

function drawStar(ctx, cx, cy, size) {
    const spikes = 5;
    const outerR = size;
    const innerR = size * 0.45;
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
        ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
        rot += step;
        ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerR);
    ctx.closePath();
    ctx.fill();
}

export default function Particles() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animId;
        let pieces = [];
        let tick = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Initial burst
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 100);
        for (let i = 0; i < count; i++) {
            const p = createConfetti(canvas);
            p.y = Math.random() * canvas.height; // spread across screen initially
            pieces.push(p);
        }

        const draw = () => {
            tick++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Slowly add new confetti
            if (tick % 12 === 0 && pieces.length < 120) {
                pieces.push(createConfetti(canvas));
            }

            pieces.forEach((p) => {
                p.y += p.speedY;
                p.x += p.speedX + Math.sin(p.wobbleOffset + tick * p.wobbleSpeed) * p.wobble;
                p.rotation += p.rotationSpeed;

                // Wrap around
                if (p.y > canvas.height + 30) {
                    p.y = randomBetween(-40, -10);
                    p.x = Math.random() * canvas.width;
                }
                if (p.x < -20) p.x = canvas.width + 20;
                if (p.x > canvas.width + 20) p.x = -20;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;

                if (p.shape === "circle") {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (p.shape === "square") {
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                } else if (p.shape === "star") {
                    drawStar(ctx, 0, 0, p.size / 2);
                } else if (p.shape === "ribbon") {
                    ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
                }

                ctx.restore();
            });

            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 0,
            }}
        />
    );
}
