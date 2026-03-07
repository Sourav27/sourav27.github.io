import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Gallery } from '../components/Gallery';

export const Home = () => {
    return (
        <main>
            <Hero />
            <About />
            <Gallery />
        </main>
    );
};
