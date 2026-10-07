import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, Clock, MapPin, Users, Award, AlertTriangle, 
  CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Building2,
  DollarSign, FileText, ChevronRight, Wand2, Bot, Loader2
} from 'lucide-react';
import { Venue } from '../types';
import { fetchVenues, checkVenueClash, proposeEvent, VenueClashResult, generateAiEventDraft } from '../services/api';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubId: string;
  clubName: string;
  onEventCreated?: () => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  clubId,
  clubName,
  onEventCreated,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loadingVenues, setLoadingVenues] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successEvent, setSuccessEvent] = useState<any | null>(null);

  // AI Copilot State
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingAi, setGeneratingAi] = useState(false);
  const [aiDraftSuccess, setAiDraftSuccess] = useState<string | null>(null);
  const [showAiAssistant, setShowAiAssistant] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('TECHNICAL');
  const [tagsStr, setTagsStr] = useState('AI, Hackathon, ACEIT');
  const [shortSummary, setShortSummary] = useState('');
  const [descriptionMarkdown, setDescriptionMarkdown] = useState('');
  const [bannerImage, setBannerImage] = useState(
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200'
  );
  
  // Venue & Timing State
  const [selectedVenueId, setSelectedVenueId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('16:00');

  // Clash Check State
  const [isCheckingClash, setIsCheckingClash] = useState(false);
  const [clashResult, setClashResult] = useState<VenueClashResult | null>(null);

  // Ticketing & AICTE State
  const [registrationType, setRegistrationType] = useState<'SOLO' | 'TEAM'>('SOLO');
  const [minTeamSize, setMinTeamSize] = useState(2);
  const [maxTeamSize, setMaxTeamSize] = useState(4);
  const [isPaid, setIsPaid] = useState(false);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [maxCapacity, setMaxCapacity] = useState(150);
  const [activityPointsAwarded, setActivityPointsAwarded] = useState(20);

  // Load venues on mount
  useEffect(() => {
    if (isOpen) {
      loadVenues();
      initDefaultDates();
    }
  }, [isOpen]);

  const initDefaultDates = () => {
    // Default to 14 days in future
    const d = new Date();
    d.setDate(d.getDate() + 14);
    const dateStr = d.toISOString().split('T')[0];
    setStartDate(dateStr);
    setEndDate(dateStr);
  };

  const loadVenues = async () => {
    try {
      setLoadingVenues(true);
      const data = await fetchVenues();
      setVenues(data);
      if (data.length > 0 && !selectedVenueId) {
        setSelectedVenueId(data[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load venues:', err);
    } finally {
      setLoadingVenues(false);
    }
  };

  const handleGenerateAiDraft = async (customPrompt?: string) => {
    const promptText = (customPrompt || aiPrompt).trim();
    if (!promptText) return;

    try {
      setGeneratingAi(true);
      setErrorMsg(null);
      const draft = await generateAiEventDraft({
        prompt: promptText,
        clubId,
        category,
      });

      if (draft.suggestedTitle) setTitle(draft.suggestedTitle);
      if (draft.shortSummary) setShortSummary(draft.shortSummary);
      if (draft.descriptionMarkdown) setDescriptionMarkdown(draft.descriptionMarkdown);
      if (draft.tags && draft.tags.length > 0) setTagsStr(draft.tags.join(', '));
      if (draft.suggestedPoints) setActivityPointsAwarded(draft.suggestedPoints);
      if (draft.recommendedCapacity) setMaxCapacity(draft.recommendedCapacity);

      if (draft.suggestedCategory) {
        const catUpper = draft.suggestedCategory.toUpperCase();
        if (['TECHNICAL', 'HACKATHON', 'WORKSHOP', 'CULTURAL', 'SPORTS', 'LITERARY', 'SOCIAL'].includes(catUpper)) {
          setCategory(catUpper);
        }
      }

      if (draft.idealVenueName && venues.length > 0) {
        const matched = venues.find(v => 
          v.name.toLowerCase().includes(draft.idealVenueName.toLowerCase()) || 
          draft.idealVenueName.toLowerCase().includes(v.name.toLowerCase())
        );
        if (matched) setSelectedVenueId(matched.id);
      }

      setAiDraftSuccess(`Draft Ready: "${draft.suggestedTitle}" (${draft.suggestedPoints} AICTE Points auto-assigned)`);
      setTimeout(() => setAiDraftSuccess(null), 6000);
    } catch (err: any) {
      setErrorMsg(err.message || 'AI proposal synthesis failed.');
    } finally {
      setGeneratingAi(false);
    }
  };

  // Perform clash check whenever venue or times change
  useEffect(() => {
    if (!selectedVenueId || !startDate || !startTime || !endDate || !endTime) return;

    const timer = setTimeout(() => {
      runClashCheck();
    }, 400);

    return () => clearTimeout(timer);
  }, [selectedVenueId, startDate, startTime, endDate, endTime]);

  const runClashCheck = async () => {
    try {
      setIsCheckingClash(true);
      const startIso = new Date(`${startDate}T${startTime}:00`).toISOString();
      const endIso = new Date(`${endDate}T${endTime}:00`).toISOString();

      if (new Date(endIso) <= new Date(startIso)) {
        setClashResult({
          clash: true,
          bufferExplanation: 'End time must be after Start time.',
        });
        return;
      }

      const res = await checkVenueClash({
        venueId: selectedVenueId,
        startTime: startIso,
        endTime: endIso,
      });
      setClashResult(res);
    } catch (err: any) {
      console.warn('Clash check error:', err);
    } finally {
      setIsCheckingClash(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !shortSummary || !selectedVenueId || !startDate || !endDate) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (clashResult?.clash) {
      setErrorMsg('Cannot propose event: Venue buffer collision detected. Please adjust time or select an alternative venue.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const startIso = new Date(`${startDate}T${startTime}:00`).toISOString();
      const endIso = new Date(`${endDate}T${endTime}:00`).toISOString();

      const tags = tagsStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const created = await proposeEvent({
        title,
        clubId,
        category,
        tags,
        shortSummary,
        descriptionMarkdown: descriptionMarkdown || shortSummary,
        bannerImage,
        venueId: selectedVenueId,
        startTime: startIso,
        endTime: endIso,
        registrationType,
        minTeamSize: registrationType === 'TEAM' ? minTeamSize : 1,
        maxTeamSize: registrationType === 'TEAM' ? maxTeamSize : 1,
        isPaid,
        ticketPrice: isPaid ? ticketPrice : 0,
        maxCapacity: Number(maxCapacity),
        activityPointsAwarded: Number(activityPointsAwarded),
      });

      setSuccessEvent(created);
      if (onEventCreated) onEventCreated();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit event proposal.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(14px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div className="glass-panel" style={{
        position: 'relative',
        width: '100%',
        maxWidth: '820px',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '20px',
        border: '1px solid rgba(99, 102, 241, 0.35)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.15)',
        background: 'rgba(11, 19, 43, 0.98)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.25)', color: '#818cf8', display: 'flex' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Propose New Institutional Event
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
                Organized by <span style={{ color: '#818cf8', fontWeight: 700 }}>{clubName}</span> • Enforcing 30-min Venue Collision Buffers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255, 255, 255, 0.06)', border: 'none', color: '#94a3b8', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Success Modal Screen */}
        {successEvent ? (
          <div style={{ padding: '36px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ width: '64px', height: '64px', margin: '0 auto', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                Event Proposal Submitted Successfully!
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', maxWidth: '500px', margin: '0 auto' }}>
                <span style={{ fontWeight: 700, color: '#818cf8' }}>"{successEvent.title}"</span> has been locked into the Institutional Calendar with mandatory 30-min setup and teardown buffers.
              </p>
            </div>

            <div style={{ maxWidth: '440px', margin: '0 auto', width: '100%', padding: '16px', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Current Status:</span>
                <span className="badge-status-pending">PENDING_APPROVAL</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Reserved Venue:</span>
                <span style={{ fontWeight: 600, color: '#fff' }}>{successEvent.venueName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>AICTE Activity Points:</span>
                <span style={{ fontWeight: 700, color: '#34d399' }}>+{successEvent.activityPointsAwarded} Points</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Next Action:</span>
                <span style={{ color: '#cbd5e1' }}>Awaiting Dean Academics 1-Click Sanction</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn-primary"
              style={{ margin: '0 auto', padding: '10px 24px', fontSize: '0.88rem' }}
            >
              Done & Return to Console
            </button>
          </div>
        ) : (
          <div>
            {/* Step Navigation Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(6, 10, 20, 0.6)' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: '14px 16px',
                  border: 'none',
                  borderBottom: step === 1 ? '2px solid #6366f1' : '2px solid transparent',
                  background: step === 1 ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  color: step === 1 ? '#a5b4fc' : '#94a3b8',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>1</span>
                <span>Event Overview</span>
              </button>

              <button
                onClick={() => setStep(2)}
                style={{
                  padding: '14px 16px',
                  border: 'none',
                  borderBottom: step === 2 ? '2px solid #6366f1' : '2px solid transparent',
                  background: step === 2 ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  color: step === 2 ? '#a5b4fc' : '#94a3b8',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>2</span>
                <span>Venue & 30-min Buffer</span>
              </button>

              <button
                onClick={() => setStep(3)}
                style={{
                  padding: '14px 16px',
                  border: 'none',
                  borderBottom: step === 3 ? '2px solid #6366f1' : '2px solid transparent',
                  background: step === 3 ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  color: step === 3 ? '#a5b4fc' : '#94a3b8',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>3</span>
                <span>Ticketing & AICTE</span>
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div style={{ margin: '16px 24px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#f87171', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto' }}>
              {/* STEP 1: Event Identity */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* SphereAI Proposal Copilot Card */}
                  <div
                    className="ai-copilot-card"
                    style={{
                      padding: '18px 20px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.85) 100%)',
                      border: '1px solid rgba(99, 102, 241, 0.4)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 20px rgba(99, 102, 241, 0.15)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.25)', color: '#a5b4fc', display: 'flex' }}>
                          <Bot size={16} />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#c7d2fe' }}>
                          SphereAI Proposal Copilot
                        </span>
                        <span style={{ padding: '2px 6px', fontSize: '0.62rem', fontWeight: 800, background: 'rgba(99, 102, 241, 0.25)', color: '#c7d2fe', borderRadius: '4px', border: '1px solid rgba(99, 102, 241, 0.35)' }}>
                          BETA
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        1-Click AI syllabus, timeline & AICTE point alignment
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleGenerateAiDraft();
                            }
                          }}
                          placeholder="Type an idea: e.g. 36-hr national hackathon on Edge AI in Turing Lab with 25 AICTE points"
                          className="glass-input"
                          style={{ flex: 1, fontSize: '0.82rem', padding: '10px 14px' }}
                        />
                        <button
                          type="button"
                          disabled={generatingAi || !aiPrompt.trim()}
                          onClick={() => handleGenerateAiDraft()}
                          className="btn-primary"
                          style={{
                            padding: '10px 18px',
                            fontSize: '0.82rem',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {generatingAi ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <Wand2 size={14} />
                              <span>Auto-Draft</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Quick Idea Templates */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Quick Ideas:</span>
                        {[
                          { label: '36-hr Hackathon', prompt: '36-hour national coding hackathon on generative AI and web3 in Turing Lab' },
                          { label: 'Robotics Derby', prompt: 'Autonomous drone and robotics obstacle derby in Arya central auditorium' },
                          { label: 'Cloud Workshop', prompt: 'Hands-on full stack cloud deployment and Docker microservices bootcamp' },
                          { label: 'Esports Battle', prompt: 'Inter-college BGMI and Valorant esports invitational championship' },
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setAiPrompt(item.prompt);
                              handleGenerateAiDraft(item.prompt);
                            }}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '20px',
                              background: 'rgba(15, 23, 42, 0.85)',
                              border: '1px solid rgba(99, 102, 241, 0.25)',
                              color: '#cbd5e1',
                              fontSize: '0.72rem',
                              fontWeight: 500,
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}
                          >
                            + {item.label}
                          </button>
                        ))}
                      </div>

                      {aiDraftSuccess && (
                        <div style={{ padding: '8px 12px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#34d399', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle2 size={14} />
                          <span>{aiDraftSuccess}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                      Event Title <span style={{ color: '#f43f5e' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Arya TechSprint 2026: Next-Gen Autonomous Systems"
                      className="glass-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                        Category <span style={{ color: '#f43f5e' }}>*</span>
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="glass-input"
                      >
                        <option value="TECHNICAL">Technical & Coding</option>
                        <option value="HACKATHON">Hackathon & Ideathon</option>
                        <option value="WORKSHOP">Hands-on Workshop</option>
                        <option value="CULTURAL">Cultural & Arts</option>
                        <option value="SPORTS">Sports & Esports</option>
                        <option value="LITERARY">Literary & Debate</option>
                        <option value="SOCIAL">Social Welfare & CSR</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={tagsStr}
                        onChange={(e) => setTagsStr(e.target.value)}
                        placeholder="AI, Python, ACEIT, Robotics"
                        className="glass-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                      Short Summary <span style={{ color: '#f43f5e' }}>*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={shortSummary}
                      onChange={(e) => setShortSummary(e.target.value)}
                      placeholder="A compelling 1-2 sentence pitch visible in campus feeds and WhatsApp circulars."
                      className="glass-input"
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                      Banner Image URL
                    </label>
                    <input
                      type="url"
                      value={bannerImage}
                      onChange={(e) => setBannerImage(e.target.value)}
                      className="glass-input"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Venue Booking & Clash Detection */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ padding: '14px 16px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', fontSize: '0.8rem', color: '#c7d2fe', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <ShieldCheck size={18} color="#818cf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <p style={{ fontWeight: 700, color: '#fff' }}>ACEIT Institutional Venue Policy (Automated Buffer Engine)</p>
                      <p style={{ marginTop: '3px', color: '#cbd5e1' }}>
                        CampusSphere automatically reserves a <strong style={{ color: '#fff' }}>30-minute setup buffer</strong> prior to your start time and a <strong style={{ color: '#fff' }}>30-minute teardown buffer</strong> following conclusion to guarantee smooth facility handover.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                      Select Institutional Venue <span style={{ color: '#f43f5e' }}>*</span>
                    </label>
                    <select
                      value={selectedVenueId}
                      onChange={(e) => setSelectedVenueId(e.target.value)}
                      className="glass-input"
                    >
                      {venues.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.code}) — Capacity: {v.capacity} pax • {v.location}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1' }}>
                        <Calendar size={15} color="#818cf8" />
                        <span>Event Start (with 30m Setup Buffer)</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="glass-input"
                          style={{ padding: '8px 10px', fontSize: '0.78rem' }}
                        />
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="glass-input"
                          style={{ padding: '8px 10px', fontSize: '0.78rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1' }}>
                        <Clock size={15} color="#c084fc" />
                        <span>Event End (with 30m Cleanup Buffer)</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="glass-input"
                          style={{ padding: '8px 10px', fontSize: '0.78rem' }}
                        />
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="glass-input"
                          style={{ padding: '8px 10px', fontSize: '0.78rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Clash Engine Feedback */}
                  {isCheckingClash && (
                    <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.78rem', color: '#94a3b8' }}>
                      <Clock size={15} className="animate-spin" color="#818cf8" />
                      <span>Checking Arya College venue calendar & buffer overlaps in MongoDB Atlas...</span>
                    </div>
                  )}

                  {!isCheckingClash && clashResult && clashResult.clash && (
                    <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <AlertTriangle size={20} color="#f87171" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f87171', margin: 0 }}>
                            VENUE COLLISION DETECTED!
                          </h4>
                          <p style={{ fontSize: '0.78rem', color: '#fca5a5', marginTop: '4px' }}>
                            {clashResult.bufferExplanation}
                          </p>
                        </div>
                      </div>

                      {clashResult.alternativeVenues && clashResult.alternativeVenues.length > 0 && (
                        <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(239, 68, 68, 0.25)' }}>
                          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fecaca', marginBottom: '8px' }}>
                            Available Alternative Venues for this Slot:
                          </p>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            {clashResult.alternativeVenues.map((alt) => (
                              <button
                                key={alt.id}
                                type="button"
                                onClick={() => setSelectedVenueId(alt.id)}
                                style={{ padding: '10px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                              >
                                <div>
                                  <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>{alt.name}</div>
                                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Cap: {alt.capacity} • {alt.location}</div>
                                </div>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#34d399', padding: '2px 6px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '4px' }}>Switch</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!isCheckingClash && clashResult && !clashResult.clash && (
                    <div style={{ padding: '14px 16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#34d399', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CheckCircle2 size={18} />
                      <div>
                        <p style={{ fontWeight: 700, color: '#fff' }}>Venue Slot Verified & Buffers Clear!</p>
                        <p style={{ color: '#a7f3d0', fontSize: '0.75rem', margin: '2px 0 0 0' }}>{clashResult.bufferExplanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Ticketing & AICTE Points */}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                        Registration Type
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setRegistrationType('SOLO')}
                          style={{
                            padding: '10px',
                            borderRadius: '10px',
                            border: registrationType === 'SOLO' ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
                            background: registrationType === 'SOLO' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                            color: registrationType === 'SOLO' ? '#c7d2fe' : '#94a3b8',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Individual (Solo)
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegistrationType('TEAM')}
                          style={{
                            padding: '10px',
                            borderRadius: '10px',
                            border: registrationType === 'TEAM' ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
                            background: registrationType === 'TEAM' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                            color: registrationType === 'TEAM' ? '#c7d2fe' : '#94a3b8',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Team / Squad
                        </button>
                      </div>
                    </div>

                    {registrationType === 'TEAM' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                            Min Team Size
                          </label>
                          <input
                            type="number"
                            min={2}
                            max={10}
                            value={minTeamSize}
                            onChange={(e) => setMinTeamSize(Number(e.target.value))}
                            className="glass-input"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                            Max Team Size
                          </label>
                          <input
                            type="number"
                            min={2}
                            max={10}
                            value={maxTeamSize}
                            onChange={(e) => setMaxTeamSize(Number(e.target.value))}
                            className="glass-input"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                        Max Participant Capacity <span style={{ color: '#f43f5e' }}>*</span>
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={1500}
                        value={maxCapacity}
                        onChange={(e) => setMaxCapacity(Number(e.target.value))}
                        className="glass-input"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                        AICTE Activity Points Awarded
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="range"
                          min={0}
                          max={50}
                          step={5}
                          value={activityPointsAwarded}
                          onChange={(e) => setActivityPointsAwarded(Number(e.target.value))}
                          style={{ flex: 1, accentColor: '#6366f1' }}
                        />
                        <span style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#34d399', fontWeight: 800, fontSize: '0.82rem' }}>
                          +{activityPointsAwarded} Pts
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ticketing Pricing */}
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>Event Entry Fee</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                          Free entry or paid ticket collected through Razorpay directly into club treasury.
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setIsPaid(false)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: 'none',
                            background: !isPaid ? '#6366f1' : 'rgba(255, 255, 255, 0.08)',
                            color: '#fff',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Free
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsPaid(true)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: 'none',
                            background: isPaid ? '#6366f1' : 'rgba(255, 255, 255, 0.08)',
                            color: '#fff',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Paid
                        </button>
                      </div>
                    </div>

                    {isPaid && (
                      <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                          Ticket Price per Entry (₹ INR)
                        </label>
                        <input
                          type="number"
                          min={10}
                          step={10}
                          value={ticketPrice}
                          onChange={(e) => setTicketPrice(Number(e.target.value))}
                          className="glass-input"
                          style={{ maxWidth: '180px' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(6, 10, 20, 0.8)',
            }}>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as any)}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (step === 1 && !title) {
                        setErrorMsg('Please enter an event title.');
                        return;
                      }
                      setErrorMsg(null);
                      setStep((s) => (s + 1) as any);
                    }}
                    className="btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.82rem' }}
                  >
                    <span>Next</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting || (clashResult?.clash ?? false)}
                    className="btn-primary"
                    style={{
                      padding: '10px 22px',
                      fontSize: '0.82rem',
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    }}
                  >
                    {submitting ? (
                      <>
                        <Clock size={15} className="animate-spin" />
                        <span>Submitting to Dean...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        <span>Submit Proposal for Dean Approval</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
