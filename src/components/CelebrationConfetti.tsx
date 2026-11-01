"use client";

import { useEffect, useRef } from "react";

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  tilt: number;
  vt: number;
  color: string;
  shape: "rect" | "circle";
  life: number;
};

// Kailash theme blue, accent orange, yellow, plus green to match the success tick
const COLORS = ["#133B76", "#1E56A8", "#F7931E", "#FBBF24", "#22A06B", "#3DBE84"];

/**
 * Lightweight celebration confetti (no dependency).
 * Fires a burst from behind the success icon plus two side cannons, then cleans itself up.
 * `originRef` is the element the centre burst comes from.
 */
export default function CelebrationConfetti({
  originRef,
  delay = 300,
}: {
  originRef: React.RefObject<HTMLElement>;
  delay?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    } catch (e) {}

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf = 0;
    let pieces: Piece[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const make = (x: number, y: number, angle: number, spread: number, speed: number): Piece => {
      const a = ((angle + rand(-spread / 2, spread / 2)) * Math.PI) / 180;
      const v = speed * rand(0.55, 1);
      return {
        x,
        y,
        vx: Math.cos(a) * v,
        vy: -Math.sin(a) * v,
        w: rand(6, 10),
        h: rand(3, 6),
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.25, 0.25),
        tilt: rand(0, Math.PI * 2),
        vt: rand(0.08, 0.18),
        color: COLORS[(Math.random() * COLORS.length) | 0],
        shape: Math.random() < 0.25 ? "circle" : "rect",
        life: 1,
      };
    };

    const fire = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const small = vw < 640;
      const scale = small ? 0.8 : 1;

      // Centre burst from behind the tick
      const r = originRef.current?.getBoundingClientRect();
      const cx = r ? r.left + r.width / 2 : vw / 2;
      const cy = r ? r.top + r.height / 2 : vh * 0.25;
      for (let i = 0; i < Math.round(70 * scale); i++) pieces.push(make(cx, cy, 90, 360, rand(6, 12)));

      // Two side cannons a moment later
      setTimeout(() => {
        for (let i = 0; i < Math.round(45 * scale); i++) {
          pieces.push(make(-10, vh * 0.55, 62, 40, rand(13, 19) * (small ? 0.85 : 1)));
          pieces.push(make(vw + 10, vh * 0.55, 118, 40, rand(13, 19) * (small ? 0.85 : 1)));
        }
      }, 140);
    };

    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 2.5); // frame-rate independent
      last = now;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      pieces = pieces.filter((p) => p.life > 0 && p.y < window.innerHeight + 40);
      for (const p of pieces) {
        p.vx *= Math.pow(0.985, dt);
        p.vy = p.vy * Math.pow(0.985, dt) + 0.32 * dt; // air drag + gravity
        p.x += p.vx * dt + Math.sin(p.tilt) * 0.6; // gentle flutter
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        p.tilt += p.vt * dt;
        p.life -= 0.0055 * dt;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.6));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, Math.cos(p.tilt)); // 3D flip effect
        ctx.fillStyle = p.color;
        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.h * 0.7, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }

      if (pieces.length) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const start = setTimeout(() => {
      fire();
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }, delay);

    window.addEventListener("resize", resize);
    return () => {
      clearTimeout(start);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [originRef, delay]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[60]"
    />
  );
}
