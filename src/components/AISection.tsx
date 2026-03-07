import { motion } from 'framer-motion';

export const AISection = () => {
  return (
    <section className="bg-white dark:bg-stone-950 py-24 md:py-32 px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-5xl md:text-7xl font-bold text-stone-900 dark:text-stone-50 leading-tight mb-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          Building the<br />future with AI.
        </motion.h2>
        <motion.p
          className="text-stone-600 dark:text-stone-400 text-lg md:text-xl max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        >
          Specialising in GenAI, RAG strategy, and LLM product development —
          turning frontier research into products that scale.
        </motion.p>
      </div>
    </section>
  );
};
