import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-40 flex justify-between items-center transition-all duration-300 ${scrolled
                ? 'py-4 px-6 md:px-12 bg-stone-950/80 backdrop-blur-md border-b border-white/5'
                : 'p-8 md:p-12 bg-transparent'
                }`}
        >
            <Link to="/" className="z-50">
                <div className={`font-serif text-2xl md:text-3xl font-bold tracking-tighter transition-colors ${scrolled ? 'text-stone-100' : 'text-stone-100 mix-blend-difference'}`}>
                    Sourav Debnath
                </div>
            </Link>

            <div className={`hidden md:flex gap-8 z-50 transition-colors ${scrolled ? 'text-stone-300' : 'text-stone-300 mix-blend-difference'}`}>
                <a href="#about" className="hover:text-white transition-colors">About</a>
                <a href="#resume" className="hover:text-white transition-colors">Resume</a>
                <a href="#projects" className="hover:text-white transition-colors">Projects</a>
                <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
            </div>

            {/* Mobile Menu Button Placeholder */}
            <div className="md:hidden z-50">
                <button className="text-stone-100">Menu</button>
            </div>
        </motion.nav>
    );
};
