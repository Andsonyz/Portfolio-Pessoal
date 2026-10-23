import { Analytics } from '@vercel/analytics/react'
import { PreferencesProvider } from './PreferencesProvider'
import { Header } from '../components/navigation/Header'
import { Footer } from '../components/layout/Footer'
import { FeatherField } from '../components/animations/FeatherField'
import { PageMotion } from '../components/animations/PageMotion'
import { Hero } from '../sections/Hero'
import { About } from '../sections/About'
import { Skills } from '../sections/Skills'
import { Experiences } from '../sections/Experiences'
import { Projects } from '../sections/Projects'
import { Certifications } from '../sections/Certifications'
import { Journey } from '../sections/Journey'
import { Events } from '../sections/Events'
import { Contact } from '../sections/Contact'

export function App() {
  return (
    <PreferencesProvider>
      <FeatherField />
      <Header />
      <PageMotion>
        <main id="conteudo" tabIndex={-1}>
          <Hero />
          <About />
          <Skills />
          <Experiences />
          <Projects />
          <Certifications />
          <Journey />
          <Events />
          <Contact />
        </main>
        <Footer />
      </PageMotion>
      <Analytics />
    </PreferencesProvider>
  )
}
