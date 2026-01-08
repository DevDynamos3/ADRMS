'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function BackgroundAnimation() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Soft Ambient Blobs */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-emerald-100/30 rounded-full blur-[120px]"
            />

            <motion.div
                animate={{
                    x: [0, -80, 0],
                    y: [0, 120, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[20%] -right-[5%] w-[40%] h-[40%] bg-blue-100/20 rounded-full blur-[100px]"
            />

            <motion.div
                animate={{
                    x: [0, 50, 0],
                    y: [0, -100, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] bg-emerald-50/40 rounded-full blur-[150px]"
            />

            {/* Floating Geometric Particles */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        opacity: 0.1
                    }}
                    animate={{
                        y: ["-20%", "120%"],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: Math.random() * 20 + 20,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 10
                    }}
                    className="absolute h-16 w-16 border border-emerald-200/20 rounded-2xl"
                    style={{
                        transform: `rotate(${Math.random() * 45}deg)`
                    }}
                />
            ))}

            {/* Grid Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(#10b981 0.5px, transparent 0.5px)`,
                    backgroundSize: '24px 24px'
                }}
            ></div>
        </div>
    )
}
