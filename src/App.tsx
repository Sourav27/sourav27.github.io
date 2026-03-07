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
    document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <HelmetProvider>
      <div className="min-h-screen font-sans text-stone-100 bg-stone-950">
        <Navbar theme={theme} onToggle={toggleTheme} />
        <Home />
        <Footer />
      </div>
    </HelmetProvider>
  )
}

export default App
