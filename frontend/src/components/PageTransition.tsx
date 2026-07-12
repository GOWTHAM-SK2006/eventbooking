'use client';

import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname();

  const variants = {
    hidden: {
      opacity: 0,
      y: 8,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -8,
      transition: {
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
