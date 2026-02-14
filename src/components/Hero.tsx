
import { useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';

export const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);


    // Mouse position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);



    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const { left, top } = containerRef.current.getBoundingClientRect();
                const x = e.clientX - left;
                const y = e.clientY - top;
                mouseX.set(x);
                mouseY.set(y);
                containerRef.current.style.setProperty('--x', `${x}px`);
                containerRef.current.style.setProperty('--y', `${y}px`);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-screen overflow-hidden bg-stone-950 cursor-none"
        >
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Main Content Layer (Visible by default) */}
            <div className="absolute inset-0 z-10 flex flex-col justify-end p-12 pointer-events-none">

                <div className="flex justify-between items-end mix-blend-difference">
                    <div className="text-xl md:text-2xl font-light tracking-wide text-stone-300">
                        Senior Product Manager<br />
                        <span className="text-stone-500">Generative AI & Digital Transformation</span>
                    </div>

                    <div className="flex gap-6 text-stone-300 z-50 pointer-events-auto">
                        <a href="https://linkedin.com/in/souravdebnath" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            <Linkedin size={24} />
                        </a>
                        <a href="https://github.com/sourav27" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            <Github size={24} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            <Twitter size={24} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Mask Layer (Revealed by Flashlight) */}
            <motion.div
                className="absolute inset-0 z-20 bg-orange-600 mix-blend-overlay pointer-events-none"
                style={{
                    maskImage: 'radial-gradient(circle 250px at var(--x) var(--y), black, transparent)',
                    WebkitMaskImage: 'radial-gradient(circle 250px at var(--x) var(--y), black, transparent)',
                }}
            >
                {/* Detailed/Tech version of image or content could go here in future iteration */}
                <div className="w-full h-full opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </motion.div>

            {/* Flashlight Cursor */}
            <motion.div
                className="fixed top-0 left-0 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none z-30 mix-blend-screen"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            />

            {/* Sharp Cursor Dot */}
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 bg-orange-500 rounded-full pointer-events-none z-50 mix-blend-difference"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            />

        </div>
    );
};
