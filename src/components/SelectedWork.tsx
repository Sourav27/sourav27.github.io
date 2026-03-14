import { useState } from 'react';
import { motion } from 'framer-motion';
import { experiences } from '../data/experiences';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

function LogoOrName({ src, company }: { src: string; company: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return <span className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>{company}</span>;
  }
  return (
    <img
      src={src}
      alt={company}
      onError={() => setBroken(true)}
      className="h-5 w-auto object-contain brightness-0 opacity-40 dark:invert dark:opacity-40"
    />
  );
}

function CardImage({ src, role, company }: { src?: string; role: string; company: string }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className="flex-1 min-h-[280px] md:min-h-0 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      {src && !broken ? (
        <img
          src={src}
          alt={role}
          onError={() => setBroken(true)}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-8xl font-light" style={{ color: 'var(--color-border)' }}>
            {company[0]}
          </span>
        </div>
      )}
    </div>
  );
}

export const SelectedWork = () => {
  return (
    <section id="work" className="py-24 md:py-32" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-6">

        <motion.h2
          className="text-4xl md:text-5xl font-semibold mb-20" style={{ color: 'var(--color-text-primary)' }}
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
              } gap-0 rounded-lg overflow-hidden transition-colors duration-200`}
              style={{ border: '1px solid var(--color-border)' }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              whileHover={{ scale: 1.01 }}
            >
              {/* Mix-blend hover overlay */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.03] transition-opacity duration-200 pointer-events-none z-10 mix-blend-difference" />

              {/* Content */}
              <div className="flex-1 p-6 md:p-10 lg:p-12 space-y-6">
                {/* Label */}
                <div className="flex items-center gap-3">
                  <LogoOrName src={exp.logo} company={exp.company} />
                  <span className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>· {exp.period}</span>
                </div>

                {/* Role */}
                <h3 className="text-3xl md:text-4xl font-light leading-tight" style={{ color: 'var(--color-text-primary)' }}>
                  {exp.role}
                </h3>

                {/* Description */}
                <p className="text-base leading-relaxed max-w-lg" style={{ color: 'var(--color-text-secondary)' }}>
                  {exp.description}
                </p>

                {/* Stats */}
                {exp.stats && exp.stats.length > 0 && (
                  <div className="flex flex-wrap gap-x-8 gap-y-6 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    {exp.stats.map((stat) => (
                      <div key={stat.label} className="min-w-0">
                        <div className="text-[36px] md:text-[48px] font-light leading-none break-all" style={{ color: 'var(--color-text-primary)' }}>
                          {stat.value}
                        </div>
                        <div className="text-[11px] uppercase tracking-widest mt-2 whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Case study CTA */}
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm font-mono hover:gap-3 transition-all duration-200"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  View Case Study <span aria-hidden="true">→</span>
                </a>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-[11px] uppercase tracking-widest transition-colors duration-200"
                    style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Testimonial */}
                {exp.testimonial && (
                  <div className="pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <p className="text-sm italic leading-relaxed mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                      "{exp.testimonial.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium" style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}>
                        {exp.testimonial.author[0]}
                      </div>
                      <div>
                        <p className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>{exp.testimonial.author}</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{exp.testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Image */}
              <CardImage src={exp.image} role={exp.role} company={exp.company} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
