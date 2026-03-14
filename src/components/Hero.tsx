import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ROLES = ['GenAI PM.', 'Builder.', 'Strategist.'];
const TYPE_SPEED = 80;
const DELETE_SPEED = 40;
const PAUSE_MS = 1800;

function useTypewriter(words: string[]) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx % words.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && display === word) {
      timeout = setTimeout(() => setIsDeleting(true), PAUSE_MS);
    } else if (isDeleting && display === '') {
      setIsDeleting(false);
      setWordIdx((i) => i + 1);
    } else {
      const next = isDeleting
        ? word.slice(0, display.length - 1)
        : word.slice(0, display.length + 1);
      timeout = setTimeout(
        () => setDisplay(next),
        isDeleting ? DELETE_SPEED : TYPE_SPEED
      );
    }
    return () => clearTimeout(timeout);
  }, [display, isDeleting, wordIdx, words]);

  return { display, wordIdx };
}

export const Hero = () => {
  const { display: roleText, wordIdx } = useTypewriter(ROLES);
  const isHighlighted = wordIdx % ROLES.length === 0;

  return (
    <div className="relative w-full h-[100svh] overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Background grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#70809014_1px,transparent_1px),linear-gradient(to_bottom,#70809014_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Main content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-6xl mx-auto">

        {/* Greeting */}
        <motion.p
          className="text-[clamp(36px,8vw,88px)] font-normal leading-none mb-2" style={{ color: 'var(--color-text-muted)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        >
          Hello! I'm
        </motion.p>

        {/* Name */}
        <motion.h1
          className="text-[clamp(36px,8vw,88px)] font-normal leading-none tracking-tight mb-4" style={{ color: 'var(--color-text-primary)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        >
          Sourav Debnath.
        </motion.h1>

        {/* Typewriter role line */}
        <motion.p
          className="text-[clamp(36px,8vw,88px)] font-normal leading-none mb-8"
          style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: 'normal' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <span style={{ color: 'var(--color-text-muted)' }}>I'm a&nbsp;</span>
          <span style={{ color: isHighlighted ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
            {roleText}
          </span>
          <span
            className="inline-block w-px h-[1.1em] ml-0.5 align-middle"
            style={{ backgroundColor: 'var(--color-text-muted)', animation: 'blink 1s step-end infinite' }}
            aria-hidden="true"
          />
        </motion.p>

        {/* Inline CTAs */}
        <motion.div
          className="flex flex-wrap gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          {[
            { label: 'Resume',   href: '/resume.pdf',                          blank: true  },
            { label: 'Email',    href: 'mailto:debnath.sourabh@gmail.com',     blank: false },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/souravdebnath', blank: true  },
            { label: 'GitHub',   href: 'https://github.com/sourav27',           blank: true  },
          ].map(({ label, href, blank }) => (
            <a
              key={label}
              href={href}
              target={blank ? '_blank' : undefined}
              rel={blank ? 'noopener noreferrer' : undefined}
              className="text-base transition-colors duration-200" style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              {label}
            </a>
          ))}
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
          className="w-px h-10"
          style={{ backgroundColor: 'var(--color-border)', originY: 0 }}
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>scroll</span>
      </motion.div>
    </div>
  );
};
