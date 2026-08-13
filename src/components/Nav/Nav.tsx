import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMail, FiCopy, FiCheck, FiMenu, FiX } from 'react-icons/fi';
import styles from './Nav.module.css';
import { navLinks } from '../../data/content';

interface NavProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Nav({ theme, onToggleTheme }: NavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const email = 'bassolekevin022@gmail.com';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sectionElements = navLinks
      .map((link) => document.querySelector(link.href))
      .filter((el): el is Element => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      sectionElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
      <nav className={styles.nav} aria-label="Navigation principale">
        {/* Brand / Logo */}
        <a href="#" className={styles.brand} aria-label="Accueil KevCompilePas">
          <div className={styles.avatarBadgeWrap}>
            <div className={styles.avatarBadge}>
              <img src="/img/logo.png" alt="Logo KevCompilePas" className={styles.brandLogo} />
            </div>
            <span className={styles.statusDot} title="Disponible pour de nouveaux projets" />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>KevCompilePas</span>
            <span className={styles.brandTag}>Dev Fullstack</span>
          </div>
        </a>

        {/* Desktop Links */}
        <ul className={styles.desktopLinks}>
          {navLinks.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <li key={item.href} className={styles.navItem}>
                <a
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={styles.activeIndicator}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Actions (Email Copy & Theme Switcher & Mobile Toggle) */}
        <div className={styles.actions}>
          <div className={styles.emailContainer}>
            <a href={`mailto:${email}`} className={styles.emailBtn} title="Envoyer un email">
              <FiMail className={styles.emailIcon} />
              <span className={styles.emailText}>{email}</span>
            </a>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={handleCopyEmail}
              aria-label="Copier l'adresse email"
              title="Copier l'email"
            >
              {copied ? <FiCheck className={styles.copySuccessIcon} /> : <FiCopy />}
            </button>
            <AnimatePresence>
              {copied && (
                <motion.span
                  className={styles.copyToast}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.9 }}
                >
                  Copié !
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Switcher Button */}
          <motion.button
            type="button"
            className={styles.themeToggle}
            onClick={onToggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
            title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className={styles.themeIconWrapper}
            >
              {theme === 'dark' ? <FiSun className={styles.sunIcon} /> : <FiMoon className={styles.moonIcon} />}
            </motion.div>
          </motion.button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className={styles.mobileToggle}
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <ul className={styles.mobileNavLinks}>
              {navLinks.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={`${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span>{item.label}</span>
                      {isActive && <span className={styles.mobileActiveDot} />}
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className={styles.mobileFooterActions}>
              <a
                href={`mailto:${email}`}
                className={styles.mobileMailBtn}
                onClick={() => setIsOpen(false)}
              >
                <FiMail />
                <span>Contactez-moi</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
