import { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { CloudBackground } from './components/CloudBackground/CloudBackground';
import { CustomCursor } from './components/CustomCursor/CustomCursor';
import { Loader } from './components/Loader/Loader';
import { Nav } from './components/Nav/Nav';
import { Hero } from './components/Hero/Hero';
import { Stats } from './components/Stats/Stats';
import { About } from './components/About/About';
import { HowIWork } from './components/HowIWork/HowIWork';
import { Projects } from './components/Projects/Projects';
import { ServicesAccordion } from './components/Services/ServicesAccordion';
import { Testimonials } from './components/Testimonials/Testimonials';
import { Experience } from './components/Experience/Experience';
import { Chatbox } from './components/Chatbox/Chatbox';
import { Notes } from './components/Notes/Notes';
import { Contact } from './components/Contact/Contact';
import { Booking } from './components/Booking/Booking';
import { GithubActivity } from './components/GithubActivity/GithubActivity';
import { Footer } from './components/Footer/Footer';
import { CvModal } from './components/CvModal/CvModal';
import { CommandPalette } from './components/CommandPalette/CommandPalette';
import { Configurator } from './components/Configurator/Configurator';
import { useTheme } from './hooks/useTheme';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  useEffect(() => {
    const handleAutopilot = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.action === 'DOWNLOAD_CV') {
        setIsCvModalOpen(true);
      } else if (detail?.action === 'OPEN_CONFIGURATOR') {
        setIsConfiguratorOpen(true);
      }
    };
    window.addEventListener('portfolio-autopilot', handleAutopilot);
    return () => window.removeEventListener('portfolio-autopilot', handleAutopilot);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="appShell">
        {/* Launch Sprint Loader (une fois par session) */}
        <Loader />

        <CloudBackground />
        <CustomCursor />

        {/* CV Modal */}
        <CvModal isOpen={isCvModalOpen} onClose={() => setIsCvModalOpen(false)} />

        {/* Configurator Modal */}
        <Configurator isOpen={isConfiguratorOpen} onClose={() => setIsConfiguratorOpen(false)} />

        {/* Booking Modal (événement portfolio-open-booking) */}
        <Booking />

        {/* Command Palette (Ctrl/Cmd + K) */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onToggleTheme={toggleTheme}
          onOpenCv={() => setIsCvModalOpen(true)}
          theme={theme}
        />

        <div className="frame">
          <div className="card">
            <Nav theme={theme} onToggleTheme={toggleTheme} />
            <Hero onOpenCv={() => setIsCvModalOpen(true)} />
            <Stats />
            <About />
            <HowIWork />
            <Projects />
            <ServicesAccordion />
            <GithubActivity />
            <Testimonials />
            <Experience />
            <Notes />
            <Contact />
            <Footer />
          </div>
        </div>

        <Chatbox onOpenCv={() => setIsCvModalOpen(true)} />
      </div>
    </MotionConfig>
  );
}
