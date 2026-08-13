import { FormEvent, lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiUser, FiX, FiExternalLink, FiDownload, FiMessageCircle, FiFilter, FiMail } from 'react-icons/fi';
import type { ChatCard, ChatActionButton, ChatMessage } from '../../types/chat';
import { executeChatAction, sendChatMessage } from '../../lib/chatApi';
import { chatAssistant } from '../../data/content';
import styles from './Chatbox.module.css';

const RobotMascot3D = lazy(() =>
  import('./RobotMascot3D').then((module) => ({ default: module.RobotMascot3D })),
);

interface ChatboxProps {
  onOpenCv?: () => void;
}

const quickQuestions = [
  '🚀 Tarifs & budgets ?',
  '📱 Apps mobiles Flutter ?',
  '🌐 Projets Web & React ?',
  '📄 Obtenir le CV',
  '📬 Me contacter',
];

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  sender: 'bot',
  text: chatAssistant.welcome,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  quickActions: [
    { label: '📱 Apps Mobile', action: 'FILTER_PROJECTS_MOBILE', filter: 'mobile', icon: 'mobile' },
    { label: '🌐 Projets Web', action: 'FILTER_PROJECTS_WEB', filter: 'web', icon: 'web' },
    { label: '📄 Obtenir le CV', action: 'DOWNLOAD_CV', icon: 'cv' },
    { label: '💬 WhatsApp', action: 'OPEN_WHATSAPP', url: 'https://wa.me/2250140448289', icon: 'whatsapp' },
  ],
};

export function Chatbox({ onOpenCv }: ChatboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend ?? input).trim();
    if (!messageText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);
    setError('');

    try {
      const response = await sendChatMessage(messageText, [...messages, userMsg]);

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
          : "Impossible d'obtenir une réponse pour le moment.";
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSendMessage();
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
                aria-label="Fermer le chatbot"
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
                      <img src="/img/logo.png" alt="" className={styles.botLogoAvatar} />
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
                              Découvrir <FiExternalLink />
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
                    <img src="/img/logo.png" alt="" className={styles.botLogoAvatar} />
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

            <form onSubmit={handleSubmit} className={styles.inputBar}>
              <input
                type="text"
                placeholder="Posez une question ou demandez un projet..."
                aria-label="Votre message à l'assistant"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                disabled={isLoading}
              />
              <button type="submit" className={styles.sendBtn} disabled={!input.trim() || isLoading}>
                <FiSend />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className={styles.floatingToggleBtn}
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label={isOpen ? 'Fermer le chat' : `Ouvrir le chat avec ${chatAssistant.name}`}
      >
        <div className={styles.floatingIconWrapper}>
          {isOpen ? (
            <FiX />
          ) : (
            <Suspense fallback={<img src="/img/logo.png" alt="" style={{ width: 38, height: 38 }} />}>
              <RobotMascot3D state="idle" width={38} height={38} interactive={false} />
            </Suspense>
          )}
          <span className={styles.onlinePulse} />
        </div>
        <span className={styles.toggleBtnText}>
          {isOpen ? chatAssistant.toggleClose : chatAssistant.toggleOpen}
        </span>
      </motion.button>
    </div>
  );
}
