
import { motion } from 'framer-motion';

export const About = () => {
    return (
        <section id="about" className="py-24 px-8 md:px-12 bg-stone-900 text-stone-300">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    className="text-4xl md:text-5xl font-serif font-bold mb-12 text-stone-100"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    About Me
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-12">
                    <motion.div
                        className="space-y-6 text-lg leading-relaxed"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <p>
                            I am a <span className="text-orange-500 font-semibold">Senior Product Manager</span> with over 5.5 years of experience building and launching AI and traditional products from zero to scale.
                        </p>
                        <p>
                            Currently leading Generative AI initiatives at <span className="text-stone-100">AB InBev</span>, I specialize in navigating user ambiguity and delivering data-backed quality in high-velocity environments.
                        </p>
                        <p>
                            My background matches technical depth from <span className="text-stone-100">IIT Madras</span> with strategic business acumen from <span className="text-stone-100">IIM Bangalore</span>.
                        </p>
                    </motion.div>

                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <div>
                            <h3 className="text-xl font-bold text-stone-100 mb-4">Core Competencies</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Product Leadership', 'Generative AI', 'Agentic Workflows', 'RAG', 'Digital Transformation', 'User Research'].map((skill) => (
                                    <span key={skill} className="px-3 py-1 bg-stone-800 rounded-full text-sm hover:bg-orange-500/20 hover:text-orange-500 transition-colors cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-stone-100 mb-4">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Azure Cloud', 'SQL', 'Python', 'React', 'Tailwind', 'LangChain', 'ChromaDB'].map((tech) => (
                                    <span key={tech} className="px-3 py-1 border border-stone-700 rounded-full text-sm text-stone-400">
                                        {tech}
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
