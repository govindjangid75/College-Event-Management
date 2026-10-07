import React, { useState, useMemo } from 'react';
import { 
  X, 
  Star, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Sparkles, 
  Send, 
  ThumbsUp, 
  ShieldCheck, 
  Building2, 
  Clock, 
  UserCheck, 
  BookOpen, 
  SlidersHorizontal 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { submitFeedback, FeedbackSubmissionPayload } from '../services/api';
import { VerifiedFeedback } from '../types';

interface EventFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  clubName?: string;
  isAttendanceVerified: boolean;
  ticketNumber?: string;
  onFeedbackSubmitted?: (feedback: VerifiedFeedback) => void;
}

export const EventFeedbackModal: React.FC<EventFeedbackModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  clubName,
  isAttendanceVerified,
  ticketNumber,
  onFeedbackSubmitted,
}) => {
  const { currentUser } = useAuth();

  // 5 Vectors
  const [contentDepth, setContentDepth] = useState<number>(5);
  const [organization, setOrganization] = useState<number>(5);
  const [speakerQuality, setSpeakerQuality] = useState<number>(5);
  const [venueFacilities, setVenueFacilities] = useState<number>(5);
  const [valueForTime, setValueForTime] = useState<number>(5);

  // Review Texts
  const [comments, setComments] = useState<string>('');
  const [strengths, setStrengths] = useState<string>('');
  const [areasOfImprovement, setAreasOfImprovement] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Computed Overall Score
  const overallScore = useMemo(() => {
    const avg = (contentDepth + organization + speakerQuality + venueFacilities + valueForTime) / 5;
    return Math.round(avg * 10) / 10;
  }, [contentDepth, organization, speakerQuality, venueFacilities, valueForTime]);

  // Live Sentiment Preview
  const sentimentPreview = useMemo(() => {
    const combined = `${comments} ${strengths} ${areasOfImprovement}`.toLowerCase();
    const positiveWords = ['great', 'excellent', 'amazing', 'superb', 'informative', 'wonderful', 'loved', 'helpful', 'inspiring', 'well'];
    const negativeWords = ['poor', 'terrible', 'disappointing', 'boring', 'mess', 'delay', 'issue', 'bad', 'waste'];
    
    let posCount = 0;
    let negCount = 0;
    positiveWords.forEach(w => { if (combined.includes(w)) posCount++; });
    negativeWords.forEach(w => { if (combined.includes(w)) negCount++; });

    if (overallScore >= 4.0 || posCount > negCount) {
      return { 
        label: 'POSITIVE', 
        color: '#34d399', 
        bg: 'rgba(16, 185, 129, 0.15)', 
        border: 'rgba(16, 185, 129, 0.35)' 
      };
    } else if (overallScore <= 2.5 || negCount > posCount) {
      return { 
        label: 'CONSTRUCTIVE', 
        color: 'var(--acid)', 
        bg: 'rgba(245, 158, 11, 0.15)', 
        border: 'rgba(245, 158, 11, 0.35)' 
      };
    }
    return { 
      label: 'NEUTRAL', 
      color: '#38bdf8', 
      bg: 'rgba(56, 189, 248, 0.15)', 
      border: 'rgba(56, 189, 248, 0.35)' 
    };
  }, [comments, strengths, areasOfImprovement, overallScore]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please sign in as a student to submit feedback.');
      return;
    }
    if (!isAttendanceVerified) {
      setError('Attendance Verification Required: Only attendees checked in at the venue gate can submit verified reviews.');
      return;
    }
    if (!comments.trim()) {
      setError('Please provide your key observations / comments on the event.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload: FeedbackSubmissionPayload = {
        eventId,
        userId: currentUser.id,
        contentDepth,
        organization,
        speakerQuality,
        venueFacilities,
        valueForTime,
        comments: comments.trim(),
        strengths: strengths.trim(),
        areasOfImprovement: areasOfImprovement.trim(),
      };

      const result = await submitFeedback(payload);
      setSuccess(true);
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(result);
      }
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Failed to submit verified feedback.');
    } finally {
      setLoading(false);
    }
  };

  const renderRatingBar = (
    label: string, 
    value: number, 
    onChange: (val: number) => void,
    icon: React.ReactNode,
    desc: string
  ) => {
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '12px 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#818cf8' }}>{icon}</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>{label}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => onChange(star)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  color: star <= value ? 'var(--acid)' : '#475569',
                  transition: 'transform 0.15s ease',
                }}
                title={`${star} Star`}
              >
                <Star size={16} fill={star <= value ? 'var(--acid)' : 'none'} />
              </button>
            ))}
            <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--acid)', marginLeft: '6px' }}>
              {value}.0
            </span>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>{desc}</p>
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 2000,
      overflowY: 'auto',
    }}>
      <div className="glass-panel" style={{
        position: 'relative',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '92vh',
        overflowY: 'auto',
        background: 'linear-gradient(180deg, #0d1527 0%, #060a14 100%)',
        border: '1px solid rgba(99, 102, 241, 0.35)',
        borderRadius: '24px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.15)',
      }}>
        {/* Header Ribbon */}
        <div style={{
          background: 'linear-gradient(90deg, rgba(30, 27, 75, 0.8) 0%, rgba(88, 28, 135, 0.6) 50%, rgba(131, 24, 67, 0.4) 100%)',
          padding: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}>
                <ShieldCheck size={14} />
                Attendance-Gated Review
              </span>
              {clubName && (
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>· {clubName}</span>
              )}
            </div>
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
              {eventTitle}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#cbd5e1' }}>
              Your feedback is cryptographically tethered to your verified gate admission and influences the club's AICTE accreditation score.
            </p>
          </div>
          <button 
            onClick={onClose} 
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '8px',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Verification Check / Gate Status */}
        <div style={{ padding: '16px 24px 0' }}>
          {isAttendanceVerified ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(6, 78, 59, 0.4)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#6ee7b7',
              fontSize: '0.78rem',
              flexWrap: 'wrap',
              gap: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#34d399" />
                <span style={{ fontWeight: 700 }}>Gate Attendance Verified</span>
                {ticketNumber && <span style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>({ticketNumber})</span>}
              </div>
              <span style={{ color: '#34d399', fontWeight: 600 }}>Eligible to review & earn AICTE Activity Points</span>
            </div>
          ) : (
            <div style={{
              padding: '14px 18px',
              borderRadius: '12px',
              background: 'rgba(76, 5, 25, 0.4)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              color: '#fda4af',
              fontSize: '0.78rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#fb7185', fontSize: '0.85rem', marginBottom: '6px' }}>
                <Lock size={16} />
                Attendance Verification Locked
              </div>
              <p style={{ margin: '0 0 6px', color: '#fecdd3', lineHeight: 1.5 }}>
                CampusSphere prevents astroturfing and fake reviews. Only students who were scanned at the venue gate via Dynamic QR Pass can submit feedback.
              </p>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                If you attended this event, please ask the club organizer to confirm your gate admission in the Club Admin console.
              </div>
            </div>
          )}
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 14px',
              fontSize: '0.82rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '12px',
              color: '#fca5a5',
            }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 14px',
              fontSize: '0.82rem',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '12px',
              color: '#6ee7b7',
            }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>Verified feedback recorded! AICTE activity point progress updated.</span>
            </div>
          )}

          {/* 5-Vector Ratings Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <SlidersHorizontal size={14} color="#818cf8" />
                5-Vector Review Metrics
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Overall Score:</span>
                <span style={{
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  color: 'var(--acid)',
                  fontFamily: 'var(--font-mono)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                }}>
                  ★ {overallScore.toFixed(1)} / 5.0
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {renderRatingBar(
                'Content Depth & Quality',
                contentDepth,
                setContentDepth,
                <BookOpen size={16} />,
                'Technical rigor, hands-on syllabus, and problem sets.'
              )}
              {renderRatingBar(
                'Event Organization & Flow',
                organization,
                setOrganization,
                <Clock size={16} />,
                'Punctuality, schedule adherence, and coordinator support.'
              )}
              {renderRatingBar(
                'Speaker / Mentor Quality',
                speakerQuality,
                setSpeakerQuality,
                <UserCheck size={16} />,
                'Clarity of instruction, mentorship, and Q&A depth.'
              )}
              {renderRatingBar(
                'Venue & Lab Facilities',
                venueFacilities,
                setVenueFacilities,
                <Building2 size={16} />,
                'Wi-Fi bandwidth, AV systems, lab seating, and power.'
              )}
            </div>

            {renderRatingBar(
              'Value for Time & Learning Impact',
              valueForTime,
              setValueForTime,
              <Sparkles size={16} />,
              'Practical career/skill takeaway versus hours invested.'
            )}
          </div>

          {/* Written Reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '6px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1' }}>
                  Key Takeaways & Detailed Review <span style={{ color: '#f43f5e' }}>*</span>
                </label>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  color: sentimentPreview.color,
                  background: sentimentPreview.bg,
                  border: `1px solid ${sentimentPreview.border}`,
                }}>
                  Sentiment: {sentimentPreview.label}
                </span>
              </div>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share your detailed experience, what concepts you built, and your assessment of the workshops..."
                rows={3}
                disabled={!isAttendanceVerified || loading || success}
                className="glass-input"
                style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700, color: '#34d399', marginBottom: '6px' }}>
                  <ThumbsUp size={14} />
                  Key Strengths
                </label>
                <input
                  type="text"
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  placeholder="e.g. Excellent mentorship, fast Wi-Fi, hands-on tasks"
                  disabled={!isAttendanceVerified || loading || success}
                  className="glass-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--acid)', marginBottom: '6px' }}>
                  <Sparkles size={14} />
                  Areas of Improvement
                </label>
                <input
                  type="text"
                  value={areasOfImprovement}
                  onChange={(e) => setAreasOfImprovement(e.target.value)}
                  placeholder="e.g. Provide extra power strips, add 15m break"
                  disabled={!isAttendanceVerified || loading || success}
                  className="glass-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="#818cf8" />
              <span>Permanent record tethered to student ID</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                style={{ padding: '9px 18px', fontSize: '0.82rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isAttendanceVerified || loading || success}
                className="btn-primary"
                style={{
                  padding: '9px 22px',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {loading ? (
                  <span>Recording...</span>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Submit Verified Review</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
