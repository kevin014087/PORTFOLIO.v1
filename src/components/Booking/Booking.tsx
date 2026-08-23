import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiClock, FiUser, FiMail, FiPhone, FiCheckCircle, FiMessageCircle } from 'react-icons/fi';
import styles from './Booking.module.css';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useI18n, tpl } from '../../i18n';
import { supabase } from '../../lib/supabase';

const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
const WHATSAPP_NUMBER = '2250140448289';

interface BookingInfo {
  name: string;
  email: string;
  phone: string;
}

function getUpcomingWeekdays(count: number): Date[] {
  const days: Date[] = [];
  const cursor = new Date();
  while (days.length < count) {
    cursor.setDate(cursor.getDate() + 1);
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) days.push(new Date(cursor));
  }
  return days;
}

function formatDay(date: Date, lang: 'fr' | 'en', index: number): { label: string; full: string } {
  const weekday = new Intl.DateTimeFormat(lang, { weekday: 'short' }).format(date);
  const dayMonth = new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'short' }).format(date);
  const label =
    index === 0
      ? lang === 'fr' ? "Aujourd'hui" : 'Today'
      : index === 1
        ? lang === 'fr' ? 'Demain' : 'Tomorrow'
        : `${weekday} ${dayMonth}`;
  return { label, full: new Intl.DateTimeFormat(lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date) };
}

export function Booking() {
  const { t, lang } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [info, setInfo] = useState<BookingInfo>({ name: '', email: '', phone: '' });
  const [topic, setTopic] = useState('project');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const dialogRef = useRef<HTMLDivElement>(null);

  const days = getUpcomingWeekdays(7);

  useFocusTrap(isOpen, dialogRef);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('portfolio-open-booking', handleOpen);
    return () => window.removeEventListener('portfolio-open-booking', handleOpen);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setSelectedDay(days[0] ?? null);
      setSelectedTime(null);
      setStatus('idle');
      setInfo({ name: '', email: '', phone: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const topicLabel = t.booking.topics[topic as 'project' | 'ongoing' | 'advice'];

  const handleConfirm = async () => {
    if (!selectedDay || !selectedTime) return;
    setStatus('saving');

    const dateLabel = formatDay(selectedDay, lang, 0).full;
    const message = tpl(t.booking.whatsappMessage, {
      date: dateLabel,
      time: selectedTime,
      name: info.name,
      email: info.email,
      phone: info.phone || '—',
      topic: topicLabel,
    });

    // Best-effort persistence (silent fallback if not configured)
    if (supabase) {
      try {
        await supabase.from('bookings').insert([
          {
            name: info.name,
            email: info.email,
            phone: info.phone,
            date: selectedDay.toISOString(),
            time: selectedTime,
            topic,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch {
        // ignore: WhatsApp confirmation still works
      }
    }

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setStatus('success');
  };

  const closeModal = () => {
    setIsOpen(false);
    setStatus('idle');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay} onClick={closeModal} role="presentation">
          <motion.div
            ref={dialogRef}
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <div className={styles.headerBadge}>
                <FiCalendar /> {t.booking.badge}
              </div>
              <button type="button" className={styles.closeBtn} onClick={closeModal} aria-label={t.booking.closeAria}>
                <FiX />
              </button>
            </div>

            {status === 'success' ? (
              <div className={styles.successState}>
                <FiCheckCircle className={styles.successIcon} />
                <h3>{t.booking.successTitle}</h3>
                <p>{t.booking.successText}</p>
                <button type="button" className={styles.doneBtn} onClick={closeModal}>
                  OK
                </button>
              </div>
            ) : (
              <>
                <h2 id="booking-title" className={styles.title}>{t.booking.title}</h2>
                <p className={styles.subtitle}>{t.booking.subtitle}</p>

                {/* Step 1: Day */}
                <div className={styles.step}>
                  <h3 className={styles.stepTitle}>{t.booking.stepDay}</h3>
                  <div className={styles.daysRow}>
                    {days.map((day, index) => {
                      const d = formatDay(day, lang, index);
                      const active = selectedDay?.toDateString() === day.toDateString();
                      return (
                        <button
                          key={day.toISOString()}
                          type="button"
                          className={`${styles.dayBtn} ${active ? styles.dayBtnActive : ''}`}
                          onClick={() => setSelectedDay(day)}
                          aria-label={tpl(t.booking.dayAria, { date: d.full })}
                          aria-pressed={active}
                        >
                          <FiClock className={styles.dayIcon} />
                          <span>{d.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Time */}
                <div className={styles.step}>
                  <h3 className={styles.stepTitle}>{t.booking.stepTime}</h3>
                  <div className={styles.slotsRow}>
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        className={`${styles.slotBtn} ${selectedTime === slot ? styles.slotBtnActive : ''}`}
                        onClick={() => setSelectedTime(slot)}
                        aria-label={tpl(t.booking.timeAria, { time: slot })}
                        aria-pressed={selectedTime === slot}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  <span className={styles.timezone}>{t.booking.timezone}</span>
                </div>

                {/* Step 3: Info */}
                <div className={styles.step}>
                  <h3 className={styles.stepTitle}>{t.booking.stepInfo}</h3>
                  <div className={styles.fields}>
                    <label className={styles.field}>
                      <FiUser />
                      <input
                        type="text"
                        required
                        placeholder={t.booking.nameLabel}
                        value={info.name}
                        onChange={(e) => setInfo({ ...info, name: e.target.value })}
                      />
                    </label>
                    <label className={styles.field}>
                      <FiMail />
                      <input
                        type="email"
                        required
                        placeholder={t.booking.emailLabel}
                        value={info.email}
                        onChange={(e) => setInfo({ ...info, email: e.target.value })}
                      />
                    </label>
                    <label className={styles.field}>
                      <FiPhone />
                      <input
                        type="tel"
                        placeholder={t.booking.phoneLabel}
                        value={info.phone}
                        onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                      />
                    </label>
                    <label className={styles.field}>
                      <FiMessageCircle />
                      <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                        <option value="project">{t.booking.topics.project}</option>
                        <option value="ongoing">{t.booking.topics.ongoing}</option>
                        <option value="advice">{t.booking.topics.advice}</option>
                      </select>
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.confirmBtn}
                  onClick={handleConfirm}
                  disabled={!selectedDay || !selectedTime || !info.name.trim() || !info.email.trim() || status === 'saving'}
                >
                  {status === 'saving' ? t.booking.confirming : t.booking.confirm}
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
