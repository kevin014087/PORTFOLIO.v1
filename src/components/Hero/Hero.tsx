import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  FaTiktok,
  FaFacebookF,
  FaXTwitter,
  FaWhatsapp,
  FaLinkedinIn,
  FaGithub,
} from 'react-icons/fa6';
import { FiFileText, FiSend } from 'react-icons/fi';
import styles from './Hero.module.css';
import { socialLinks } from '../../data/content';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useI18n } from '../../i18n';

interface HeroProps {
  onOpenCv: () => void;
}

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] } },
};

function SocialIcon({ icon }: { icon: (typeof socialLinks)[number]['icon'] }) {
  const iconProps = { className: styles.socialSvg };

  switch (icon) {
    case 'tiktok':
      return <FaTiktok {...iconProps} />;
    case 'facebook':
      return <FaFacebookF {...iconProps} />;
    case 'x':
      return <FaXTwitter {...iconProps} />;
    case 'whatsapp':
      return <FaWhatsapp {...iconProps} />;
    case 'linkedin':
      return <FaLinkedinIn {...iconProps} />;
    case 'github':
      return <FaGithub {...iconProps} />;
  }
}

function ProfileCard3D() {
  const { t } = useI18n();
  const prefersReducedMotion = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 250, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 250, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['14deg', '-14deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-14deg', '14deg']);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.3) 0%, rgba(99,102,241,0.2) 45%, transparent 80%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (prefersReducedMotion) {
    return (
      <div className={styles.perspectiveWrapper}>
        <div className={styles.photoContainer}>
          <img src="/img/profile.webp" alt={t.hero.profileAlt} className={styles.profileImg} fetchPriority="high" decoding="async" />
          <div className={styles.headline3d}>
            <span className={styles.strokeName}>BASSOLE ÉRIC</span>
            <span className={styles.fillName}>KÉVIN</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.perspectiveWrapper}>
      <motion.div
        className={styles.photoContainer}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Dynamic Specular Light Reflection */}
        <motion.div
          className={styles.glareOverlay}
          style={{ background: glareBackground }}
        />

        {/* Profile Image */}
        <img src="/img/profile.webp" alt={t.hero.profileAlt} className={styles.profileImg} fetchPriority="high" decoding="async" />

        {/* 3D Floating Name Badge */}
        <div className={styles.headline3d}>
          <span className={styles.strokeName}>BASSOLE ÉRIC</span>
          <span className={styles.fillName}>KÉVIN</span>
        </div>
      </motion.div>
    </div>
  );
}

export function Hero({ onOpenCv }: HeroProps) {
  const { t } = useI18n();
  return (
    <section className={styles.hero} id="hero">
      <motion.div className={styles.container} variants={heroContainer} initial="hidden" animate="visible">
        <div className={styles.heroLeft}>
          <motion.span className={styles.badge} variants={heroItem}>
            <span className={styles.pulseDot} /> {t.hero.badge}
          </motion.span>

          <motion.div className={styles.photoPanel} variants={heroItem}>
            <ProfileCard3D />
          </motion.div>

          <motion.p className={styles.lead} variants={heroItem}>
            {t.hero.lead}
          </motion.p>
          <motion.div className={styles.ctas} variants={heroItem}>
            <a className={styles.primaryCta} href="#contact">
              <FiSend /> {t.hero.ctaPrimary}
            </a>
            <button type="button" className={styles.secondaryCta} onClick={onOpenCv}>
              <FiFileText /> {t.hero.ctaSecondary}
            </button>
          </motion.div>
          <motion.div className={styles.socials} variants={heroItem}>
            {socialLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} className={styles.socialLink}>
                <SocialIcon icon={item.icon} />
                <span>{item.label}</span>
              </a>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
