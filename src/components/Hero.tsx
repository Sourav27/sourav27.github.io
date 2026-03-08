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

  return display;
}

export const Hero = () => {
  const roleText = useTypewriter(ROLES);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white dark:bg-stone-950">
      {/* Background grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Main content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-6xl mx-auto">

        {/* Greeting */}
        <motion.p
          className="text-[clamp(36px,8vw,88px)] font-normal text-stone-500 dark:text-stone-400 leading-none mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        >
          Hello! I'm
        </motion.p>

        {/* Name */}
        <motion.h1
          className="text-[clamp(36px,8vw,88px)] font-normal text-stone-900 dark:text-stone-100 leading-none tracking-tight mb-4"
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
          <span className="text-stone-500 dark:text-stone-400">I'm a&nbsp;</span>
          <span className={roleText.startsWith('GenAI') ? 'text-stone-900 dark:text-stone-100' : 'text-stone-500 dark:text-stone-400'}>
            {roleText}
          </span>
          <span
            className="inline-block w-px h-[1.1em] bg-stone-500 dark:bg-stone-400 ml-0.5 align-middle"
            style={{ animation: 'blink 1s step-end infinite' }}
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
              className="text-base text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors duration-200"
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
          className="w-px h-10 bg-stone-300 dark:bg-stone-700"
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originY: 0 }}
        />
        <span className="text-[10px] uppercase tracking-widest text-stone-400 dark:text-stone-600">scroll</span>
      </motion.div>
    </div>
  );
};
