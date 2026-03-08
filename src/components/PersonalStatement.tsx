import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { personalStatement } from '../data/personal-statement';

const WORDS = personalStatement.quote.split(' ');

export const PersonalStatement = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [litCount, setLitCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    // Highlight words across the middle 40% of scroll range (0.2 → 0.6)
    // so words start lighting up once section is well in view
    const adjusted = Math.max(0, (progress - 0.2) / 0.4);
    setLitCount(Math.round(adjusted * WORDS.length));
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0px', '-40px']);

  return (
    <section
      ref={sectionRef}
      className="bg-white dark:bg-stone-950 py-24 md:py-32 px-8 md:px-16 lg:px-24 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">

        {/* Text — left */}
        <div className="flex-1 flex flex-col gap-6 min-w-0 self-stretch">
          <span className="text-xs uppercase tracking-widest text-stone-500">
            Personal Statement
          </span>
          <p className="text-3xl md:text-4xl font-light leading-relaxed">
            {WORDS.map((word, i) => (
              <span key={i}>
                <span
                  className={[
                    'transition-colors duration-300',
                    i < litCount
                      ? 'text-stone-900 dark:text-stone-100'
                      : 'text-stone-400 dark:text-stone-500',
                  ].join(' ')}
                >
                  {word}
                </span>
                {i < WORDS.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
        </div>

        {/* Portrait — right */}
        <motion.div
          style={{ y: imageY }}
          className="flex-shrink-0 p-2 rounded-full bg-stone-200 dark:bg-stone-800 ring-1 ring-stone-300 dark:ring-stone-700"
        >
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden">
            <img
              src={personalStatement.image}
              alt={personalStatement.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};
