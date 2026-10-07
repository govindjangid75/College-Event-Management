import React, { useState } from 'react';
import { X, Lightbulb, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { submitSuggestion, SuggestionSubmissionPayload } from '../services/api';
import { StudentSuggestion } from '../types';

interface StudentSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubId: string;
  clubName: string;
  eventId?: string;
  eventTitle?: string;
  onSuggestionSubmitted?: (suggestion: StudentSuggestion) => void;
}

export const StudentSuggestionModal: React.FC<StudentSuggestionModalProps> = ({
  isOpen,
  onClose,
  clubId,
  clubName,
  eventId = 'general',
  eventTitle,
  onSuggestionSubmitted,
}) => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please sign in to submit a suggestion.');
      return;
    }
    if (!title.trim() || !description.trim()) {
      setError('Please provide both a title and details for your recommendation.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload: SuggestionSubmissionPayload = {
        clubId,
        eventId,
        userId: currentUser.id,
        title: title.trim(),
        description: description.trim(),
      };

      const result = await submitSuggestion(payload);
      setSuccess(true);
      if (onSuggestionSubmitted) {
        onSuggestionSubmitted(result);
      }
      setTimeout(() => {
        onClose();
      }, 1600);
    } catch (err: any) {
      setError(err.message || 'Failed to submit suggestion.');
    } finally {
      setLoading(false);
    }
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
    }}>
      <div className="glass-panel" style={{
        position: 'relative',
        width: '100%',
        maxWidth: '560px',
        background: 'linear-gradient(180deg, #0d1527 0%, #060a14 100%)',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        borderRadius: '20px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(245, 158, 11, 0.1)',
        overflow: 'hidden',
      }}>
        {/* Header Ribbon */}
        <div style={{
          background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Lightbulb size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                You Said, We Did — Propose Improvement
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                Direct feedback loop to <strong>{clubName}</strong> organizers
              </p>
            </div>
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

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
              <span>Suggestion submitted! Live on the public "You Said, We Did" Kanban board.</span>
            </div>
          )}

          {eventTitle && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.78rem',
              color: '#cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ color: '#94a3b8' }}>Related Event:</span>
              <span style={{ fontWeight: 700, color: '#38bdf8' }}>{eventTitle}</span>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1', marginBottom: '6px' }}>
              Suggestion Title <span style={{ color: '#f43f5e' }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Provide 2 dedicated Gigabit switches for ML hackathons"
              className="glass-input"
              style={{ width: '100%', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1', marginBottom: '6px' }}>
              Specific Problem & Actionable Solution <span style={{ color: '#f43f5e' }}>*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the bottleneck encountered and propose the concrete institutional change or equipment needed..."
              rows={4}
              className="glass-input"
              style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
              required
            />
          </div>

          <div style={{
            padding: '12px 14px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.74rem',
            color: '#94a3b8',
            lineHeight: 1.5,
          }}>
            💡 <strong style={{ color: '#f8fafc' }}>Community Impact:</strong> Other verified attendees can upvote this suggestion. When it reaches high priority, club organizers update its status on the public Kanban board with photo proof of implementation.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
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
              disabled={loading || success}
              className="btn-primary"
              style={{
                padding: '9px 20px',
                fontSize: '0.82rem',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {loading ? (
                <span>Posting...</span>
              ) : (
                <>
                  <Send size={14} />
                  <span>Post to You Said, We Did</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
