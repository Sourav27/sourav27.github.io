import { HelmetProvider } from 'react-helmet-async'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Footer } from './components/Footer'

function App() {
  return (
    <HelmetProvider>
      <div
        className="min-h-screen font-sans text-stone-100 bg-stone-950"
        data-theme="dark"
      >
        <Navbar />
        <Home />
        <Footer />
      </div>
    </HelmetProvider>
  )
}

export default App
