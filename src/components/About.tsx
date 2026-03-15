import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { Target, Pen, Zap, BrainCircuit } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ─── Types ───────────────────────────────────────────────────── */
interface WorkPeriod { start: string; end: string | null; }
interface Role { id: string; role: string; company: string; period: string; logo: string; url: string; }
interface ExpertiseItem { icon: LucideIcon; title: string; description: string; }
interface School { name: string; programme: string; logo: string; url: string; }

/* ─── computeExperience ────────────────────────────────────────── */
function computeExperience(periods: WorkPeriod[]) {
  let totalMonths = 0;
  const now = new Date();
  for (const p of periods) {
    const start = new Date(p.start);
    const end = p.end ? new Date(p.end) : now;
    totalMonths += (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  }
  return { years: Math.floor(totalMonths / 12), months: totalMonths % 12 };
}

/* ─── CountUpNumber ────────────────────────────────────────────── */
function CountUpNumber({ target, duration = 1.5 }: { target: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) => Math.round(v));

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(motionVal, target, { duration, ease: 'easeOut' });
    return controls.stop;
  }, [isInView, target, duration, motionVal]);

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => {
      if (ref.current) ref.current.textContent = String(v);
    });
    return unsubscribe;
  }, [display]);

  return <span ref={ref}>0</span>;
}

/* ─── Data ─────────────────────────────────────────────────────── */
const WORK_PERIODS: WorkPeriod[] = [
  { start: '2018-07-01', end: '2022-05-31' },
  { start: '2023-04-01', end: '2023-06-30' },
  { start: '2024-05-01', end: null },
];

const ROLES: Role[] = [
  { id: 'ab-inbev',   role: 'Senior Product Manager',       company: 'AB InBev',          period: 'May 2024 – Present',  logo: '/images/logos/abinbev_mono.svg', url: 'https://www.ab-inbev.com' },
  { id: 'bain',       role: 'Summer Associate',              company: 'Bain & Company',    period: 'Apr 2023 – Jun 2023', logo: '/images/logos/bain_mono.svg',    url: 'https://www.bain.com' },
  { id: 'vedanta-pm', role: 'Product Manager',               company: 'Vedanta Resources', period: 'Oct 2020 – May 2022', logo: '/images/logos/vedanta_mono.svg', url: 'https://www.vedantaresources.com' },
  { id: 'vedanta-ai', role: 'Smart Manufacturing & AI Lead', company: 'Vedanta Resources', period: 'Jul 2018 – Sep 2020', logo: '/images/logos/vedanta_mono.svg', url: 'https://www.vedantaresources.com' },
];

const EXPERTISE: ExpertiseItem[] = [
  { icon: Target,       title: 'Product Innovation', description: 'I turn fuzzy inputs into clear product direction, smart experiments, and shippable increments.' },
  { icon: Pen,          title: 'Product Design',     description: 'I craft simple flows and crisp UI, balancing usability, accessibility, and visual polish.' },
  { icon: Zap,          title: 'Vibe Coding',        description: 'I use AI-assisted building to rapidly prototype and ship production-quality features.' },
  { icon: BrainCircuit, title: 'AI Workflows',       description: 'I apply the right tools across research, ideation, copy, design, and delivery.' },
];

const SCHOOLS: School[] = [
  { name: 'IIT Madras',    programme: 'B.Tech.', logo: '/images/logos/iit-madras.svg',    url: 'https://www.iitm.ac.in' },
  { name: 'IIM Bangalore', programme: 'MBA',     logo: '/images/logos/iim-bangalore.svg', url: 'https://www.iimb.ac.in' },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' } as const,
};

/* ─── Component ─────────────────────────────────────────────────── */
export const About = () => {
  const { years, months } = computeExperience(WORK_PERIODS);

  return (
    <section id="about" className="py-24 md:py-32" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-[2fr_3fr] gap-12 md:gap-20 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-8">

            {/* Hero number */}
            <motion.div className="space-y-2" {...fadeUp} transition={{ duration: 0.6, ease: 'easeOut' }}>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-light" style={{ fontSize: 'clamp(72px,10vw,128px)', lineHeight: 1, color: 'var(--color-text-primary)' }}>
                  <CountUpNumber target={years} />
                </span>
                <span className="text-lg" style={{ color: 'var(--color-text-muted)' }}>y</span>
                <span className="font-light" style={{ fontSize: 'clamp(40px,5vw,64px)', lineHeight: 1, color: 'var(--color-text-primary)' }}>
                  <CountUpNumber target={months} duration={1.8} />
                </span>
                <span className="text-lg" style={{ color: 'var(--color-text-muted)' }}>m</span>
              </div>
              <p className="text-base" style={{ color: 'var(--color-text-muted)' }}>
                building products from zero to scale
              </p>
            </motion.div>

            {/* Bio */}
            <motion.div
              className="space-y-3 text-base leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            >
              <p>
                Senior PM leading Generative AI at{' '}
                <span style={{ color: 'var(--color-text-primary)' }}>AB InBev</span> — scaling an enterprise
                Data Copilot from 0 to 500+ MAU across global business units.
              </p>
              <p>
                I combine engineering rigour from{' '}
                <span style={{ color: 'var(--color-text-primary)' }}>IIT Madras</span> with strategic sharpness
                from <span style={{ color: 'var(--color-text-primary)' }}>IIM Bangalore</span>.
              </p>
            </motion.div>

            {/* School logos */}
            <motion.div
              className="flex items-center gap-4"
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            >
              {SCHOOLS.map((school, i) => (
                <div key={school.name} className="flex items-center gap-4">
                  {i > 0 && (
                    <span className="text-sm" style={{ color: 'var(--color-border)' }}>×</span>
                  )}
                  <a
                    href={school.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-60 hover:opacity-100 transition-opacity duration-200"
                    title={`${school.name} — ${school.programme}`}
                  >
                    <img
                      src={school.logo}
                      alt={school.name}
                      className="h-6 w-auto"
                      style={{ filter: 'var(--school-logo-filter)' }}
                    />
                  </a>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-8">

            {/* Experience table */}
            <div className="space-y-4">
              {ROLES.map((role, index) => (
                <motion.div
                  key={role.id}
                  className="flex items-center gap-4"
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
                >
                  <a
                    href={role.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 opacity-50 hover:opacity-100 transition-opacity duration-200"
                    title={role.company}
                  >
                    <img
                      src={role.logo}
                      alt={role.company}
                      className="h-4 w-auto max-w-[72px] object-contain"
                      style={{ filter: 'var(--company-logo-filter)' }}
                    />
                  </a>
                  <span className="flex-1 text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                    {role.role}
                  </span>
                  <span
                    className="shrink-0 text-xs"
                    style={{ color: 'var(--color-text-muted)', fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {role.period}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--color-border)' }} />

            {/* 2×2 Expertise cards */}
            <div className="grid grid-cols-2 gap-3">
              {EXPERTISE.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    className="p-4 rounded-md space-y-2"
                    style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-primary)' }}
                    {...fadeUp}
                    transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
                  >
                    <Icon size={16} style={{ color: 'var(--color-text-muted)' }} />
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      {item.title}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
