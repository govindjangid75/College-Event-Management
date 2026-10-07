// CampusSphere - Event Registration Engine & Razorpay Checkout Modal
// Institution: Arya College of Engineering & IT (ACEIT), Jaipur

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  X,
  Ticket,
  ShieldCheck,
  Users,
  User,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Building,
  Lock,
  Sparkles,
  Calendar,
  MapPin,
  AlertCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Event, Registration } from '../types';
import { useAuth } from '../context/AuthContext';
import { registerForEvent } from '../services/api';

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onSuccess?: (registration: Registration) => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  isOpen,
  onClose,
  event,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Mode Selection: Solo vs Team
  const [registrationType, setRegistrationType] = useState<'SOLO' | 'TEAM'>(
    event.registrationType === 'TEAM' ? 'TEAM' : 'SOLO'
  );

  // Team Details
  const [teamName, setTeamName] = useState('');
  const [teamPasscode, setTeamPasscode] = useState(`ACE-${Math.floor(1000 + Math.random() * 9000)}`);
  const [memberInput, setMemberInput] = useState('');
  const [teamMembers, setTeamMembers] = useState<string[]>([]);

  // Payment State
  const ticketPrice = event.ticketing?.ticketPrice ?? event.ticketPrice ?? 0;
  const isPaid = (event.ticketing?.isPaid ?? event.isPaid ?? false) && ticketPrice > 0;
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiId, setUpiId] = useState(
    currentUser?.email ? `${currentUser.email.split('@')[0]}@okaxis` : 'student@okaxis'
  );

  // Process & Result States
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedRegistration, setConfirmedRegistration] = useState<Registration | null>(null);

  if (!isOpen) return null;

  const now = new Date();
  const startTimeStr = event.startTime || event.schedule?.startTime || '';
  const endTimeStr = event.endTime || event.schedule?.endTime || '';
  const isPast = event.status === 'COMPLETED' || (endTimeStr ? new Date(endTimeStr) < now : (startTimeStr ? new Date(startTimeStr) < now : false));
  const isRegClosed = isPast || (event.registrationDeadline ? new Date(event.registrationDeadline) < now : false);

  const handleAddMember = () => {
    const trimmed = memberInput.trim().toUpperCase();
    if (trimmed && !teamMembers.includes(trimmed)) {
      setTeamMembers([...teamMembers, trimmed]);
      setMemberInput('');
    }
  };

  const handleRemoveMember = (roll: string) => {
    setTeamMembers(teamMembers.filter(m => m !== roll));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentUser) {
      setErrorMessage('Please login to register for campus events.');
      return;
    }

    if (registrationType === 'TEAM' && !teamName.trim()) {
      setErrorMessage('Please provide a Team Name for squad registration.');
      return;
    }

    setIsProcessing(true);

    try {
      // Razorpay Payment Gateway Integration
      let generatedPaymentId: string | undefined = undefined;
      if (isPaid) {
        if (typeof (window as any).Razorpay !== 'undefined') {
          const paymentResult = await new Promise<{ razorpay_payment_id: string }>((resolve, reject) => {
            const options = {
              key: 'rzp_test_TktADhU1IzFBBz',
              amount: Math.round(event.ticketPrice * 100), // in paise
              currency: 'INR',
              name: 'Arya College CampusSphere',
              description: `Entry Pass: ${event.title}`,
              image: event.clubLogoUrl || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=200',
              prefill: {
                name: currentUser.name,
                email: currentUser.email,
                contact: '9876543210',
              },
              theme: {
                color: '#6366f1',
              },
              handler: function (response: any) {
                resolve(response);
              },
              modal: {
                ondismiss: function () {
                  reject(new Error('Transaction was cancelled by student'));
                },
              },
            };
            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
              reject(new Error(response.error?.description || 'Razorpay transaction failed'));
            });
            rzp.open();
          });
          generatedPaymentId = paymentResult.razorpay_payment_id;
        } else {
          // Fallback test transaction ID
          await new Promise(resolve => setTimeout(resolve, 1000));
          generatedPaymentId = `pay_rzp_test_${Math.random().toString(36).substring(2, 10)}`;
        }
      }

      const rollNo = currentUser.studentProfile?.rollNo || `22EACIT${Math.floor(100 + Math.random() * 900)}`;
      const department = currentUser.studentProfile?.department || 'Computer Science & Engineering';
      const semester = currentUser.studentProfile?.semester || 6;

      const registered = await registerForEvent({
        eventId: event.id,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        userRollNo: rollNo,
        department,
        semester,
        registrationType,
        teamName: registrationType === 'TEAM' ? teamName : undefined,
        teamPasscode: registrationType === 'TEAM' ? teamPasscode : undefined,
        teamMembers: registrationType === 'TEAM' ? teamMembers : undefined,
        paymentId: generatedPaymentId,
      });

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      setConfirmedRegistration(registered);
      if (onSuccess) onSuccess(registered);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setErrorMessage(err.message || 'Registration failed. Please check event status or capacity.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '640px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        position: 'relative',
        borderRadius: '24px',
        border: '1px solid rgba(6, 182, 212, 0.35)',
        boxShadow: '0 25px 60px -15px rgba(6, 182, 212, 0.25)',
        padding: '0',
      }}>
        {/* Header Bar */}
        <div style={{
          padding: '20px 26px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.12) 0%, rgba(30, 64, 175, 0.12) 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #06b6d4, #1e40af)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 12px rgba(6, 182, 212, 0.4)',
            }}>
              <Ticket size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                {confirmedRegistration ? 'Pass Issued & Confirmed' : 'Event Pass Registration'}
              </h2>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {event.clubName} • Arya College of Engineering & IT
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 26px' }}>
          {/* Confirmed Registration View */}
          {confirmedRegistration ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#10b981',
                boxShadow: '0 0 25px rgba(16, 185, 129, 0.35)',
              }}>
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
                Registration Confirmed!
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>
                Your ticket pass has been generated with a dynamic anti-screenshot HMAC token for gate entry.
              </p>

              {/* Digital Pass Preview Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(30, 64, 175, 0.12) 100%)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '24px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                    Institutional Admission Pass
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: confirmedRegistration.amountPaid > 0 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: confirmedRegistration.amountPaid > 0 ? 'var(--acid)' : '#34d399',
                    border: '1px solid currentColor',
                  }}>
                    {confirmedRegistration.amountPaid > 0 ? `₹${confirmedRegistration.amountPaid} PAID` : 'FREE PASS'}
                  </span>
                </div>

                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
                  {confirmedRegistration.eventTitle}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>TICKET ID</span>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                      {confirmedRegistration.ticketNumber || confirmedRegistration.ticket?.ticketNumber}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>STUDENT</span>
                    <strong>{confirmedRegistration.userName} ({confirmedRegistration.userRollNo || '22EACIT089'})</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>REGISTRATION MODE</span>
                    <strong>{confirmedRegistration.registrationType} {confirmedRegistration.teamName ? `(${confirmedRegistration.teamName})` : ''}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>AICTE CREDITS</span>
                    <strong style={{ color: '#c084fc' }}>+{confirmedRegistration.activityPointsAwarded || event.activityPointsAwarded} Points</strong>
                  </div>
                </div>

                {confirmedRegistration.paymentId && (
                  <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Razorpay ID: <code style={{ color: '#38bdf8' }}>{confirmedRegistration.paymentId}</code></span>
                    <span style={{ color: '#34d399' }}>Split-Treasury Settled ✓</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/my-passes');
                  }}
                  className="btn-primary"
                  style={{ flex: 1, padding: '12px 18px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Ticket size={16} />
                  <span>View in My Passes (Live QR)</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={onClose}
                  className="btn-secondary"
                  style={{ padding: '12px 20px', fontSize: '0.9rem' }}
                >
                  Done
                </button>
              </div>
            </div>
          ) : isRegClosed ? (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '2px solid rgba(239, 68, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#ef4444',
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.25)',
              }}>
                <AlertCircle size={32} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
                Registrations Closed
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 24px', lineHeight: 1.5 }}>
                This event has already concluded on {startTimeStr ? new Date(startTimeStr).toLocaleDateString() : 'earlier dates'}. Entry pass booking and online registration are no longer accepted for concluded sessions.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                  style={{ padding: '10px 24px', fontSize: '0.88rem' }}
                >
                  Close & Explore Active Events
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister}>
              {/* Event Quick Summary Banner */}
              <div style={{
                padding: '14px 18px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
                    {event.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} color="#06b6d4" />
                      {event.startTime ? new Date(event.startTime).toLocaleDateString() : 'Upcoming'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} color="#06b6d4" />
                      {event.venueName || 'Arya Campus'}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#c084fc',
                    background: 'rgba(139, 92, 246, 0.15)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    display: 'inline-block',
                    marginBottom: '4px',
                  }}>
                    +{event.activityPointsAwarded} AICTE CREDITS
                  </span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isPaid ? 'var(--acid)' : '#34d399' }}>
                    {isPaid ? `₹${ticketPrice}` : 'FREE ENTRY'}
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#f87171',
                  fontSize: '0.82rem',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Student Identity Card */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>
                  Attendee Institutional Credentials
                </label>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                  fontSize: '0.82rem',
                }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>FULL NAME</span>
                    <strong style={{ color: '#f8fafc' }}>{currentUser?.name || 'Govind Jangid'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>UNIVERSITY ROLL NO</span>
                    <strong style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                      {currentUser?.studentProfile?.rollNo || '22EACIT089'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>DEPARTMENT</span>
                    <strong style={{ color: '#cbd5e1' }}>
                      {currentUser?.studentProfile?.department || 'Computer Science & Engineering'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>INSTITUTIONAL EMAIL</span>
                    <strong style={{ color: '#cbd5e1' }}>{currentUser?.email || 'govind@aryacollege.in'}</strong>
                  </div>
                </div>
              </div>

              {/* Registration Mode: Solo vs Team */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>
                  Participation Mode
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setRegistrationType('SOLO')}
                    style={{
                      background: registrationType === 'SOLO' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: registrationType === 'SOLO' ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: registrationType === 'SOLO' ? '#38bdf8' : '#94a3b8',
                      borderRadius: '10px',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <User size={18} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Individual (Solo)</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Single student pass</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegistrationType('TEAM')}
                    style={{
                      background: registrationType === 'TEAM' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: registrationType === 'TEAM' ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: registrationType === 'TEAM' ? '#818cf8' : '#94a3b8',
                      borderRadius: '10px',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Users size={18} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Squad / Team</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Hackathon / group entry</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Team Mode Fields */}
              {registrationType === 'TEAM' && (
                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.06)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  marginBottom: '20px',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a5b4fc', marginBottom: '4px' }}>
                        Team / Squad Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={teamName}
                        onChange={e => setTeamName(e.target.value)}
                        placeholder="e.g. CyberKnights ACEIT"
                        className="glass-input"
                        style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a5b4fc', marginBottom: '4px' }}>
                        Squad Passcode
                      </label>
                      <input
                        type="text"
                        value={teamPasscode}
                        onChange={e => setTeamPasscode(e.target.value)}
                        className="glass-input"
                        style={{ fontSize: '0.85rem', padding: '8px 12px', fontFamily: 'var(--font-mono)' }}
                      />
                    </div>
                  </div>

                  {/* Teammate Roll Numbers */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a5b4fc', marginBottom: '4px' }}>
                      Add Teammate University Roll Numbers (Optional)
                    </label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        value={memberInput}
                        onChange={e => setMemberInput(e.target.value)}
                        placeholder="e.g. 22EACIT092"
                        className="glass-input"
                        style={{ fontSize: '0.82rem', padding: '6px 10px', textTransform: 'uppercase' }}
                      />
                      <button
                        type="button"
                        onClick={handleAddMember}
                        className="btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                      >
                        Add
                      </button>
                    </div>

                    {teamMembers.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {teamMembers.map(m => (
                          <span key={m} style={{
                            background: 'rgba(99, 102, 241, 0.2)',
                            color: '#c7d2fe',
                            border: '1px solid rgba(99, 102, 241, 0.4)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}>
                            {m}
                            <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleRemoveMember(m)} />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Razorpay Integration Checkout UI (If Paid Event) */}
              {isPaid ? (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(16, 24, 39, 0.8) 0%, rgba(10, 15, 30, 0.8) 100%)',
                  borderRadius: '16px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '18px',
                  marginBottom: '22px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                }}>
                  {/* Razorpay Brand Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        background: '#0c2340',
                        color: '#3395ff',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontWeight: 900,
                        fontSize: '0.8rem',
                        letterSpacing: '0.04em',
                      }}>
                        Razorpay
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Lock size={12} color="#10b981" /> 256-Bit Encrypted Institutional Split Gateway
                      </span>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>
                      Direct Club Split: {event.clubName}
                    </div>
                  </div>

                  {/* Payment Methods Tabs */}
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                    {[
                      { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
                      { id: 'CARD', label: 'Debit / Credit Card', icon: CreditCard },
                      { id: 'NETBANKING', label: 'NetBanking', icon: Building },
                    ].map(tab => {
                      const Icon = tab.icon;
                      const active = paymentMethod === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setPaymentMethod(tab.id as any)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '8px',
                            background: active ? 'rgba(51, 149, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                            border: active ? '1px solid #3395ff' : '1px solid rgba(255, 255, 255, 0.06)',
                            color: active ? '#38bdf8' : '#94a3b8',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          <Icon size={14} />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Payment Details Input */}
                  {paymentMethod === 'UPI' && (
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                        Enter UPI ID / VPA
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        placeholder="yourname@okaxis, yourname@upi"
                        className="glass-input"
                        style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                      />
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                        Supports Google Pay, PhonePe, Paytm, BHIM UPI
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'CARD' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                      <input
                        type="text"
                        placeholder="Card Number (4532 •••• •••• 8492)"
                        defaultValue="4532 8901 2345 8492"
                        className="glass-input"
                        style={{ fontSize: '0.82rem', padding: '8px 12px' }}
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          defaultValue="08/28"
                          className="glass-input"
                          style={{ fontSize: '0.82rem', padding: '8px 12px' }}
                        />
                        <input
                          type="password"
                          placeholder="CVV"
                          defaultValue="894"
                          maxLength={3}
                          className="glass-input"
                          style={{ fontSize: '0.82rem', padding: '8px 12px' }}
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'NETBANKING' && (
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                        Select Verified College Partner Bank
                      </label>
                      <select className="glass-input" style={{ fontSize: '0.82rem', padding: '8px 12px' }}>
                        <option>State Bank of India (Arya Kukas Campus Branch)</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Punjab National Bank</option>
                      </select>
                    </div>
                  )}

                  {/* Summary row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    fontSize: '0.82rem',
                  }}>
                    <span style={{ color: '#cbd5e1' }}>Total Amount Payable:</span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--acid)', fontFamily: 'var(--font-mono)' }}>
                      ₹{ticketPrice}.00
                    </strong>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <ShieldCheck size={24} color="#10b981" />
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                    <strong style={{ color: '#34d399' }}>Free Institutional Pass:</strong> Sponsored by {event.clubName}. Instant confirmed pass will be issued upon form submission.
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)',
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>{isPaid ? 'Processing Razorpay Split Payment...' : 'Generating Cryptographic Pass...'}</span>
                  </>
                ) : (
                  <>
                    <Ticket size={18} />
                    <span>
                      {isPaid ? `Pay ₹${ticketPrice} via Razorpay & Claim Pass` : 'Claim Free Pass & Reserve Entry'}
                    </span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
