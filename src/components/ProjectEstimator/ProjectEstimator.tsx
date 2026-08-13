import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiSend, FiClock, FiZap, FiLayers } from 'react-icons/fi';
import styles from './ProjectEstimator.module.css';
import { pricing } from '../../data/content';

interface FeatureOption {
  id: string;
  label: string;
  cost: number;
}

export function ProjectEstimator() {
  const [platform, setPlatform] = useState<string>('web');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['auth', 'database']);
  const [timeline, setTimeline] = useState<string>('standard');
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Tarifs Marché Ivoirien en FCFA (XOF) - Base Tarif Junior
  const platforms = pricing.platforms.map((p) => ({
    id: p.id,
    label: p.label,
    desc:
      p.id === 'web'
        ? 'Interface moderne, SEO & responsive'
        : p.id === 'mobile'
          ? 'Développement Flutter & Dart'
          : 'Solution complète clé en main',
    baseCost: p.min,
  }));

  const featuresList: FeatureOption[] = [
    { id: 'auth', label: 'Authentification & Rôles utilisateurs', cost: 30000 },
    { id: 'database', label: 'Base de données (SQL / Supabase)', cost: 40000 },
    { id: 'payment', label: 'Paiement Mobile Money (Wave, Orange, MTN)', cost: 50000 },
    { id: 'admin', label: 'Dashboard / Backoffice Administrateur', cost: 60000 },
    { id: 'api', label: 'API REST Backend (Python / Node.js)', cost: 70000 },
    { id: 'push', label: 'Notifications Push & Realtime', cost: 35000 },
  ];

  const toggleFeature = (id: string) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedFeatures((prev) => [...prev, id]);
    }
  };

  const selectedPlatformObj = platforms.find((p) => p.id === platform) || platforms[0];

  const basePlatformCost = selectedPlatformObj.baseCost;

  const featuresCost = selectedFeatures.reduce((acc, fId) => {
    const feat = featuresList.find((f) => f.id === fId);
    if (!feat) return acc;
    return acc + feat.cost;
  }, 0);

  const multiplier = timeline === 'urgent' ? 1.2 : timeline === 'flexible' ? 0.9 : 1;
  const totalCostEstimate = Math.round((basePlatformCost + featuresCost) * multiplier);

  const formatFcfa = (amount: number) => {
    return amount.toLocaleString('fr-FR') + ' FCFA';
  };

  const handleApplyToForm = () => {
    const featureLabels = selectedFeatures
      .map((fId) => featuresList.find((f) => f.id === fId)?.label)
      .filter(Boolean)
      .join(', ');

    const summaryText = `Bonjour Kevin,\n\nJe souhaite concrétiser un projet :\n- Type : ${selectedPlatformObj.label}\n- Fonctionnalités : ${featureLabels || 'Aucune spécifiée'}\n- Délai : ${timeline}\n- Estimation indicative : ~${formatFcfa(totalCostEstimate)}\n\nMerci de me recontacter pour échanger !`;

    const contactTextarea = document.querySelector('#contact textarea') as HTMLTextAreaElement;
    if (contactTextarea) {
      contactTextarea.value = summaryText;
      contactTextarea.focus();
    }

    const contactSection = document.querySelector('#contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });

    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  return (
    <section id="estimator" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>
            <FiZap /> Estimation Indicative (FCFA)
          </span>
          <h2 className={styles.title}>Estimateur de Budget Projet</h2>
          <p className={styles.subtitle}>
            Obtenez une estimation claire et transparente pour la réalisation de votre projet en FCFA.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Options Column */}
          <div className={styles.optionsCol}>
            {/* Step 1: Platform */}
            <div className={styles.stepBlock}>
              <h3 className={styles.stepTitle}>1. Type de Plateforme</h3>
              <div className={styles.platformCards}>
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`${styles.platformCard} ${platform === p.id ? styles.platformCardActive : ''}`}
                    onClick={() => setPlatform(p.id)}
                  >
                    <div className={styles.platformHeader}>
                      <span className={styles.platformName}>{p.label}</span>
                      {platform === p.id && <FiCheck className={styles.checkIcon} />}
                    </div>
                    <span className={styles.platformDesc}>{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Features */}
            <div className={styles.stepBlock}>
              <h3 className={styles.stepTitle}>2. Fonctionnalités Clés</h3>
              <div className={styles.featuresGrid}>
                {featuresList.map((f) => {
                  const isChecked = selectedFeatures.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      className={`${styles.featureBtn} ${isChecked ? styles.featureBtnActive : ''}`}
                      onClick={() => toggleFeature(f.id)}
                    >
                      <span className={styles.checkbox}>
                        {isChecked && <FiCheck />}
                      </span>
                      <span>{f.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Timeline */}
            <div className={styles.stepBlock}>
              <h3 className={styles.stepTitle}>3. Délai de Livraison</h3>
              <div className={styles.timelineTabs}>
                {[
                  { id: 'urgent', label: 'Urgent (< 3 semaines)' },
                  { id: 'standard', label: 'Standard (1 mois)' },
                  { id: 'flexible', label: 'Flexible (> 2 mois)' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`${styles.timelineBtn} ${timeline === t.id ? styles.timelineBtnActive : ''}`}
                    onClick={() => setTimeline(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Box */}
          <div className={styles.summaryCol}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>
                <FiLayers /> Récapitulatif Budgétaire (FCFA)
              </h3>

              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Estimation Indicative :</span>
                <span className={styles.priceValue}>
                  ~{formatFcfa(totalCostEstimate)}
                </span>
              </div>

              <div className={styles.detailRow}>
                <span><FiClock /> Délai estimé :</span>
                <strong>
                  {timeline === 'urgent' ? '2 à 3 semaines' : timeline === 'flexible' ? '6 à 8 semaines' : '3 à 5 semaines'}
                </strong>
              </div>

              <ul className={styles.featureSummaryList}>
                <li><strong>Plateforme :</strong> {selectedPlatformObj.label}</li>
                <li><strong>Fonctionnalités :</strong> {selectedFeatures.length} sélectionnée(s)</li>
              </ul>

              <motion.button
                type="button"
                className={styles.sendEstimateBtn}
                onClick={handleApplyToForm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <FiSend />
                <span>{copiedSummary ? 'Injecté dans le formulaire !' : 'Transférer vers le formulaire'}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

