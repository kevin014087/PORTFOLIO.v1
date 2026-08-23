import { FormEvent, useState } from 'react';
import { FiCalendar } from 'react-icons/fi';
import { onSubmit } from '../../lib/contact';
import styles from './Contact.module.css';
import { useI18n } from '../../i18n';
import { useScrollReveal } from '../../hooks/useScrollReveal';

function renderAccent(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <span key={i} className="accent-italic">{part.slice(1, -1)}</span>;
    }
    return part;
  });
}

export function Contact() {
  const { t } = useI18n();
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
      setErrorMessage(res.error || t.contact.errorFallback);
    }
  };

  const handleOpenBooking = () => {
    window.dispatchEvent(new CustomEvent('portfolio-open-booking'));
  };

  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section ref={ref} className={styles.contact} id="contact" aria-labelledby="contact-heading">
      <div className={styles.intro}>
        <p className={styles.subtitle}>{t.contact.subtitle}</p>
        <h2 id="contact-heading">{renderAccent(t.contact.heading)}</h2>
        <p className={styles.description}>
          {t.contact.description}
        </p>
        <div className={styles.buttons}>
          <a href="mailto:bassolekevin022@gmail.com" aria-label={t.contact.emailAria}>
            {t.contact.emailBtn}
          </a>
          <button type="button" className={styles.secondary} onClick={handleOpenBooking} aria-label={t.contact.bookCallAria}>
            <FiCalendar /> {t.contact.bookCall}
          </button>
          <a
            href="https://github.com/kevcompilepas"
            className={styles.secondary}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.contact.githubAria}
          >
            {t.contact.githubBtn}
          </a>
        </div>
      </div>
      <form className={styles.form} onSubmit={handleSubmit} aria-label={t.contact.formAria}>
        <label htmlFor="contact-name">
          {t.contact.name}
          <input id="contact-name" name="name" type="text" required aria-required="true" />
        </label>
        <label htmlFor="contact-email">
          {t.contact.email}
          <input id="contact-email" name="email" type="email" required aria-required="true" />
        </label>
        <label htmlFor="contact-message">
          {t.contact.message}
          <textarea id="contact-message" name="message" rows={5} required aria-required="true" />
        </label>
        <button type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'}>
          {status === 'sending' ? t.contact.sending : t.contact.send}
        </button>
        <div aria-live="polite">
          {status === 'success' && (
            <p className={styles.success}>{t.contact.success}</p>
          )}
          {status === 'error' && (
            <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.9rem' }}>
              ❌ {errorMessage}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
