'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const FloatingBlobs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Primary gradient blob */}
      <motion.div
        className="absolute w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        style={{
          background: 'linear-gradient(135deg, #FACC15 0%, #EAB308 100%)',
          top: '-10%',
          right: '-5%',
        }}
        animate={{
          y: [0, 50, 0],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary gradient blob */}
      <motion.div
        className="absolute w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-15"
        style={{
          background: 'linear-gradient(135deg, #FAFAFA 0%, #F3F4F6 100%)',
          bottom: '-10%',
          left: '10%',
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Tertiary accent blob */}
      <motion.div
        className="absolute w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        style={{
          background: 'linear-gradient(135deg, #FACC15 0%, #FAFAFA 100%)',
          bottom: '20%',
          right: '10%',
        }}
        animate={{
          y: [0, 40, 0],
          x: [0, -40, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export const AnimatedParticles = ({ count = 30 }) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-[#FACC15] rounded-full opacity-0"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -300, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

export default function AnimatedBackground() {
  return (
    <>
      <FloatingBlobs />
      <AnimatedParticles />
    </>
  );
}
