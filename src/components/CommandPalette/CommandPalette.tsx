import { useState, useEffect, useRef, type JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiSun, FiMoon, FiFileText, FiMail, FiLayers, FiUser, FiBriefcase, FiZap, FiX, FiCheck, FiCalendar } from 'react-icons/fi';
import styles from './CommandPalette.module.css';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useI18n, tpl } from '../../i18n';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleTheme: () => void;
  onOpenCv: () => void;
  theme: 'light' | 'dark';
}

interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon: JSX.Element;
  action: () => void;
}

export function CommandPalette({ isOpen, onClose, onToggleTheme, onOpenCv, theme }: CommandPaletteProps) {
  const { t, content } = useI18n();
  const navLinks = content.navLinks;
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useFocusTrap(isOpen, dialogRef, inputRef);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleNavigate = (href: string) => {
    onClose();
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('bassolekevin022@gmail.com');
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1200);
  };

  const openBooking = () => {
    onClose();
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('portfolio-open-booking'));
    }, 80);
  };

  const openConfigurator = () => {
    onClose();
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('portfolio-autopilot', { detail: { action: 'OPEN_CONFIGURATOR' } }));
    }, 80);
  };

  const commands: CommandItem[] = [
    {
      id: 'cmd-cv',
      label: t.commandPalette.cmdCv,
      category: t.commandPalette.categoryActions,
      icon: <FiFileText />,
      action: () => {
        onClose();
        onOpenCv();
      },
    },
    {
      id: 'cmd-booking',
      label: t.commandPalette.cmdBooking,
      category: t.commandPalette.categoryActions,
      icon: <FiCalendar />,
      action: openBooking,
    },
    {
      id: 'cmd-configurator',
      label: t.commandPalette.cmdConfigurator,
      category: t.commandPalette.categoryActions,
      icon: <FiZap />,
      action: openConfigurator,
    },
    {
      id: 'cmd-theme',
      label: theme === 'dark' ? t.commandPalette.cmdThemeLight : t.commandPalette.cmdThemeDark,
      category: t.commandPalette.categoryActions,
      icon: theme === 'dark' ? <FiSun /> : <FiMoon />,
      action: () => {
        onToggleTheme();
        onClose();
      },
    },
    {
      id: 'cmd-email',
      label: t.commandPalette.cmdEmail,
      category: t.commandPalette.categoryActions,
      icon: copied ? <FiCheck style={{ color: '#22c55e' }} /> : <FiMail />,
      action: copyEmail,
    },
    ...navLinks.map((link) => ({
      id: `nav-${link.href}`,
      label: tpl(t.commandPalette.cmdNav, { label: link.label }),
      category: t.commandPalette.categoryNavigation,
      icon: link.href === '#projects' ? <FiLayers /> : link.href === '#about' ? <FiUser /> : link.href === '#estimator' ? <FiZap /> : <FiBriefcase />,
      action: () => handleNavigate(link.href),
    })),
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} role="presentation">
          <motion.div
            ref={dialogRef}
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label={t.commandPalette.aria}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            <div className={styles.searchBar}>
              <FiSearch className={styles.searchIcon} />
              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                placeholder={t.commandPalette.placeholder}
                aria-label={t.commandPalette.searchAria}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
              />
              <button type="button" className={styles.closeBtn} onClick={onClose} aria-label={t.commandPalette.closeAria}>
                <FiX />
              </button>
            </div>

            <div className={styles.resultsList}>
              {filteredCommands.length === 0 ? (
                <div className={styles.noResults}>
                  <span>{tpl(t.commandPalette.noResults, { query })}</span>
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => (
                  <button
                    key={cmd.id}
                    type="button"
                    className={`${styles.item} ${idx === selectedIndex ? styles.itemSelected : ''}`}
                    onClick={() => cmd.action()}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <span className={styles.itemIcon}>{cmd.icon}</span>
                    <span className={styles.itemLabel}>{cmd.label}</span>
                    <span className={styles.itemCategory}>{cmd.category}</span>
                  </button>
                ))
              )}
            </div>

            <div className={styles.footer}>
              <div className={styles.shortcutHint}>
                <span className={styles.kbd}>↑</span>
                <span className={styles.kbd}>↓</span> {t.commandPalette.navTo}
              </div>
              <div className={styles.shortcutHint}>
                <span className={styles.kbd}>↵</span> {t.commandPalette.exec}
              </div>
              <div className={styles.shortcutHint}>
                <span className={styles.kbd}>ESC</span> {t.commandPalette.close}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
