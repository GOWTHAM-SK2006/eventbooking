'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const FloatingBlobs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-[#FACC15]/10 blur-[80px] md:blur-[150px]"
      />
      <motion.div
        animate={{
          x: [0, -120, 80, 0],
          y: [0, 100, -70, 0],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] md:w-[700px] md:h-[700px] rounded-full bg-indigo-400/10 blur-[80px] md:blur-[160px]"
      />
      <motion.div
        animate={{
          x: [0, 60, -80, 0],
          y: [0, 90, 80, 0],
          scale: [1, 1.1, 0.85, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[30%] right-[10%] w-[250px] h-[250px] md:w-[500px] md:h-[500px] rounded-full bg-pink-400/10 blur-[70px] md:blur-[130px]"
      />
      <motion.div
        animate={{
          x: [0, -90, 50, 0],
          y: [0, -60, -90, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-[20%] left-[5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-cyan-400/10 blur-[60px] md:blur-[120px]"
      />
    </div>
  );
};

export const AnimatedParticles = () => {
  return null;
};

export default function AnimatedBackground() {
  return <FloatingBlobs />;
}
