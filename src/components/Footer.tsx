import { motion } from 'framer-motion';

const SOCIALS = [
  { label: 'Email',     href: 'mailto:debnath.sourabh@gmail.com' },
  { label: 'LinkedIn',  href: 'https://linkedin.com/in/souravdebnath' },
  { label: 'GitHub',    href: 'https://github.com/sourav27' },
  { label: 'Instagram', href: 'https://instagram.com' },
];

export const Footer = () => {
  return (
    <footer id="contact" className="bg-stone-950 border-t border-stone-800 pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* CTA */}
        <motion.p
          className="text-[clamp(36px,6vw,72px)] font-light text-stone-100 leading-tight mb-16 max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Let's build something.
        </motion.p>

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
              className="text-sm text-stone-400 hover:text-stone-100 hover:-translate-y-px transition-all duration-150"
            >
              {s.label}
            </a>
          ))}
        </motion.div>

        {/* Footer bar */}
        <div className="flex justify-between items-center border-t border-stone-800 pt-6">
          <span className="text-sm font-medium text-stone-600">S.D.</span>
          <span className="text-xs text-stone-600">
            © {new Date().getFullYear()} Sourav Debnath. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};
