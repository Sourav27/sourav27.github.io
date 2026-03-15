import { SEO } from '../components/SEO';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { SelectedWork } from '../components/SelectedWork';
import { Achievements } from '../components/Achievements';
import { PersonalStatement } from '../components/PersonalStatement';
import { Gallery } from '../components/Gallery';

export const Home = () => {
  return (
    <main>
      <SEO />
      <Hero />
      <About />
      <SelectedWork />
      <Achievements />
      <PersonalStatement />
      <Gallery />
    </main>
  );
};
