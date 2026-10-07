import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, MessageSquare, X, Send, Sparkles, ChevronDown, 
  ExternalLink, ArrowRight, ShieldCheck, Award, Calendar, 
  Compass, HelpCircle, Loader2, RefreshCw, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { sendConciergeChat } from '../services/api';
import { AiChatResponse, AiActionLink } from '../types';

interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
  intent?: string;
  actionLinks?: AiActionLink[];
  quickFollowUps?: string[];
}

export const CampusConciergeChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'AI',
      text: 'Namaste! Main **SphereAI**, Arya College of Engineering & IT (ACEIT) ka Campus Concierge hoon. 🎓\n\nAap mujhse upcoming hackathons, 15 institutional clubs, dynamic anti-screenshot QR passes, ya RTU **100 AICTE Activity Points** honors requirements ke baare me pooch sakte hain!',
      timestamp: 'Just now',
      intent: 'GENERAL_CONCIERGE',
      actionLinks: [
        { label: 'Upcoming Events Calendar', url: '/events', type: 'EVENT' },
        { label: 'Check AICTE Transcript', url: '/profile', type: 'TRANSCRIPT' },
        { label: '15 Institutional Clubs', url: '/clubs', type: 'CLUB' },
      ],
      quickFollowUps: [
        'Next flagship hackathon kab hai?',
        '100 AICTE Activity Points kaise earn karein?',
        'Dynamic QR Pass screenshot policy kya hai?',
        'Certificate public verification demo',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
      setHasUnread(false);
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (customText?: string) => {
    const query = (customText || inputQuery).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'USER',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res: AiChatResponse = await sendConciergeChat({ query });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'AI',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: res.intent,
        actionLinks: res.actionLinks,
        quickFollowUps: res.quickFollowUps,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'AI',
        text: 'Maaf kijiye, campus server se connect karne me dikkat aayi. Kripya thodi der baad dobara koshish karein.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = (text: string) => {
    // Basic Markdown bold & line break renderer
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Replace **text** with <strong>text</strong>
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} style={{ margin: line.startsWith('- ') ? '2px 0 2px 8px' : '4px 0' }}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} style={{ color: '#c7d2fe', fontWeight: 600 }}>
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith('`') && part.endsWith('`')) {
              return (
                <code key={pIdx} style={{ padding: '2px 6px', borderRadius: '4px', background: '#1e293b', color: '#fcd34d', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                  {part.slice(1, -1)}
                </code>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Chat Launcher Button */}
      {!isOpen && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="sphere-ai-floating-btn"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 10px 30px -5px rgba(99, 102, 241, 0.5), 0 0 20px rgba(6, 182, 212, 0.3)',
              cursor: 'pointer',
            }}
            aria-label="Open SphereAI Concierge"
          >
            {/* Pulsing beacon glow */}
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', display: 'flex', height: '14px', width: '14px' }}>
              <span style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: '#22d3ee', opacity: 0.75, animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
              <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '14px', width: '14px', background: '#06b6d4', border: '2px solid #060a14' }}></span>
            </span>

            <div style={{ padding: '6px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.2)', display: 'flex' }}>
              <Bot size={20} color="#fff" />
            </div>

            <div style={{ textAlign: 'left', paddingRight: '4px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>SphereAI</span>
                <span style={{ fontSize: '0.65rem', padding: '1px 6px', background: 'rgba(255, 255, 255, 0.25)', borderRadius: '10px', fontWeight: 600 }}>Concierge</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500 }}>Ask ACEIT Campus AI</div>
            </div>
          </button>
        </div>
      )}

      {/* Expanded Chat Modal */}
      {isOpen && (
        <div
          className="sphere-ai-chat-modal"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '410px',
            maxWidth: 'calc(100vw - 32px)',
            height: isMinimized ? '56px' : '580px',
            maxHeight: 'calc(100vh - 48px)',
            zIndex: 1001,
            borderRadius: '20px',
            background: 'rgba(11, 19, 43, 0.96)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(99, 102, 241, 0.45)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(79, 70, 229, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'height 0.25s ease',
          }}
        >
          {/* Header */}
          <div
            className="sphere-ai-header"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 18px',
              background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              userSelect: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Bot size={20} />
                </div>
                <span style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '10px', height: '10px', background: '#10b981', border: '2px solid #060a14', borderRadius: '50%' }}></span>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.01em', margin: 0 }}>
                    SphereAI Concierge
                  </h3>
                  <span style={{ fontSize: '0.62rem', padding: '1px 6px', fontWeight: 700, background: 'rgba(99, 102, 241, 0.25)', color: '#a5b4fc', borderRadius: '4px', border: '1px solid rgba(99, 102, 241, 0.35)' }}>
                    ACEIT RAG
                  </span>
                </div>
                <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '2px 0 0 0' }}>Live Campus Events & AICTE Advisor</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                <ChevronDown size={18} style={{ transform: isMinimized ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message Feed */}
              <div
                className="sphere-ai-msg-list"
                style={{
                  flex: 1,
                  padding: '16px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.sender === 'USER' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '88%',
                        borderRadius: msg.sender === 'USER' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        padding: '12px 14px',
                        background: msg.sender === 'USER'
                          ? 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)'
                          : 'rgba(15, 23, 42, 0.88)',
                        border: msg.sender === 'USER' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: msg.sender === 'USER' ? '#fff' : '#e2e8f0',
                        fontSize: '0.82rem',
                        lineHeight: 1.5,
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                      }}
                    >
                      {msg.sender === 'AI' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                          <Sparkles size={12} />
                          <span>SphereAI Campus Assistant</span>
                        </div>
                      )}
                      
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {renderFormattedText(msg.text)}
                      </div>

                      {/* Action Links */}
                      {msg.actionLinks && msg.actionLinks.length > 0 && (
                        <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {msg.actionLinks.map((link, idx) => (
                            <Link
                              key={idx}
                              to={link.url}
                              onClick={() => {
                                if (window.innerWidth < 640) setIsOpen(false);
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 10px',
                                borderRadius: '8px',
                                background: 'rgba(99, 102, 241, 0.2)',
                                border: '1px solid rgba(99, 102, 241, 0.35)',
                                color: '#c7d2fe',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                transition: 'all 0.15s',
                              }}
                            >
                              <span>{link.label}</span>
                              <ArrowRight size={12} color="#a5b4fc" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Follow-up suggestions */}
                    {msg.quickFollowUps && msg.quickFollowUps.length > 0 && (
                      <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px', maxWidth: '92%' }}>
                        {msg.quickFollowUps.map((prompt, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => handleSend(prompt)}
                            style={{
                              padding: '4px 10px',
                              fontSize: '0.72rem',
                              borderRadius: '20px',
                              background: 'rgba(15, 23, 42, 0.85)',
                              color: '#c7d2fe',
                              border: '1px solid rgba(99, 102, 241, 0.3)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              textAlign: 'left',
                              transition: 'all 0.15s',
                            }}
                          >
                            <Zap size={11} color="#818cf8" />
                            <span>{prompt}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <span style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '4px', padding: '0 4px' }}>
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {loading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '16px 16px 16px 2px', background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: '0.78rem' }}>
                    <Loader2 size={16} className="animate-spin" color="#818cf8" />
                    <span>SphereAI is retrieving campus knowledge...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div
                className="sphere-ai-input-area"
                style={{
                  padding: '12px 16px',
                  background: 'rgba(6, 10, 20, 0.95)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="Poocho: 'Next event kab hai?' or '100 AICTE points'"
                    className="glass-input"
                    style={{ flex: 1, fontSize: '0.8rem', padding: '10px 12px' }}
                  />
                  <button
                    type="submit"
                    disabled={loading || !inputQuery.trim()}
                    className="btn-primary"
                    style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}
                    aria-label="Send query"
                  >
                    <Send size={15} />
                  </button>
                </form>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.68rem', color: '#64748b', padding: '0 2px' }}>
                  <span>English & Hinglish supported</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={12} color="#34d399" />
                    Verified Arya Knowledge Base
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
