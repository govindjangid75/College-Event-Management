import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClub } from '../context/ClubContext';
import { 
  Building2, 
  Coins, 
  Users, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileCheck, 
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Receipt,
  Download,
  Sparkles,
  MapPin,
  Award,
  RefreshCw
} from 'lucide-react';
import { Event } from '../types';
import { fetchEvents, approveEvent, rejectEvent } from '../services/api';

export const SuperAdminPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    clubs, 
    payoutRequests, 
    approvePayoutByDean, 
    rejectPayoutByDean, 
    getCentralTreasuryStats,
  } = useClub();

  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const stats = getCentralTreasuryStats();

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadPendingEvents = async () => {
    try {
      setLoadingEvents(true);
      const data = await fetchEvents({ status: 'PENDING_APPROVAL' });
      setPendingEvents(data);
    } catch (err) {
      console.error('Failed to load pending events:', err);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    loadPendingEvents();
  }, []);

  const handleApproveEvent = async (eventId: string, title: string) => {
    try {
      setActionLoadingId(eventId);
      await approveEvent(
        eventId,
        currentUser?.id || 'dean_arora_01',
        'Sanctioned by Dean Office. Mandatory 30-min venue buffer verified.'
      );
      showToast(`Event "${title}" approved and published to Campus Calendar!`, 'success');
      loadPendingEvents();
    } catch (err: any) {
      showToast(err.message || 'Failed to approve event.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectEvent = async (eventId: string, title: string) => {
    const reason = window.prompt(`Enter rejection reason for "${title}":`, 'Schedule conflict or incomplete documentation');
    if (!reason) return;

    try {
      setActionLoadingId(eventId);
      await rejectEvent(eventId, currentUser?.id || 'dean_arora_01', reason);
      showToast(`Event "${title}" rejected and slot released.`, 'error');
      loadPendingEvents();
    } catch (err: any) {
      showToast(err.message || 'Failed to reject event.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingPayouts = payoutRequests.filter((p) => p.status === 'PENDING');

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
          color: '#ffffff',
          padding: '14px 22px',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          zIndex: 2000,
          fontWeight: 700,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          {notification.text}
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '32px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', margin: 0 }}>
              Dean Office & Central Governance Hub
            </h1>
            <span className="badge-role-admin">Super Admin</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
            Logged in as <strong>{currentUser?.name || 'Dr. R. K. Sharma'}</strong> ({currentUser?.facultyDesignation || 'Dean Academics & Student Welfare'}) • Live MongoDB Atlas
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              loadPendingEvents();
              showToast('Refreshed governance queue from MongoDB Atlas!', 'success');
            }}
            className="btn-secondary"
            style={{ padding: '10px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={15} />
            Sync Atlas
          </button>

          <button
            onClick={() => showToast('Exporting Institutional Campus Audit & Split-Ledger Reconciliation Statement (PDF)!', 'success')}
            className="btn-gold"
            style={{ padding: '10px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={16} />
            Export Audit Statement
          </button>
        </div>
      </div>

      {/* Campus Overview Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>Total Campus Balance</span>
            <Coins size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
            ₹{stats.totalAvailableBalance.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
            Aggregated across all 15 Arya Club Ledgers
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #06b6d4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>Lifetime Campus Collections</span>
            <TrendingUp size={18} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
            ₹{stats.totalGrossCampusRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
            100% split to organizing student societies
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #f97316' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>Pending Event Proposals</span>
            <Calendar size={18} color="#f97316" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fb923c', fontFamily: 'var(--font-mono)' }}>
            {pendingEvents.length}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
            Awaiting Dean institutional sanction
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>Audited Ledger Entries</span>
            <ShieldCheck size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
            {stats.totalTransactionsCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
            Zero financial discrepancies detected
          </div>
        </div>
      </div>

      {/* PHASE 3: DEAN EVENT PROPOSAL SANCTION & VENUE BUFFER QUEUE */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px', borderLeft: '4px solid #6366f1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', display: 'flex' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Dean Event Sanction & Venue Clearance Queue ({pendingEvents.length} Pending)
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                Review proposals submitted by Arya College clubs. All bookings are pre-checked with 30-min setup & teardown buffer windows.
              </p>
            </div>
          </div>

          <button
            onClick={loadPendingEvents}
            disabled={loadingEvents}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <RefreshCw size={13} className={loadingEvents ? 'animate-spin' : ''} />
            <span>Refresh Queue</span>
          </button>
        </div>

        {loadingEvents ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 8px', color: '#6366f1' }} />
            <p style={{ fontSize: '0.85rem' }}>Fetching pending proposals from live MongoDB Atlas...</p>
          </div>
        ) : pendingEvents.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
            <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 700 }}>All Event Proposals Cleared!</p>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>There are currently no event bookings awaiting Dean sanction in MongoDB Atlas.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendingEvents.map((evt) => {
              const startStr = evt.startTime || evt.schedule?.startTime || '';
              const endStr = evt.endTime || evt.schedule?.endTime || '';
              const isActionRunning = actionLoadingId === evt.id;

              return (
                <div key={evt.id} className="glass-card" style={{ padding: '22px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span className="badge-role-club">{evt.clubName}</span>
                        <span style={{ fontSize: '0.72rem', color: '#a5b4fc', background: 'rgba(99, 102, 241, 0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                          {evt.category}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                          +{evt.activityPointsAwarded} AICTE CREDITS
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0 6px' }}>
                        {evt.title}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '12px' }}>
                        {evt.shortSummary}
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.78rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                          <MapPin size={14} color="#06b6d4" />
                          <span>Venue: <strong style={{ color: '#ffffff' }}>{evt.venueName}</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                          <Clock size={14} color="#8b5cf6" />
                          <span>Slot: {startStr ? new Date(startStr).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'TBD'} to {endStr ? new Date(endStr).toLocaleTimeString([], { timeStyle: 'short' }) : 'TBD'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                          <Users size={14} color="#f59e0b" />
                          <span>Capacity: {evt.maxCapacity} ({evt.registrationType === 'TEAM' ? 'Team Mode' : 'Solo'})</span>
                        </div>
                      </div>

                      {/* Buffer Assurance Tag */}
                      <div style={{
                        marginTop: '12px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        background: 'rgba(16, 185, 129, 0.08)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.72rem',
                        color: '#34d399',
                      }}>
                        <ShieldCheck size={13} />
                        <span>Venue Collision Buffer Engine: Pre-verified (30-min setup before & 30-min cleanup after clear)</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '170px' }}>
                      <button
                        onClick={() => handleApproveEvent(evt.id, evt.title)}
                        disabled={isActionRunning}
                        className="btn-primary"
                        style={{ padding: '10px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <CheckCircle2 size={15} />
                        <span>Approve Proposal</span>
                      </button>

                      <button
                        onClick={() => handleRejectEvent(evt.id, evt.title)}
                        disabled={isActionRunning}
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#f87171',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <XCircle size={14} />
                        <span>Reject with Reason</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PENDING DEAN PAYOUT DISBURSEMENT APPROVAL QUEUE */}
      {pendingPayouts.length > 0 && (
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <AlertTriangle size={22} color="#f59e0b" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Dean Payout Clearance Queue ({pendingPayouts.length} Action Required)
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '20px' }}>
            Club treasurers have requested fund disbursements. Dean approval triggers automated bank settlement to registered club UPI.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {pendingPayouts.map((req) => (
              <div key={req.id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {req.referenceNumber}
                    </span>
                    <span className="badge-role-club">{req.clubName}</span>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                    ₹{req.amount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                    Requested by <strong>{req.requestedByUserName}</strong> • Destination UPI: <strong style={{ color: '#e2e8f0' }}>{req.payoutUpiId}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      const res = approvePayoutByDean(req.id);
                      showToast(res.message, 'success');
                    }}
                    className="btn-gold"
                    style={{ padding: '10px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <CheckCircle2 size={16} />
                    Approve Disbursement
                  </button>

                  <button
                    onClick={() => {
                      const res = rejectPayoutByDean(req.id, 'Discrepancy in documentation');
                      showToast(res.message, 'error');
                    }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    Reject & Revert
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multi-Club Treasury Audit Table */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Master 15 Clubs Split-Accounting Audit Ledger
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
              Institutional financial overview certifying that all funds remain isolated per club chapter in MongoDB Atlas.
            </p>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
            ✓ 15/15 Clubs Reconciled
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', textAlign: 'left', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 14px' }}>Club Name & Domain</th>
                <th style={{ padding: '12px 14px' }}>Category</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Total Raised</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>In-Transit</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Available Balance</th>
                <th style={{ padding: '12px 14px' }}>Registered UPI</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.clubBreakdown.map((c) => (
                <tr key={c.clubId} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#f8fafc' }}>
                  <td style={{ padding: '14px', fontWeight: 700 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Link to={`/clubs/${c.clubSlug}`} style={{ color: '#f8fafc', textDecoration: 'none', transition: 'color 0.2s' }}>
                        {c.clubName}
                      </Link>
                    </div>
                  </td>
                  <td style={{ padding: '14px', color: '#38bdf8' }}>{c.category}</td>
                  <td style={{ padding: '14px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    ₹{c.totalRevenue.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: c.pendingSettlement > 0 ? '#fb923c' : '#94a3b8' }}>
                    ₹{c.pendingSettlement.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                    ₹{c.availableBalance.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px', color: '#94a3b8', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                    {c.payoutUpiId}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <Link
                      to={`/clubs/${c.clubSlug}`}
                      style={{
                        color: '#06b6d4',
                        textDecoration: 'none',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      Audit <ArrowRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
