'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="w-full flex flex-col items-center"
    >
      {children}
    </motion.div>
  );
};
