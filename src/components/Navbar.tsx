
import { Link } from 'react-router-dom';

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-8 md:p-12 pointer-events-none mix-blend-difference text-stone-300">
            <Link to="/" className="pointer-events-auto">
                <div className="font-serif text-2xl md:text-3xl font-bold tracking-tighter text-stone-100">
                    Sourav<br />Debnath
                </div>
            </Link>

            <div className="hidden md:flex gap-8 pointer-events-auto">
                <a href="#about" className="hover:text-white transition-colors">About</a>
                <a href="#resume" className="hover:text-white transition-colors">Resume</a>
                <a href="#projects" className="hover:text-white transition-colors">Projects</a>
                <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
            </div>

            {/* Mobile Menu Button Placeholder */}
            <div className="md:hidden pointer-events-auto">
                <button className="text-stone-100">Menu</button>
            </div>
        </nav>
    );
};
