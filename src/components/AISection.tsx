import { motion } from 'framer-motion';

export const AISection = () => {
  return (
    <section className="bg-white dark:bg-stone-950 py-24 md:py-32 px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">

        {/* Text — left */}
        <div className="flex-1">
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
            className="text-stone-600 dark:text-stone-400 text-lg md:text-xl max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          >
            Specialising in GenAI, RAG strategy, and LLM product development —
            turning frontier research into products that scale.
          </motion.p>
        </div>

        {/* Portfolio photo — right */}
        <motion.div
          className="flex-shrink-0 w-64 h-80 md:w-80 md:h-96 rounded-lg overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        >
          <img
            src="/images/portfolio.jpg"
            alt="Sourav Debnath"
            className="w-full h-full object-cover grayscale"
          />
        </motion.div>

      </div>
    </section>
  );
};
