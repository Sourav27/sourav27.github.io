
import { motion } from 'framer-motion';
import { experiences } from '../data/experiences';
import { Quote } from 'lucide-react';

export const VisualResume = () => {
    return (
        <section id="resume" className="py-24 bg-stone-950 text-stone-300">
            <div className="container mx-auto px-6 md:px-12">
                <motion.h2
                    className="text-4xl md:text-5xl font-serif font-bold mb-20 text-center text-stone-100"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Professional Journey
                </motion.h2>

                <div className="space-y-32">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            {/* Content Side */}
                            <div className="flex-1 space-y-6">
                                <div className="flex items-center gap-4 text-orange-500 font-medium tracking-wider uppercase text-sm">
                                    <span>{exp.period}</span>
                                    <span className="w-12 h-[1px] bg-orange-500/50"></span>
                                    <span>{exp.company}</span>
                                </div>

                                <h3 className="text-3xl md:text-4xl font-bold text-stone-100 leading-tight">
                                    {exp.role}
                                </h3>

                                <p className="text-lg text-stone-400 leading-relaxed">
                                    {exp.description}
                                </p>

                                {/* Key Stats Grid */}
                                {exp.stats && (
                                    <div className="grid grid-cols-3 gap-6 py-6 border-y border-stone-800">
                                        {exp.stats.map((stat) => (
                                            <div key={stat.label}>
                                                <div className="text-2xl font-bold text-stone-100">{stat.value}</div>
                                                <div className="text-xs uppercase tracking-wide text-stone-500 mt-1">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Skills Tags */}
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {exp.skills.map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-stone-900 border border-stone-800 rounded-full text-xs text-stone-400">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                {/* Testimonial */}
                                {exp.testimonial && (
                                    <div className="bg-stone-900/50 p-6 rounded-xl border border-stone-800 mt-6 relative">
                                        <Quote className="absolute top-4 left-4 text-stone-700 w-8 h-8 opacity-20" />
                                        <p className="italic text-stone-300 mb-4 relative z-10">"{exp.testimonial.text}"</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-stone-700 rounded-full flex items-center justify-center text-xs font-bold text-stone-300">
                                                {exp.testimonial.author[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-stone-200">{exp.testimonial.author}</div>
                                                <div className="text-xs text-stone-500">{exp.testimonial.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Image Side */}
                            <div className="flex-1 w-full aspect-[4/3] relative rounded-2xl overflow-hidden group">
                                {exp.image ? (
                                    <>
                                        <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                        <img
                                            src={exp.image}
                                            alt={exp.role}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </>
                                ) : (
                                    // Fallback pattern if no image
                                    <div className="w-full h-full bg-stone-900 flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,64,60,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:0_0,0_0] animate-[shimmer_2s_infinite]"></div>
                                        <span className="text-stone-700 font-serif text-6xl opacity-20">{exp.company[0]}</span>
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
