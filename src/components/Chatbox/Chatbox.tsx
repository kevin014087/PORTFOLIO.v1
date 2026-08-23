import { FormEvent, lazy, memo, Suspense, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiUser, FiX, FiExternalLink, FiDownload, FiMessageCircle, FiFilter, FiMail } from 'react-icons/fi';
import type { ChatCard, ChatActionButton, ChatMessage } from '../../types/chat';
import { executeChatAction, sendChatMessage } from '../../lib/chatApi';
import { useI18n } from '../../i18n';
import styles from './Chatbox.module.css';

const RobotMascot3D = lazy(() =>
  import('./RobotMascot3D').then((module) => ({ default: module.RobotMascot3D })),
);

interface ChatboxProps {
  onOpenCv?: () => void;
}

interface ChatInputBarProps {
  placeholder: string;
  ariaLabel: string;
  disabled: boolean;
  onSend: (text: string) => void;
}

// Barre de saisie isolée : la frappe ne re-rend que ce sous-composant
const ChatInputBar = memo(function ChatInputBar({ placeholder, ariaLabel, disabled, onSend }: ChatInputBarProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus auto à l'ouverture (jamais de blocage : l'input reste toujours actif)
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = value.trim();
    if (!text || disabled) return;
    setValue('');
    onSend(text);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.inputBar}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button type="submit" className={styles.sendBtn} disabled={!value.trim() || disabled}>
        <FiSend />
      </button>
    </form>
  );
});

export function Chatbox({ onOpenCv }: ChatboxProps) {
  const { t, content, lang } = useI18n();
  const chatAssistant = content.chatAssistant;
  const quickQuestions = t.chat.quickQuestions;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: chatAssistant.welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: t.chat.quickActions as ChatActionButton[],
      },
    ]);
  }, [chatAssistant.welcome, t.chat.quickActions]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError('');

    try {
      const response = await sendChatMessage(messageText, [...messages, userMsg], lang);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: response.action,
        filter: response.filter,
        cards: response.cards.length > 0 ? response.cards : undefined,
        quickActions: response.quickActions && response.quickActions.length > 0 ? response.quickActions : undefined,
      };

      setMessages((prev) => [...prev, botMsg]);
      executeChatAction(response.action, response.filter, onOpenCv);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : t.chat.errorFallback;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (card: ChatCard) => {
    executeChatAction(card.action || null, card.filter, onOpenCv, card.link, card.projectId);
  };

  const handleQuickActionClick = (qa: ChatActionButton) => {
    executeChatAction(qa.action, qa.filter, onOpenCv, qa.url);
  };

  const renderActionIcon = (icon?: string) => {
    switch (icon) {
      case 'cv':
        return <FiDownload />;
      case 'whatsapp':
        return <FiMessageCircle />;
      case 'contact':
      case 'email':
        return <FiMail />;
      case 'mobile':
      case 'web':
      case 'projects':
      default:
        return <FiFilter />;
    }
  };

  return (
    <div className={styles.widgetContainer}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.chatWindow}
            initial={{ opacity: 0, scale: 0.82, y: 30, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.82, y: 30, rotateX: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
            <div className={styles.chatTopBar}>
              <div className={styles.topBarLeft}>
                <div className={styles.botAvatar}>
                  <Suspense fallback={<div style={{ width: 56, height: 56 }} />}>
                    <RobotMascot3D
                      state={isLoading ? 'thinking' : 'idle'}
                      width={56}
                      height={56}
                      interactive={true}
                    />
                  </Suspense>
                </div>
                <div className={styles.botInfo}>
                  <h3>{chatAssistant.name}</h3>
                  <span>● {chatAssistant.subtitle}</span>
                </div>
              </div>
              <button
                type="button"
                className={styles.closeChatBtn}
                onClick={() => setIsOpen(false)}
                aria-label={t.chat.closeAria}
              >
                <FiX />
              </button>
            </div>

            <div className={styles.quickQuestionsRow}>
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  className={styles.quickPill}
                  onClick={() => void handleSendMessage(question)}
                  disabled={isLoading}
                >
                  {question}
                </button>
              ))}
            </div>

            <div className={styles.messagesContainer}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`${styles.messageWrapper} ${msg.sender === 'user' ? styles.userMsgWrapper : styles.botMsgWrapper}`}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <div className={styles.msgAvatar}>
                    {msg.sender === 'bot' ? (
                      <img src="/img/logo.webp" alt="" className={styles.botLogoAvatar} loading="lazy" decoding="async" />
                    ) : (
                      <FiUser />
                    )}
                  </div>
                  <div className={styles.msgContent}>
                    <div className={styles.msgBubble}>
                      <p className={styles.msgText}>{msg.text}</p>
                      <span className={styles.msgTime}>{msg.timestamp}</span>
                    </div>

                    {msg.cards && msg.cards.length > 0 && (
                      <div className={styles.cardsGrid}>
                        {msg.cards.map((card, index) => (
                          <button
                            key={`${msg.id}-card-${index}`}
                            type="button"
                            className={styles.cardItem}
                            onClick={() => handleCardClick(card)}
                          >
                            {card.tag && <span className={styles.cardTag}>{card.tag}</span>}
                            <strong>{card.title}</strong>
                            {card.description && <p>{card.description}</p>}

                            {card.badges && card.badges.length > 0 && (
                              <div className={styles.cardBadges}>
                                {card.badges.map((badge, i) => (
                                  <span key={`${card.title}-badge-${i}`} className={styles.badgePill}>
                                    {badge}
                                  </span>
                                ))}
                              </div>
                            )}

                            <span className={styles.cardLink}>
                              {t.chat.discover} <FiExternalLink />
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.quickActions && msg.quickActions.length > 0 && (
                      <div className={styles.quickActionsRow}>
                        {msg.quickActions.map((qa, index) => (
                          <button
                            key={`${msg.id}-qa-${index}`}
                            type="button"
                            className={styles.quickActionButton}
                            onClick={() => handleQuickActionClick(qa)}
                          >
                            {renderActionIcon(qa.icon)}
                            <span>{qa.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className={`${styles.messageWrapper} ${styles.botMsgWrapper}`}>
                  <div className={styles.msgAvatar}>
                    <img src="/img/logo.webp" alt="" className={styles.botLogoAvatar} loading="lazy" decoding="async" />
                  </div>
                  <div className={styles.typingIndicator}>
                    <span /><span /><span />
                  </div>
                </div>
              )}

              {error && (
                <p className={styles.errorBanner} role="alert">
                  {error}
                </p>
              )}

              <div ref={messagesEndRef} />
            </div>

            <ChatInputBar
              placeholder={t.chat.inputPlaceholder}
              ariaLabel={t.chat.inputAria}
              disabled={isLoading}
              onSend={handleSendMessage}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          type="button"
          className={styles.floatingToggleBtn}
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          aria-label={`Open chat with ${chatAssistant.name}`}
        >
          <div className={styles.floatingIconWrapper}>
            <Suspense fallback={<img src="/img/logo.webp" alt="" style={{ width: 38, height: 38 }} loading="lazy" decoding="async" />}>
              <RobotMascot3D state="idle" width={38} height={38} interactive={false} />
            </Suspense>
            <span className={styles.onlinePulse} />
          </div>
          <span className={styles.toggleBtnText}>{chatAssistant.toggleOpen}</span>
        </motion.button>
      )}
    </div>
  );
}
