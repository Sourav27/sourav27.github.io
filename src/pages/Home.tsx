import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { VisualResume } from '../components/VisualResume';
import { Gallery } from '../components/Gallery';

export const Home = () => {
    return (
        <main>
            <Hero />
            <About />
            <VisualResume />
            <Gallery />
        </main>
    );
};
