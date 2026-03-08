import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { gallery } from '../data/gallery';

export const Gallery = () => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTouchStart = (idx: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveIdx(idx);
  };

  const handleTouchEnd = () => {
    timeoutRef.current = setTimeout(() => setActiveIdx(null), 800);
  };

  return (
    <section id="gallery" className="py-24 md:py-32 bg-white dark:bg-stone-950">
      <div className="max-w-6xl mx-auto px-6">

        <motion.h2
          className="text-4xl md:text-5xl font-semibold text-stone-900 dark:text-stone-100 mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          Perspective
        </motion.h2>

        {/* 2-column: large image left, 3 smaller right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Large image — left, full height */}
          {gallery[0] && (
            <motion.div
              className="relative min-h-[400px] overflow-hidden group rounded-lg cursor-pointer"
              onTouchStart={() => handleTouchStart(0)}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <img
                src={gallery[0].src}
                alt={gallery[0].alt}
                className={`w-full h-full object-contain transition-all duration-500 ease-out group-hover:scale-105 ${
                  activeIdx === 0 ? 'grayscale-0 scale-105' : 'grayscale group-hover:grayscale-0'
                }`}
              />
              <div className={`absolute inset-0 bg-black/60 transition-opacity duration-500 flex flex-col items-center justify-center p-4 text-center ${
                activeIdx === 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}>
                <p className="font-mono text-[13px] text-stone-100 mb-1">{gallery[0].camera}</p>
                <p className="font-mono text-[11px] text-stone-400">{gallery[0].lens}</p>
              </div>
            </motion.div>
          )}

          {/* Smaller images — right column */}
          <div className="grid grid-rows-3 gap-4">
            {gallery.slice(1, 4).map((img, index) => (
              <motion.div
                key={index}
                className="relative overflow-hidden group rounded-lg cursor-pointer"
                onTouchStart={() => handleTouchStart(index + 1)}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: (index + 1) * 0.08, ease: 'easeOut' }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
                    activeIdx === index + 1 ? 'grayscale-0 scale-105' : 'grayscale group-hover:grayscale-0'
                  }`}
                />
                <div className={`absolute inset-0 bg-black/60 transition-opacity duration-500 flex flex-col items-center justify-center p-4 text-center ${
                  activeIdx === index + 1 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <p className="font-mono text-[13px] text-stone-100 mb-1">{img.camera}</p>
                  <p className="font-mono text-[11px] text-stone-400">{img.lens}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* View more on Instagram */}
        <motion.div
          className="mt-8 flex justify-start"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a
            href="https://instagram.com/debu11"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors duration-200"
          >
            View more on Instagram
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M7 7h10v10"/>
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
