import { useEffect, useState } from 'react';
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
import { ProjectEstimator } from './components/ProjectEstimator/ProjectEstimator';
import { Testimonials } from './components/Testimonials/Testimonials';
import { Experience } from './components/Experience/Experience';
import { Chatbox } from './components/Chatbox/Chatbox';
import { Notes } from './components/Notes/Notes';
import { Contact } from './components/Contact/Contact';
import { Footer } from './components/Footer/Footer';
import { CvModal } from './components/CvModal/CvModal';
import { CommandPalette } from './components/CommandPalette/CommandPalette';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleAutopilot = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.action === 'DOWNLOAD_CV') {
        setIsCvModalOpen(true);
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
    <div className="appShell">
      {/* Launch Sprint Loader (une fois par session) */}
      <Loader />

      <CloudBackground />
      <CustomCursor />

      {/* CV Modal */}
      <CvModal
        isOpen={isCvModalOpen}
        onClose={() => setIsCvModalOpen(false)}
      />

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
          <ProjectEstimator />
          <Testimonials />
          <Experience />
          <Notes />
          <Contact />
          <Footer />
        </div>
      </div>

      <Chatbox onOpenCv={() => setIsCvModalOpen(true)} />
    </div>
  );
}
