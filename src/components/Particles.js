"use client";
import { useEffect, useRef } from "react";

const CONFETTI_COLORS = [
    "#8C56FC", "#FF8901", "#a855f7", "#10b981",
    "#fbbf24", "#f472b6", "#60a5fa", "#34d399",
    "#e879f9", "#fb923c", "#38bdf8", "#facc15",
];

const CELEBRATION_COLORS = [
    "#f59e0b", "#fbbf24", "#facc15", "#8C56FC",
    "#a855f7", "#ec4899", "#10b981", "#38bdf8",
    "#ffffff", "#f43f5e", "#6366f1"
];

const SHAPES = ["circle", "square", "star", "ribbon"];
const CELEBRATION_SHAPES = ["star", "ribbon", "circle", "sparkle", "trophy_glow"];

function randomBetween(a, b) {
    return a + Math.random() * (b - a);
}

function createConfetti(canvas, isCelebration = false) {
    const shapeList = isCelebration ? CELEBRATION_SHAPES : SHAPES;
    const colorList = isCelebration ? CELEBRATION_COLORS : CONFETTI_COLORS;
    const shape = shapeList[Math.floor(Math.random() * shapeList.length)];
    
    return {
        x: Math.random() * canvas.width,
        y: randomBetween(-canvas.height * 0.3, -20),
        size: isCelebration ? randomBetween(5, 13) : randomBetween(4, 10),
        color: colorList[Math.floor(Math.random() * colorList.length)],
        speedY: isCelebration ? randomBetween(0.8, 2.8) : randomBetween(0.6, 2.2),
        speedX: randomBetween(-1.2, 1.2),
        rotation: Math.random() * 360,
        rotationSpeed: randomBetween(-4, 4),
        wobble: randomBetween(0.8, 2.6),
        wobbleSpeed: randomBetween(0.025, 0.07),
        wobbleOffset: Math.random() * Math.PI * 2,
        opacity: randomBetween(0.6, 1),
        shape,
        // For ribbons
        width: isCelebration ? randomBetween(4, 8) : randomBetween(3, 6),
        height: isCelebration ? randomBetween(12, 24) : randomBetween(10, 18),
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

function drawSparkle(ctx, cx, cy, size) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.quadraticCurveTo(cx, cy, cx + size, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy + size);
    ctx.quadraticCurveTo(cx, cy, cx - size, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy - size);
    ctx.closePath();
    ctx.fill();
}

export default function Particles({ variant = "default" }) {
    const canvasRef = useRef(null);
    const isCelebration = variant === "celebration";

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
        const densityDivisor = isCelebration ? 5000 : 8000;
        const maxLimit = isCelebration ? 160 : 100;
        const count = Math.min(Math.floor((canvas.width * canvas.height) / densityDivisor), maxLimit);
        
        for (let i = 0; i < count; i++) {
            const p = createConfetti(canvas, isCelebration);
            p.y = Math.random() * canvas.height;
            pieces.push(p);
        }

        const draw = () => {
            tick++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Add new celebration confetti
            const addRate = isCelebration ? 8 : 12;
            const maxPieces = isCelebration ? 180 : 120;
            if (tick % addRate === 0 && pieces.length < maxPieces) {
                pieces.push(createConfetti(canvas, isCelebration));
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
                } else if (p.shape === "sparkle" || p.shape === "trophy_glow") {
                    drawSparkle(ctx, 0, 0, p.size);
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
    }, [isCelebration]);

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
