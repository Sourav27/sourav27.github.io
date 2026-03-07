import { motion } from 'framer-motion';
import { gallery } from '../data/gallery';

export const Gallery = () => {
  return (
    <section id="gallery" className="py-24 md:py-32 bg-stone-950">
      <div className="max-w-6xl mx-auto px-6">

        <motion.h2
          className="text-5xl font-semibold text-stone-100 mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          Perspective
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {gallery.map((img, index) => (
            <motion.div
              key={index}
              className="relative aspect-square overflow-hidden group rounded-lg cursor-pointer"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
            >
              {/* Image — grayscale by default, colour on hover */}
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
              />

              {/* EXIF overlay — appears on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-4 text-center">
                <p className="font-mono text-[13px] font-normal text-stone-100 mb-1">
                  {img.camera}
                </p>
                <p className="font-mono text-[11px] text-stone-400">
                  {img.lens}
                </p>
                <div className="flex gap-3 mt-2">
                  {img.iso && (
                    <span className="font-mono text-[11px] text-stone-500">
                      ISO {img.iso}
                    </span>
                  )}
                  {img.aperture && (
                    <span className="font-mono text-[11px] text-stone-500">
                      {img.aperture}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
