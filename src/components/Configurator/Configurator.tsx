import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX } from 'react-icons/fi';
import styles from './Configurator.module.css';
import { useI18n, tpl } from '../../i18n';
import { pricing } from '../../data/content';

interface ConfiguratorProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLATFORM_ICONS: Record<string, string> = {
  web: '🌐',
  mobile: '📱',
  fullstack: '🔧',
};

const FEATURE_ICONS: Record<string, string> = {
  auth: '🔐',
  dashboard: '📊',
  payments: '💳',
  realtime: '⚡',
  admin: '🛠',
  api: '🔗',
  push: '🔔',
  design: '🎨',
};

export function Configurator({ isOpen, onClose }: ConfiguratorProps) {
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedPlatform(null);
      setSelectedFeatures([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const platform = pricing.platforms.find((p) => p.id === selectedPlatform);

  const calcEstimate = () => {
    if (!platform) return { weeks: 0, min: 0, max: 0 };
    const features = pricing.features.filter((f) => selectedFeatures.includes(f.id));
    const weeksMultiplier = features.reduce((acc, f) => acc + f.weeksMultiplier, 0);
    const costMultiplier = features.reduce((acc, f) => acc + f.costMultiplier, 0);
    const weeks = Math.ceil(platform.baseWeeks * (1 + weeksMultiplier));
    const min = Math.round((platform.min * (1 + costMultiplier)) / 1000) * 1000;
    const max = Math.round((platform.max * (1 + costMultiplier)) / 1000) * 1000;
    return { weeks, min, max };
  };

  const estimate = calcEstimate();

  const canNext = step === 1 ? !!selectedPlatform : step === 2 ? selectedFeatures.length > 0 : false;

  const handleSend = () => {
    const platformLabel = platform?.label || '';
    const featureLabels = pricing.features
      .filter((f) => selectedFeatures.includes(f.id))
      .map((f) => f.label)
      .join(', ');
    const brief = `Bonjour Kévin,\n\nJe souhaite un devis pour un projet :\n\n📱 Type : ${platformLabel}\n⚡ Fonctionnalités : ${featureLabels}\n⏱ Délai : ${estimate.weeks} semaines\n💰 Budget : ${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()} ${pricing.currency}\n\nMerci !`;
    window.open(
      `https://wa.me/2250140448289?text=${encodeURIComponent(brief)}`,
      '_blank',
      'noopener,noreferrer',
    );
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} role="presentation">
          <motion.div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label={t.configurator.closeAria}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className={styles.topBar}>
              <span className={styles.dot} style={{ background: '#ff5f57' }} />
              <span className={styles.dot} style={{ background: '#febc2e' }} />
              <span className={styles.dot} style={{ background: '#28c840' }} />
              <span className={styles.topTitle}>configurator</span>
              <button type="button" className={styles.closeBtn} onClick={onClose} aria-label={t.configurator.closeAria}>
                <FiX />
              </button>
            </div>

            {/* Stepper */}
            <div className={styles.stepper}>
              {[1, 2, 3].map((s) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  <span
                    className={`${styles.stepDot} ${step === s ? styles.active : step > s ? styles.done : styles.pending}`}
                  >
                    {step > s ? '✓' : s}
                  </span>
                  {s < 3 && <span className={`${styles.stepLine} ${step > s ? styles.done : ''}`} />}
                </div>
              ))}
            </div>

            {/* Body */}
            <div className={styles.body}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h3 className={styles.stepTitle}>{t.configurator.step1Title}</h3>
                    <div className={styles.platformGrid}>
                      {pricing.platforms.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className={`${styles.platformCard} ${selectedPlatform === p.id ? styles.selected : ''}`}
                          onClick={() => setSelectedPlatform(p.id)}
                        >
                          <span className={styles.platformIcon}>{PLATFORM_ICONS[p.id]}</span>
                          <span>{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h3 className={styles.stepTitle}>{t.configurator.step2Title}</h3>
                    <div className={styles.featureList}>
                      {pricing.features.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          className={`${styles.featureItem} ${selectedFeatures.includes(f.id) ? styles.checked : ''}`}
                          onClick={() => toggleFeature(f.id)}
                        >
                          <span className={styles.featureCheck}>
                            {selectedFeatures.includes(f.id) ? <FiCheck /> : ''}
                          </span>
                          <span>{FEATURE_ICONS[f.id]}</span>
                          <span className={styles.featureLabel}>{f.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h3 className={styles.stepTitle}>{t.configurator.step3Title}</h3>
                    <div className={styles.resultCard}>
                      <div className={styles.resultRow}>
                        <span className={styles.resultLabel}>{t.configurator.timeline}</span>
                        <span className={styles.resultValue}>{estimate.weeks} {t.configurator.weeks}</span>
                      </div>
                      <div className={styles.resultRow}>
                        <span className={styles.resultLabel}>{t.configurator.budget}</span>
                        <span className={`${styles.resultValue} ${styles.highlight}`}>
                          {estimate.min.toLocaleString()} — {estimate.max.toLocaleString()} {pricing.currency}
                        </span>
                        <span className={styles.resultMeta}>
                          {tpl(t.configurator.featuresSelected, { count: String(selectedFeatures.length) })}
                        </span>
                      </div>
                      <div className={styles.resultActions}>
                        <a
                          href={`https://wa.me/2250140448289?text=${encodeURIComponent(
                            `Bonjour Kévin,\n\nJe souhaite un devis pour un projet :\n\n📱 Type : ${platform?.label || ''}\n⚡ Fonctionnalités : ${pricing.features.filter((f) => selectedFeatures.includes(f.id)).map((f) => f.label).join(', ')}\n⏱ Délai : ${estimate.weeks} semaines\n💰 Budget : ${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()} ${pricing.currency}\n\nMerci !`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.whatsappBtn}
                        >
                          💬 WhatsApp
                        </a>
                        <a href="mailto:bassolekevin022@gmail.com" className={styles.emailLink}>
                          📩 bassolekevin022@gmail.com
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              {step > 1 && (
                <button type="button" className={`${styles.btn} ${styles.btnBack}`} onClick={() => setStep((s) => s - 1)}>
                  {t.configurator.back}
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnNext}`}
                  disabled={!canNext}
                  style={{ opacity: canNext ? 1 : 0.4, cursor: canNext ? 'pointer' : 'not-allowed', marginLeft: step === 1 ? 'auto' : undefined }}
                  onClick={() => setStep((s) => s + 1)}
                >
                  {t.configurator.next}
                </button>
              ) : (
                <button type="button" className={`${styles.btn} ${styles.btnSend}`} onClick={handleSend}>
                  💬 {t.configurator.send}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
