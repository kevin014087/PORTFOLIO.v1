import { useState, useEffect, useRef, type JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiSun, FiMoon, FiFileText, FiMail, FiLayers, FiUser, FiBriefcase, FiZap, FiX, FiCheck } from 'react-icons/fi';
import styles from './CommandPalette.module.css';
import { navLinks } from '../../data/content';
import { useFocusTrap } from '../../hooks/useFocusTrap';

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

  const commands: CommandItem[] = [
    {
      id: 'cmd-cv',
      label: 'Voir & Télécharger le CV',
      category: 'Actions',
      icon: <FiFileText />,
      action: () => {
        onClose();
        onOpenCv();
      },
    },
    {
      id: 'cmd-theme',
      label: theme === 'dark' ? 'Passer en Mode Clair' : 'Passer en Mode Sombre',
      category: 'Actions',
      icon: theme === 'dark' ? <FiSun /> : <FiMoon />,
      action: () => {
        onToggleTheme();
        onClose();
      },
    },
    {
      id: 'cmd-email',
      label: 'Copier l\'adresse email (bassolekevin022@gmail.com)',
      category: 'Actions',
      icon: copied ? <FiCheck style={{ color: '#22c55e' }} /> : <FiMail />,
      action: copyEmail,
    },
    ...navLinks.map((link) => ({
      id: `nav-${link.href}`,
      label: `Aller à la section : ${link.label}`,
      category: 'Navigation',
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
            aria-label="Palette de commandes"
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
                placeholder="Tapez une commande ou recherchez (ex: projects, cv, theme)..."
                aria-label="Rechercher une commande"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
              />
              <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Fermer">
                <FiX />
              </button>
            </div>

            <div className={styles.resultsList}>
              {filteredCommands.length === 0 ? (
                <div className={styles.noResults}>
                  <span>Aucune commande trouvée pour "{query}"</span>
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
                <span className={styles.kbd}>↓</span> pour naviguer
              </div>
              <div className={styles.shortcutHint}>
                <span className={styles.kbd}>↵</span> pour exécuter
              </div>
              <div className={styles.shortcutHint}>
                <span className={styles.kbd}>ESC</span> pour fermer
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
