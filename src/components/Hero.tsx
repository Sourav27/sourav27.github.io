import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';

const DESCRIPTORS = ['GenAI PM', 'Builder', 'Strategist'];

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [descriptorIndex, setDescriptorIndex] = useState(0);

  // Mouse tracking for flashlight
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const { left, top } = containerRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        mouseX.set(x);
        mouseY.set(y);
        containerRef.current.style.setProperty('--x', `${x}px`);
        containerRef.current.style.setProperty('--y', `${y}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Rotating descriptors — cycle every 2.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setDescriptorIndex((i) => (i + 1) % DESCRIPTORS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-stone-950 cursor-none"
    >
      {/* Background grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Flashlight glow */}
      <motion.div
        className="fixed top-0 left-0 w-64 h-64 rounded-full bg-stone-100/5 blur-3xl pointer-events-none z-30 mix-blend-screen"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
      />

      {/* Flashlight overlay mask */}
      <motion.div
        className="absolute inset-0 z-20 bg-stone-100/5 mix-blend-overlay pointer-events-none"
        style={{
          maskImage: 'radial-gradient(circle 250px at var(--x) var(--y), black, transparent)',
          WebkitMaskImage: 'radial-gradient(circle 250px at var(--x) var(--y), black, transparent)',
        }}
      />

      {/* Sharp cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-stone-100 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
      />

      {/* Main content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-6xl mx-auto">

        {/* Name */}
        <motion.h1
          className="text-[clamp(48px,8vw,88px)] font-light text-stone-100 leading-none tracking-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        >
          Sourav Debnath
        </motion.h1>

        {/* Rotating descriptor */}
        <div className="h-9 overflow-hidden mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={descriptorIndex}
              className="text-2xl text-stone-400 font-light"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, delay: 0.3, ease: 'easeOut' }}
            >
              {DESCRIPTORS[descriptorIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Inline CTAs */}
        <motion.div
          className="flex gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <a
            href="https://linkedin.com/in/souravdebnath"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-stone-400 hover:text-stone-100 transition-colors duration-200"
          >
            LinkedIn
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-stone-400 hover:text-stone-100 transition-colors duration-200"
          >
            Resume
          </a>
          <a
            href="https://github.com/sourav27"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-stone-400 hover:text-stone-100 transition-colors duration-200"
          >
            GitHub
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <motion.div
          className="w-px h-10 bg-stone-700"
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originY: 0 }}
        />
        <span className="text-[10px] uppercase tracking-widest text-stone-600">scroll</span>
      </motion.div>
    </div>
  );
};
