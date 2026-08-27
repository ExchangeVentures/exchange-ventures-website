import { useReveal } from './hooks/useReveal.js'
import { Nav } from './components/Nav.jsx'
import { ScrollProgress } from './components/ScrollProgress.jsx'
import { CommandPalette } from './components/CommandPalette.jsx'
import { Hero } from './components/Hero.jsx'
import { Band } from './components/Band.jsx'
import { Practices } from './components/Practices.jsx'
import { Approach } from './components/Approach.jsx'
import { Snapshot } from './components/Snapshot.jsx'
import { Engagements } from './components/Engagements.jsx'
import { Faq } from './components/Faq.jsx'
import { Contact } from './components/Contact.jsx'
import { Footer } from './components/Footer.jsx'

export default function App() {
  useReveal()

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav />
      <ScrollProgress />
      <CommandPalette />
      <main id="main">
        <Hero />
        <Band />
        <Practices />
        <Approach />
        <Snapshot />
        <Engagements />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
