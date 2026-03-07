import { useState, useEffect } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Footer } from './components/Footer'

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mq.matches ? 'dark' : 'light');
    const onChange = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <HelmetProvider>
      <div className="min-h-screen font-sans text-stone-100 bg-stone-950" data-theme={theme}>
        <Navbar theme={theme} onToggle={toggleTheme} />
        <Home />
        <Footer />
      </div>
    </HelmetProvider>
  )
}

export default App
