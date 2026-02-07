
import { Github, Linkedin, Twitter, Instagram } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="w-full bg-stone-900 py-12 px-8 md:px-12 text-stone-400">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-sm">
                    © {new Date().getFullYear()} Sourav Debnath. All rights reserved.
                </div>

                <div className="flex gap-6">
                    <a href="https://github.com/sourav27" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        <Github size={20} />
                    </a>
                    <a href="https://linkedin.com/in/souravdebnath" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        <Linkedin size={20} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        <Twitter size={20} />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        <Instagram size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
};
