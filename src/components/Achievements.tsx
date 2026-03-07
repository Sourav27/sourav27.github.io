import { motion } from 'framer-motion';
import { achievements } from '../data/achievements';

export const Achievements = () => {
  return (
    <section id="achievements" className="py-24 md:py-32 bg-stone-900">
      <div className="max-w-6xl mx-auto px-6">

        <motion.h2
          className="text-5xl font-semibold text-stone-100 mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          Achievements
        </motion.h2>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.5fr_auto] gap-6 pb-4 border-b border-stone-800 mb-2">
          {['Achievement', 'Context', 'Metric', 'Year'].map((h) => (
            <span key={h} className="text-[11px] uppercase tracking-widest text-stone-600">
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {achievements.map((item, index) => (
          <motion.div
            key={item.name}
            className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1.5fr_auto] gap-2 md:gap-6 py-5 border-b border-stone-800 group hover:bg-stone-800/20 transition-colors duration-150 -mx-2 px-2 rounded"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
          >
            <span className="text-base text-stone-100 group-hover:text-stone-100 transition-colors">
              {item.name}
            </span>
            <span className="text-base text-stone-400">{item.context}</span>
            <span className="text-base text-stone-400">{item.metric}</span>
            <span className="text-base text-stone-600 md:text-right">{item.year}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
