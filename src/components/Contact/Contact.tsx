import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { onSubmit } from '../../lib/contact';
import styles from './Contact.module.css';

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? ''),
    };

    setStatus('sending');
    setErrorMessage('');
    const res = await onSubmit(data);
    if (res.success) {
      setStatus('success');
      event.currentTarget.reset();
    } else {
      setStatus('error');
      setErrorMessage(res.error || 'Erreur lors de l\'envoi.');
    }
  };

  return (
    <motion.section
      className={styles.contact}
      id="contact"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      aria-labelledby="contact-heading"
    >
      <div className={styles.intro}>
        <p className={styles.subtitle}>Contact</p>
        <h2 id="contact-heading">Un projet en tête ?</h2>
        <p className={styles.description}>
          Ensemble, transformons votre idée en un produit clair, rapide et efficace. Écrivez-moi ou passez par le formulaire ci-dessous.
        </p>
        <div className={styles.buttons}>
          <a href="mailto:bassolekevin022@gmail.com" aria-label="Envoyer un email directement à Eric Kevin">
            M'écrire par email ↗
          </a>
          <a
            href="https://github.com/kevcompilepas"
            className={styles.secondary}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Consulter le profil GitHub de KevCompilePas (s'ouvre dans un nouvel onglet)"
          >
            Voir mon GitHub ↗
          </a>
        </div>
      </div>
      <form className={styles.form} onSubmit={handleSubmit} aria-label="Formulaire de contact">
        <label htmlFor="contact-name">
          Nom
          <input id="contact-name" name="name" type="text" required aria-required="true" />
        </label>
        <label htmlFor="contact-email">
          Email
          <input id="contact-email" name="email" type="email" required aria-required="true" />
        </label>
        <label htmlFor="contact-message">
          Message
          <textarea id="contact-message" name="message" rows={5} required aria-required="true" />
        </label>
        <button type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'}>
          {status === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
        </button>
        <div aria-live="polite">
          {status === 'success' && (
            <p className={styles.success}>Merci ! Votre message a bien été envoyé.</p>
          )}
          {status === 'error' && (
            <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.9rem' }}>
              ❌ {errorMessage}
            </p>
          )}
        </div>
      </form>
    </motion.section>
  );
}

