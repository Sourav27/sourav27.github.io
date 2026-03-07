import { motion } from 'framer-motion';
import { loadExperiences } from '../lib/content';

const experiences = loadExperiences();

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

export const SelectedWork = () => {
  return (
    <section id="work" className="py-24 md:py-32 bg-stone-950">
      <div className="max-w-6xl mx-auto px-6">

        <motion.h2
          className="text-5xl font-semibold text-stone-100 mb-20"
          {...fadeUp}
        >
          Selected Work
        </motion.h2>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              className={`relative group flex flex-col ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } gap-0 border border-stone-800 rounded-lg overflow-hidden hover:border-stone-700 transition-colors duration-200`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              whileHover={{ scale: 1.01 }}
            >
              {/* Mix-blend hover overlay */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.03] transition-opacity duration-200 pointer-events-none z-10 mix-blend-difference" />

              {/* Content */}
              <div className="flex-1 p-10 md:p-12 space-y-6">
                {/* Label */}
                <p className="text-[11px] uppercase tracking-widest text-stone-600">
                  {exp.company} · {exp.period}
                </p>

                {/* Role */}
                <h3 className="text-3xl md:text-4xl font-light text-stone-100 leading-tight">
                  {exp.role}
                </h3>

                {/* Description */}
                <p className="text-base text-stone-400 leading-relaxed max-w-lg">
                  {exp.description}
                </p>

                {/* Stats */}
                {exp.stats && exp.stats.length > 0 && (
                  <div className="grid grid-cols-3 gap-6 pt-6 border-t border-stone-800">
                    {exp.stats.map((stat) => (
                      <div key={stat.label}>
                        <div className="text-[40px] md:text-[56px] font-light text-stone-100 leading-none">
                          {stat.value}
                        </div>
                        <div className="text-[11px] uppercase tracking-widest text-stone-600 mt-2">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 border border-stone-800 rounded-full text-[11px] uppercase tracking-widest text-stone-600 hover:border-stone-600 hover:text-stone-400 transition-colors duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Testimonial */}
                {exp.testimonial && (
                  <div className="pt-6 border-t border-stone-800">
                    <p className="text-sm text-stone-400 italic leading-relaxed mb-3">
                      "{exp.testimonial.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center text-[10px] text-stone-400 font-medium">
                        {exp.testimonial.author[0]}
                      </div>
                      <div>
                        <p className="text-xs text-stone-300 font-medium">{exp.testimonial.author}</p>
                        <p className="text-xs text-stone-600">{exp.testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Image */}
              <div className="flex-1 min-h-[280px] md:min-h-0 relative overflow-hidden bg-stone-900">
                {exp.image ? (
                  <img
                    src={exp.image}
                    alt={exp.role}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-stone-800 text-8xl font-light">
                      {exp.company[0]}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
