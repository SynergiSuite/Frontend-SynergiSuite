"use client"
import { Suspense, useRef, useEffect, useState } from "react";
import React from "react";
import Form from "./form";
import Footer from "./footer";
import { Loader } from "@/components/ui/loader";
import { useSearchParams } from "next/navigation";
import { gsap } from "gsap";

function SessionContent() {
    const [form, setForm] = useState('signup');
    const searchParams = useSearchParams();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const formParam = searchParams.get("form");
        
        if (formParam === "login") {
          setForm("login");
        } else if (formParam === "signup") {
          setForm("signup");
        }
    }, [searchParams]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const particles: Array<{
          x: number;
          y: number;
          originX: number;
          originY: number;
          size: number;
          vx: number;
          vy: number;
          angle: number;
          speed: number;
          color: string;
          alpha: number;
        }> = [];

        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 35 : 90;
        const connectionDistance = 110;
        const mouse = { x: -1000, y: -1000, active: false };

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const isAccent = Math.random() < 0.3; // 30% royal blue accent particles
          particles.push({
            x,
            y,
            originX: x,
            originY: y,
            size: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            angle: Math.random() * Math.PI * 2,
            speed: 0.03 + Math.random() * 0.04,
            color: isAccent ? "82, 113, 255" : "255, 255, 255",
            alpha: Math.random() * 0.4 + 0.2,
          });
        }

        const handleResize = () => {
          if (!canvas) return;
          width = canvas.width = window.innerWidth;
          height = canvas.height = window.innerHeight;
          
          // Re-anchor origins dynamically
          particles.forEach((p) => {
            p.originX = Math.random() * width;
            p.originY = Math.random() * height;
          });
        };

        const handleMouseMove = (e: MouseEvent) => {
          mouse.x = e.clientX;
          mouse.y = e.clientY;
          mouse.active = true;
        };

        const handleMouseLeave = () => {
          mouse.active = false;
          mouse.x = -1000;
          mouse.y = -1000;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);

        const updateAndDraw = () => {
          ctx.clearRect(0, 0, width, height);

          // Subtle futuristic grid lines
          ctx.strokeStyle = "rgba(82, 113, 255, 0.015)";
          ctx.lineWidth = 1;
          const gridSize = 100;
          for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
          }
          for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }

          // Update particles
          particles.forEach((p, idx) => {
            // Organic orbital drift around origin
            p.angle += p.speed;
            const driftX = Math.cos(p.angle) * 10;
            const driftY = Math.sin(p.angle) * 10;

            // Apply constant velocity
            p.originX += p.vx;
            p.originY += p.vy;

            // Wrap boundaries
            if (p.originX < 0) p.originX = width;
            if (p.originX > width) p.originX = 0;
            if (p.originY < 0) p.originY = height;
            if (p.originY > height) p.originY = 0;

            let targetX = p.originX + driftX;
            let targetY = p.originY + driftY;

            // Mouse repulsive interactive flow
            if (mouse.active) {
              const dx = targetX - mouse.x;
              const dy = targetY - mouse.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const maxDist = 160;

              if (dist < maxDist) {
                const force = (maxDist - dist) / maxDist; // 0 to 1
                const pushX = (dx / dist) * force * 45;
                const pushY = (dy / dist) * force * 45;
                targetX += pushX;
                targetY += pushY;
              }
            }

            // Smooth interpolation
            p.x += (targetX - p.x) * 0.08;
            p.y += (targetY - p.y) * 0.08;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
            ctx.fill();

            // Connect neighboring particles in starry web mesh
            for (let j = idx + 1; j < particles.length; j++) {
              const p2 = particles[j];
              const dx = p.x - p2.x;
              const dy = p.y - p2.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < connectionDistance) {
                const lineAlpha = (1 - dist / connectionDistance) * 0.08;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(82, 113, 255, ${lineAlpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            }
          });
        };

        // Smooth GSAP Ticker frame synchronization
        gsap.ticker.add(updateAndDraw);

        return () => {
          window.removeEventListener("resize", handleResize);
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("mouseleave", handleMouseLeave);
          gsap.ticker.remove(updateAndDraw);
        };
    }, []);

    const text = {
        subSignup: "Create a new account",
        subSignin: "Sign in your account",
        headSignup: "Register Account",
        headSignin: "Welcome Back"
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#030114] flex flex-col items-center justify-center px-4 py-8">
            {/* Background Canvas for Particles */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
            />
            
            {/* Futuristic ambient background glows */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#5271ff]/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] bg-[#3a4ec4]/10 rounded-full blur-[150px] pointer-events-none z-0" />

            {/* Content card */}
            <div className="relative w-full z-10 flex flex-col items-center justify-center">
                <Form text={text} form={form} />
                <Footer form={form} setForm={setForm} />
            </div>
        </div>
    );
}

export default function Session(){
    return (
        <Suspense fallback={<Loader />}>
            <SessionContent />
        </Suspense>
    );
}

