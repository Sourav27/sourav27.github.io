import { motion } from 'framer-motion';
import { achievements } from '../data/achievements';

export const Achievements = () => {
  return (
    <section id="achievements" className="py-24 md:py-32" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="max-w-6xl mx-auto px-6">

        <motion.h2
          className="text-4xl md:text-5xl font-semibold mb-16" style={{ color: 'var(--color-text-primary)' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          Achievements
        </motion.h2>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.5fr_auto] gap-6 pb-4 border-b mb-2" style={{ borderColor: 'var(--color-border)' }}>
          {['Achievement', 'Context', 'Metric', 'Year'].map((h) => (
            <span key={h} className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {achievements.map((item, index) => (
          <motion.div
            key={item.name}
            className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1.5fr_auto] gap-2 md:gap-6 py-5 border-b group transition-colors duration-150 -mx-2 px-2 rounded"
            style={{ borderColor: 'var(--color-border)' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
          >
            <span className="text-base transition-colors" style={{ color: 'var(--color-text-primary)' }}>
              {item.name}
            </span>
            <span className="text-base" style={{ color: 'var(--color-text-secondary)' }}>
              <span className="md:hidden text-[10px] uppercase tracking-widest block mb-0.5" style={{ color: 'var(--color-text-muted)' }}>Context</span>
              {item.context}
            </span>
            <span className="text-base" style={{ color: 'var(--color-text-secondary)' }}>
              <span className="md:hidden text-[10px] uppercase tracking-widest block mb-0.5" style={{ color: 'var(--color-text-muted)' }}>Metric</span>
              {item.metric}
            </span>
            <span className="text-base md:text-right" style={{ color: 'var(--color-text-muted)' }}>
              <span className="md:hidden text-[10px] uppercase tracking-widest block mb-0.5" style={{ color: 'var(--color-text-muted)' }}>Year</span>
              {item.year}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
