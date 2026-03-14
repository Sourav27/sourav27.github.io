import { motion } from 'framer-motion';

const STATS = [
  { value: '5.5+', label: 'Years Experience' },
  { value: '3+',   label: 'Products Launched' },
  { value: '500+', label: 'Peak MAU' },
];

const EDUCATION = [
  {
    institution: 'IIM Bangalore',
    degree: 'MBA, General Management',
    period: '2022–24',
    gpa: '3.2/4.0',
  },
  {
    institution: 'IIT Madras',
    degree: 'B.Tech Honours, Mechanical Engineering',
    period: '2014–18',
    gpa: '8.9/10.0',
  },
];

const COMPETENCIES = [
  'Product Leadership', 'Generative AI', 'Agentic Workflows',
  'RAG', 'Digital Transformation', 'User Research',
  'Context Engineering', 'MLOps',
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
};

export const About = () => {
  return (
    <section id="about" className="py-24 md:py-32" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="max-w-6xl mx-auto px-6">

        <motion.h2
          className="text-4xl md:text-5xl font-semibold mb-16" style={{ color: 'var(--color-text-primary)' }}
          {...fadeUp}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          About
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-16">

          {/* Left — bio */}
          <motion.div
            className="space-y-5 text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          >
            <p>
              Senior Product Manager with 5.5+ years of experience building and launching
              AI and traditional products from zero to scale.
            </p>
            <p>
              Currently leading Generative AI initiatives at{' '}
              <span style={{ color: 'var(--color-text-primary)' }}>AB InBev</span> — building products that
              help the world's largest brewer make faster, smarter decisions.
            </p>
            <p>
              My background combines technical depth from{' '}
              <span style={{ color: 'var(--color-text-primary)' }}>IIT Madras</span> with strategic business
              acumen from <span style={{ color: 'var(--color-text-primary)' }}>IIM Bangalore</span>.
            </p>
          </motion.div>

          {/* Right — stats, education, competencies */}
          <motion.div
            className="space-y-10"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          >
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pb-10 border-b" style={{ borderColor: 'var(--color-border)' }}>
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-light text-stone-900 dark:text-stone-100">{stat.value}</div>
                  <div className="text-[11px] uppercase tracking-widest mt-1" style={{ color: 'var(--color-text-muted)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>Education</p>
              {EDUCATION.map((edu) => (
                <div key={edu.institution} className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{edu.institution}</p>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{edu.degree}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{edu.period}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>GPA {edu.gpa}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Competencies */}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-stone-400 dark:text-stone-600 mb-3">
                Competencies
              </p>
              <div className="flex flex-wrap gap-2">
                {COMPETENCIES.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-[11px] uppercase tracking-widest transition-colors duration-200 cursor-default"
                    style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
