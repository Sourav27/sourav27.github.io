import { motion } from 'framer-motion';

const SOCIALS = [
  { label: 'Email',     href: 'mailto:debnath.sourabh@gmail.com' },
  { label: 'LinkedIn',  href: 'https://linkedin.com/in/souravdebnath' },
  { label: 'GitHub',    href: 'https://github.com/sourav27' },
  { label: 'Twitter',   href: 'https://twitter.com/souravdebnath27' },
  { label: 'Substack',  href: 'https://substack.com/@souravdebnath' },
];

const VALUE_TAGS = ['Minimalism', 'AI Driven', 'Impact First'];

export const Footer = () => {
  return (
    <footer id="contact" className="bg-white dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* CTA */}
        <motion.h2
          className="text-[clamp(48px,8vw,88px)] font-normal text-stone-900 dark:text-stone-100 leading-none tracking-tight mb-16 max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Let's build<br />something.
        </motion.h2>

        {/* Social links */}
        <motion.div
          className="flex flex-wrap gap-8 mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('mailto') ? undefined : '_blank'}
              rel={s.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              className="text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:-translate-y-px transition-all duration-150"
            >
              {s.label}
            </a>
          ))}
        </motion.div>

        {/* Value tags */}
        <div className="flex gap-6 mb-12">
          {VALUE_TAGS.map((tag) => (
            <span key={tag} className="text-xs font-mono text-stone-400 dark:text-stone-600 uppercase tracking-widest">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer bar */}
        <div className="flex justify-between items-center border-t border-stone-200 dark:border-stone-800 pt-6">
          <span className="text-sm font-medium text-stone-400 dark:text-stone-600">S.D.</span>
          <div className="flex items-center gap-6">
            <span className="text-xs text-stone-400 dark:text-stone-600">
              © {new Date().getFullYear()} Sourav Debnath. All rights reserved.
            </span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Scroll to top"
              className="w-9 h-9 rounded-full border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-200 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 15l-6-6-6 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
