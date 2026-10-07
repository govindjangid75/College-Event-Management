import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useClub } from '../context/ClubContext';
import { 
  Building2, 
  Coins, 
  Users, 
  Calendar, 
  QrCode, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  PlusCircle, 
  ArrowRight,
  ShieldAlert,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Search,
  Download,
  Edit3,
  Sliders,
  UserPlus,
  Trash2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Receipt,
  FileText,
  Send,
  X,
  MapPin,
  RefreshCw,
  MessageSquarePlus,
  Lightbulb,
  ThumbsUp,
  Star,
  CheckSquare,
  ArrowRightCircle
} from 'lucide-react';
import { Event, Registration, StudentSuggestion, VerifiedFeedback, EventFeedbackSummary, SuggestionStatus } from '../types';
import { 
  fetchEvents, 
  verifyGateTicket, 
  fetchEventAttendees, 
  GateVerificationResult,
  fetchClubSuggestions,
  updateKanbanStatus,
  fetchEventFeedbackSummary,
  fetchEventFeedbacks
} from '../services/api';
import { CreateEventModal } from '../components/CreateEventModal';

export const ClubAdminPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    clubs, 
    getClubBySlug, 
    getClubById, 
    getClubLedger, 
    updateClubProfile, 
    requestPayoutSettlement, 
    addClubCoordinator, 
    removeClubCoordinator,
    clubApplications,
    reviewJoinApplication,
    payoutRequests
  } = useClub();

  // Super Admin can switch clubs to audit, Club Admin is strictly locked to their assigned club
  const [selectedClubSlug, setSelectedClubSlug] = useState<string>(
    currentUser?.administeredClubId || 'arya_cipher'
  );

  const [activeTab, setActiveTab] = useState<'TREASURY' | 'EVENTS' | 'SCANNER' | 'FEEDBACK' | 'PROFILE' | 'ROSTER' | 'APPLICATIONS'>('TREASURY');
  const [ledgerFilter, setLedgerFilter] = useState<'ALL' | 'TICKET_SALE' | 'PAYOUT_DISBURSEMENT' | 'REFUND'>('ALL');
  const [ledgerSearch, setLedgerSearch] = useState('');

  // Live Gate Scanner & Attendee State (Phase 4)
  const [selectedEventForScan, setSelectedEventForScan] = useState<string>('');
  const [scanTicketInput, setScanTicketInput] = useState<string>('CS-2026-HACK-8492');
  const [isVerifyingTicket, setIsVerifyingTicket] = useState<boolean>(false);
  const [lastScanResult, setLastScanResult] = useState<GateVerificationResult | null>(null);
  const [attendeesList, setAttendeesList] = useState<Registration[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState<boolean>(false);

  // Phase 5 Feedback & "You Said, We Did" Kanban State
  const [clubSuggestions, setClubSuggestions] = useState<StudentSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);
  const [selectedEventForFeedback, setSelectedEventForFeedback] = useState<string>('');
  const [feedbackSummary, setFeedbackSummary] = useState<EventFeedbackSummary | null>(null);
  const [eventReviews, setEventReviews] = useState<VerifiedFeedback[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState<boolean>(false);

  // Status Change Modal / Drawer
  const [selectedSuggestionForEdit, setSelectedSuggestionForEdit] = useState<StudentSuggestion | null>(null);
  const [newKanbanStatus, setNewKanbanStatus] = useState<SuggestionStatus>('UNDER_REVIEW');
  const [responseText, setResponseText] = useState<string>('');
  const [proofUrl, setProofUrl] = useState<string>('');
  const [updatingKanban, setUpdatingKanban] = useState<boolean>(false);

  // Event Engine State (Phase 3)
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [clubEvents, setClubEvents] = useState<Event[]>([]);
  const [loadingClubEvents, setLoadingClubEvents] = useState(false);

  // Payout Modal State
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(5000);
  const [payoutNote, setPayoutNote] = useState('');
  const [payoutReceipt, setPayoutReceipt] = useState<any>(null);

  // Edit UPI State
  const [isEditingUpi, setIsEditingUpi] = useState(false);
  const [upiInput, setUpiInput] = useState('');

  // Add Coordinator Modal State
  const [showAddCoordModal, setShowAddCoordModal] = useState(false);
  const [newCoordName, setNewCoordName] = useState('');
  const [newCoordRole, setNewCoordRole] = useState('Technical Coordinator');
  const [newCoordEmail, setNewCoordEmail] = useState('');
  const [newCoordDept, setNewCoordDept] = useState('Computer Science & Engineering');

  // Club Profile Editor Form
  const activeClub = getClubBySlug(selectedClubSlug) || clubs[1];

  const [profileForm, setProfileForm] = useState({
    tagline: activeClub?.tagline || '',
    description: activeClub?.description || '',
    facultyCoordinator: activeClub?.facultyCoordinator || '',
    payoutUpiId: activeClub?.treasury.payoutUpiId || '',
    meetingSchedule: activeClub?.meetingSchedule || 'Every Wednesday at 4:30 PM (CS Lab 2)',
    recruitmentStatus: (activeClub?.recruitmentStatus || 'OPEN') as 'OPEN' | 'CLOSED',
  });

  const [notificationMsg, setNotificationMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotificationMsg({ text, type });
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const loadClubEvents = async () => {
    if (!activeClub) return;
    try {
      setLoadingClubEvents(true);
      const data = await fetchEvents({ clubId: activeClub.id });
      setClubEvents(data);
      if (data.length > 0) {
        if (!selectedEventForScan) setSelectedEventForScan(data[0].id);
        if (!selectedEventForFeedback) setSelectedEventForFeedback(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load club events:', err);
    } finally {
      setLoadingClubEvents(false);
    }
  };

  const loadAttendees = async (eventId: string) => {
    if (!eventId) return;
    try {
      setLoadingAttendees(true);
      const data = await fetchEventAttendees(eventId);
      setAttendeesList(data);
    } catch (err) {
      console.error('Failed to load attendees:', err);
    } finally {
      setLoadingAttendees(false);
    }
  };

  React.useEffect(() => {
    loadClubEvents();
  }, [activeClub?.id]);

  React.useEffect(() => {
    if (selectedEventForScan) {
      loadAttendees(selectedEventForScan);
    }
  }, [selectedEventForScan]);

  // Phase 5 Loaders
  const loadSuggestions = async () => {
    if (!activeClub?.id) return;
    try {
      setLoadingSuggestions(true);
      const data = await fetchClubSuggestions(activeClub.id);
      setClubSuggestions(data);
    } catch (err) {
      console.error('Failed to load club suggestions:', err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const loadFeedbackForEvent = async (eventId: string) => {
    if (!eventId) return;
    try {
      setLoadingFeedback(true);
      const [sum, revs] = await Promise.all([
        fetchEventFeedbackSummary(eventId).catch(() => null),
        fetchEventFeedbacks(eventId).catch(() => []),
      ]);
      setFeedbackSummary(sum);
      setEventReviews(revs);
    } catch (err) {
      console.error('Failed to load event feedback:', err);
    } finally {
      setLoadingFeedback(false);
    }
  };

  React.useEffect(() => {
    loadSuggestions();
  }, [activeClub?.id]);

  React.useEffect(() => {
    if (clubEvents.length > 0 && !selectedEventForFeedback) {
      setSelectedEventForFeedback(clubEvents[0].id);
    }
  }, [clubEvents]);

  React.useEffect(() => {
    if (selectedEventForFeedback) {
      loadFeedbackForEvent(selectedEventForFeedback);
    }
  }, [selectedEventForFeedback]);

  const handleUpdateKanbanStatus = async () => {
    if (!selectedSuggestionForEdit || !currentUser) return;
    try {
      setUpdatingKanban(true);
      await updateKanbanStatus({
        suggestionId: selectedSuggestionForEdit.id,
        newStatus: newKanbanStatus,
        adminId: currentUser.id,
        adminName: currentUser.name,
        responseText: responseText.trim() || undefined,
        proofImageUrl: proofUrl.trim() || undefined,
      });
      showNotification(`Kanban card moved to ${newKanbanStatus}!`, 'success');
      setSelectedSuggestionForEdit(null);
      setResponseText('');
      setProofUrl('');
      loadSuggestions();
    } catch (err: any) {
      showNotification(err.message || 'Failed to update suggestion status', 'error');
    } finally {
      setUpdatingKanban(false);
    }
  };

  const handleScanGatePass = async (ticketNumToScan?: string) => {
    const tNum = (ticketNumToScan || scanTicketInput).trim();
    if (!tNum) return;
    setIsVerifyingTicket(true);
    setLastScanResult(null);
    try {
      const result = await verifyGateTicket({
        ticketNumber: tNum,
        adminId: currentUser?.id || 'admin_priya_01',
        gateLocation: 'Arya Campus Gate 1',
      });
      setLastScanResult(result);
      if (result.verified) {
        showNotification(`ACCESS GRANTED for ${result.studentName}! Attendance logged.`, 'success');
      } else if (result.alreadyCheckedIn) {
        showNotification(`DUPLICATE SCAN DETECTED: Ticket already checked in!`, 'error');
      } else {
        showNotification(`Verification Failed: ${result.message}`, 'error');
      }
      if (selectedEventForScan) {
        loadAttendees(selectedEventForScan);
      }
    } catch (err: any) {
      setLastScanResult({
        verified: false,
        alreadyCheckedIn: false,
        message: err.message || 'Error communicating with gate server',
      });
    } finally {
      setIsVerifyingTicket(false);
    }
  };

  // Club Isolation Check
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isAuthorizedClubAdmin = currentUser?.role === 'CLUB_ADMIN' && currentUser.administeredClubId === activeClub?.slug;

  if (!isSuperAdmin && !isAuthorizedClubAdmin && currentUser?.role === 'CLUB_ADMIN') {
    return (
      <div style={{ maxWidth: '900px', margin: '60px auto', padding: '32px' }} className="glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#ef4444', marginBottom: '16px' }}>
          <ShieldAlert size={40} />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
            Club Isolation Access Blocked
          </h2>
        </div>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
          You are authenticated as Club Admin for <strong>{currentUser?.administeredClubId}</strong>. Under CampusSphere institutional segregation rules, administrators are strictly prohibited from inspecting or modifying the treasury of other clubs.
        </p>
        <button
          onClick={() => setSelectedClubSlug(currentUser?.administeredClubId || 'arya_cipher')}
          className="btn-gold"
        >
          Return to Your Assigned Club Console
        </button>
      </div>
    );
  }

  const clubLedger = getClubLedger(activeClub.id);

  const filteredLedger = clubLedger.filter(entry => {
    const matchesFilter = ledgerFilter === 'ALL' || entry.type === ledgerFilter;
    const matchesSearch = 
      (entry.remarks || '').toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      (entry.referenceId || '').toLowerCase().includes(ledgerSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filter applications for this club
  const clubApps = clubApplications.filter(a => a.clubId === activeClub.id);

  // Handle Payout Request Submit
  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const res = requestPayoutSettlement(
      activeClub.id,
      Number(payoutAmount),
      activeClub.treasury.payoutUpiId,
      { id: currentUser.id, name: currentUser.name },
      payoutNote
    );

    if (res.success) {
      setPayoutReceipt({
        referenceId: res.receiptId,
        amount: payoutAmount,
        upiId: activeClub.treasury.payoutUpiId,
        date: new Date().toLocaleString('en-IN'),
        clubName: activeClub.name,
        note: payoutNote,
      });
      showNotification(res.message, 'success');
    } else {
      showNotification(res.message, 'error');
    }
  };

  // Handle Profile Update
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = updateClubProfile(activeClub.id, {
      tagline: profileForm.tagline,
      description: profileForm.description,
      facultyCoordinator: profileForm.facultyCoordinator,
      meetingSchedule: profileForm.meetingSchedule,
      recruitmentStatus: profileForm.recruitmentStatus,
      treasury: {
        ...activeClub.treasury,
        payoutUpiId: profileForm.payoutUpiId,
      }
    });

    if (res.success) {
      showNotification('Club profile & settings successfully saved to institutional records!', 'success');
    } else {
      showNotification(res.message, 'error');
    }
  };

  // Handle Add Coordinator
  const handleAddCoordinator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoordName || !newCoordEmail) return;

    const res = addClubCoordinator(activeClub.id, {
      name: newCoordName,
      designation: newCoordRole,
      email: newCoordEmail,
      department: newCoordDept,
      year: 3,
    });

    if (res.success) {
      showNotification(res.message, 'success');
      setShowAddCoordModal(false);
      setNewCoordName('');
      setNewCoordEmail('');
    } else {
      showNotification(res.message, 'error');
    }
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Toast Notification */}
      {notificationMsg && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: notificationMsg.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
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
          {notificationMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          {notificationMsg.text}
        </div>
      )}

      {/* Top Banner / Switcher for Super Admin */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src={activeClub.logoUrl}
            alt={activeClub.name}
            style={{ width: '64px', height: '64px', borderRadius: '18px', objectFit: 'cover', border: '2px solid #f59e0b' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', margin: 0 }}>
                {activeClub.name}
              </h1>
              <span className="badge-role-club">Organizer Console</span>
              {isSuperAdmin && (
                <span style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}>
                  Dean Read-Only Audit Mode
                </span>
              )}
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
              Logged in as <strong>{currentUser?.name}</strong> • Institutional Chapter: <strong>{activeClub.category}</strong>
            </p>
          </div>
        </div>

        {/* Club Switcher for Super Admin / Inspection */}
        {isSuperAdmin && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Inspect Club:</span>
            <select
              value={selectedClubSlug}
              onChange={e => setSelectedClubSlug(e.target.value)}
              className="glass-input"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              {clubs.map(c => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Primary KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Available Balance */}
        <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>Dedicated Available Balance</span>
            <Coins size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
            ₹{activeClub.treasury.availableBalance.toLocaleString()}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: '#10b981' }}>Available for disbursement</span>
            <button
              onClick={() => {
                setPayoutAmount(Math.min(activeClub.treasury.availableBalance, 10000));
                setShowPayoutModal(true);
              }}
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#fbbf24',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Request Payout
            </button>
          </div>
        </div>

        {/* All Time Collection */}
        <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #06b6d4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>Lifetime Gross Collection</span>
            <TrendingUp size={18} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
            ₹{activeClub.treasury.totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
            From ticket sales & sponsorships
          </div>
        </div>

        {/* In-Transit Settlements */}
        <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #f97316' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>In-Transit / Pending Approval</span>
            <Clock size={18} color="#f97316" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#fb923c', fontFamily: 'var(--font-mono)' }}>
            ₹{activeClub.treasury.pendingSettlement.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
            Disbursements pending Dean seal
          </div>
        </div>

        {/* Payout UPI ID */}
        <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>Registered Payout UPI ID</span>
            <Receipt size={18} color="#8b5cf6" />
          </div>
          <div style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#e2e8f0',
            fontFamily: 'var(--font-mono)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            padding: '6px 0',
          }}>
            {activeClub.treasury.payoutUpiId}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#a78bfa', marginTop: '6px' }}>
            Instant bank transfer destination
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '12px',
        overflowX: 'auto',
      }}>
        {[
          { id: 'TREASURY', label: 'Dedicated Split-Ledger', icon: Coins },
          { id: 'EVENTS', label: `Events & 30m Buffer Scheduler (${clubEvents.length})`, icon: Calendar },
          { id: 'SCANNER', label: `Live Gate QR Scanner & Attendees`, icon: QrCode },
          { id: 'FEEDBACK', label: `You Said, We Did & Reviews (${clubSuggestions.length})`, icon: MessageSquarePlus },
          { id: 'APPLICATIONS', label: `Student Applications (${clubApps.length})`, icon: Users },
          { id: 'ROSTER', label: 'Executive Board & Leads', icon: UserPlus },
          { id: 'PROFILE', label: 'Club Settings & Profile', icon: Sliders },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                background: isActive ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                border: isActive ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.06)',
                color: isActive ? '#fbbf24' : '#94a3b8',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: DEDICATED SPLIT-LEDGER */}
      {activeTab === 'TREASURY' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          {/* Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '20px',
          }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Institutional Financial Ledger
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '2px' }}>
                Cryptographically audited credit/debit trail for {activeClub.name}.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={ledgerSearch}
                  onChange={e => setLedgerSearch(e.target.value)}
                  placeholder="Search reference or event..."
                  className="glass-input"
                  style={{ paddingLeft: '32px', fontSize: '0.82rem', width: '220px' }}
                />
              </div>

              {/* Filter */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['ALL', 'TICKET_SALE', 'PAYOUT_DISBURSEMENT', 'REFUND'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setLedgerFilter(f)}
                    style={{
                      background: ledgerFilter === f ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                      border: ledgerFilter === f ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: ledgerFilter === f ? '#fbbf24' : '#94a3b8',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {f.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ledger Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px 14px' }}>Reference ID</th>
                  <th style={{ padding: '12px 14px' }}>Date / Timestamp</th>
                  <th style={{ padding: '12px 14px' }}>Event / Description</th>
                  <th style={{ padding: '12px 14px' }}>Type</th>
                  <th style={{ padding: '12px 14px' }}>Gross</th>
                  <th style={{ padding: '12px 14px' }}>2% Handling</th>
                  <th style={{ padding: '12px 14px' }}>Net Impact</th>
                  <th style={{ padding: '12px 14px' }}>Running Balance</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLedger.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                      No ledger entries found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredLedger.map(entry => {
                    const isCredit = entry.type === 'TICKET_SALE';
                    const isPayout = entry.type === 'PAYOUT_DISBURSEMENT';
                    return (
                      <tr key={entry.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#f8fafc' }}>
                        <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#38bdf8' }}>
                          {entry.referenceId || entry.id}
                        </td>
                        <td style={{ padding: '14px', color: '#94a3b8', fontSize: '0.78rem' }}>
                          {new Date(entry.timestamp).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '14px', maxWidth: '280px' }}>
                          <div style={{ fontWeight: 600 }}>{entry.remarks}</div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: isCredit ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: isCredit ? '#34d399' : '#fbbf24',
                            border: isCredit ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                          }}>
                            {isCredit ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                            {entry.type === 'TICKET_SALE' ? 'TICKET SALE' : entry.type === 'PAYOUT_DISBURSEMENT' ? 'PAYOUT' : 'REFUND'}
                          </span>
                        </td>
                        <td style={{ padding: '14px', fontFamily: 'var(--font-mono)' }}>
                          ₹{(entry.creditAmount || entry.debitAmount).toLocaleString()}
                        </td>
                        <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                          {entry.gatewayFee ? `-₹${entry.gatewayFee}` : '₹0'}
                        </td>
                        <td style={{
                          padding: '14px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          color: isCredit ? '#34d399' : '#f87171',
                        }}>
                          {isCredit ? `+₹${(entry.netAmount || entry.creditAmount).toLocaleString()}` : `-₹${entry.debitAmount.toLocaleString()}`}
                        </td>
                        <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#fbbf24' }}>
                          ₹{entry.runningBalance.toLocaleString()}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span className={`badge-status ${entry.status === 'SETTLED' ? 'badge-status-approved' : 'badge-status-pending'}`}>
                            {entry.status || 'SETTLED'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: EVENTS & VENUE BUFFER SCHEDULER (PHASE 3) */}
      {activeTab === 'EVENTS' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                <Calendar size={16} />
                <span>INSTITUTIONAL SCHEDULER & VENUE BUFFER ENGINE</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                {activeClub.name} Event Calendar (Live MongoDB Atlas)
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '2px' }}>
                Manage bookings for this club. All venues automatically reserve a mandatory 30-min setup buffer before and 30-min cleanup buffer after.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={loadClubEvents}
                disabled={loadingClubEvents}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Clock size={14} className={loadingClubEvents ? 'animate-spin' : ''} />
                <span>Sync Calendar</span>
              </button>

              <button
                onClick={() => setShowCreateEventModal(true)}
                className="btn-primary"
                style={{ fontSize: '0.85rem', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <PlusCircle size={16} />
                <span>Propose Event with 30-min Buffer Pre-Check</span>
              </button>
            </div>
          </div>

          {loadingClubEvents ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              <Clock size={24} className="animate-spin" style={{ margin: '0 auto 8px', color: '#6366f1' }} />
              <p style={{ fontSize: '0.85rem' }}>Loading events from live MongoDB Atlas...</p>
            </div>
          ) : clubEvents.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
              <Calendar size={36} color="#6366f1" style={{ margin: '0 auto 10px', opacity: 0.6 }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>No Events Scheduled Yet</h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '460px', margin: '0 auto 16px' }}>
                This club does not have any active or proposed events in MongoDB Atlas. Propose a new workshop or hackathon to reserve college venues.
              </p>
              <button
                onClick={() => setShowCreateEventModal(true)}
                className="btn-primary"
                style={{ fontSize: '0.82rem', padding: '8px 18px' }}
              >
                + Propose First Event
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {clubEvents.map((evt) => {
                const startStr = evt.startTime || evt.schedule?.startTime || '';
                const endStr = evt.endTime || evt.schedule?.endTime || '';
                const isPaid = evt.isPaid ?? evt.ticketing?.isPaid ?? false;
                const price = evt.ticketPrice ?? evt.ticketing?.ticketPrice ?? 0;

                return (
                  <div key={evt.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '12px',
                        background: evt.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.2)' : evt.status === 'PENDING_APPROVAL' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: evt.status === 'APPROVED' ? '#34d399' : evt.status === 'PENDING_APPROVAL' ? '#fbbf24' : '#f87171',
                        border: `1px solid ${evt.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.4)' : evt.status === 'PENDING_APPROVAL' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                      }}>
                        {evt.status}
                      </span>

                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c084fc' }}>
                        +{evt.activityPointsAwarded} AICTE PTS
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px', lineHeight: 1.3 }}>
                      {evt.title}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '14px', flex: 1 }}>
                      {evt.shortSummary}
                    </p>

                    <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <MapPin size={12} color="#06b6d4" />
                        <span>Venue: <strong style={{ color: '#ffffff' }}>{evt.venueName}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={12} color="#8b5cf6" />
                        <span>{startStr ? new Date(startStr).toLocaleDateString() : 'TBD'} • {startStr ? new Date(startStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                      </div>
                    </div>

                    {/* Buffer Badge */}
                    <div style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.7rem',
                      color: '#a5b4fc',
                    }}>
                      <ShieldCheck size={13} color="#818cf8" />
                      <span>30m Setup & 30m Cleanup Buffer Locked</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: GATE SCANNER & ATTENDEE ROSTER (PHASE 4) */}
      {activeTab === 'SCANNER' && (
        <div>
          {/* Event Selector & Gate Config */}
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#06b6d4', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  <QrCode size={16} />
                  LIVE GATE ACCESS CONTROL & ATTENDANCE ENGINE
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Gate Scanner: {activeClub.name}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
                  Verify rolling dynamic QR passes at venue entrance gates. Prevents pass-sharing and duplicate check-in frauds.
                </p>
              </div>

              {/* Event Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>Select Event:</label>
                <select
                  value={selectedEventForScan}
                  onChange={e => setSelectedEventForScan(e.target.value)}
                  className="glass-input"
                  style={{ padding: '8px 14px', fontSize: '0.85rem', minWidth: '220px' }}
                >
                  {clubEvents.map(evt => (
                    <option key={evt.id} value={evt.id}>
                      {evt.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Real-time Gate Statistics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Registered</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  {attendeesList.length} Students
                </div>
              </div>

              <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                <span style={{ fontSize: '0.72rem', color: '#34d399', textTransform: 'uppercase' }}>Checked In at Gate</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                  {attendeesList.filter(a => a.attendanceVerified).length} Admitted
                </div>
              </div>

              <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.04)', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                <span style={{ fontSize: '0.72rem', color: '#fbbf24', textTransform: 'uppercase' }}>Pending Admission</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
                  {attendeesList.filter(a => !a.attendanceVerified).length} Pending
                </div>
              </div>

              <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.04)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                <span style={{ fontSize: '0.72rem', color: '#a5b4fc', textTransform: 'uppercase' }}>Club Revenue Split</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#818cf8', fontFamily: 'var(--font-mono)' }}>
                  ₹{attendeesList.reduce((sum, a) => sum + (a.amountPaid || 0), 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Scanner & Verification Viewfinder */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '28px' }}>
            {/* Scanner Box */}
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <QrCode size={18} color="#06b6d4" />
                Camera Viewfinder & Ticket Input
              </h4>

              {/* Viewfinder Graphic with Laser Scan line */}
              <div style={{
                width: '240px',
                height: '240px',
                margin: '0 auto 20px',
                borderRadius: '20px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '2px solid rgba(6, 182, 212, 0.5)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.25)',
              }}>
                <div style={{ position: 'absolute', top: '10px', left: '10px', width: '20px', height: '20px', borderTop: '3px solid #06b6d4', borderLeft: '3px solid #06b6d4' }} />
                <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', borderTop: '3px solid #06b6d4', borderRight: '3px solid #06b6d4' }} />
                <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '20px', height: '20px', borderBottom: '3px solid #06b6d4', borderLeft: '3px solid #06b6d4' }} />
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '20px', height: '20px', borderBottom: '3px solid #06b6d4', borderRight: '3px solid #06b6d4' }} />

                <div style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #06b6d4, #ffffff, #06b6d4, transparent)',
                  boxShadow: '0 0 12px #06b6d4',
                  animation: 'scanLaser 2.2s ease-in-out infinite alternate',
                }} />

                <QrCode size={90} color="rgba(6, 182, 212, 0.35)" />
              </div>

              {/* Input & Scan CTA */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  value={scanTicketInput}
                  onChange={e => setScanTicketInput(e.target.value.toUpperCase())}
                  placeholder="Enter Ticket (e.g. CS-2026-HACK-8492)"
                  className="glass-input"
                  style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', textAlign: 'center' }}
                  onKeyDown={e => { if (e.key === 'Enter') handleScanGatePass(); }}
                />
                <button
                  onClick={() => handleScanGatePass()}
                  disabled={isVerifyingTicket}
                  className="btn-primary"
                  style={{ padding: '10px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {isVerifyingTicket ? <RefreshCw size={15} className="animate-spin" /> : <ShieldCheck size={16} />}
                  <span>Verify</span>
                </button>
              </div>

              {/* Quick Demo Test Buttons */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button
                  onClick={() => handleScanGatePass('CS-2026-HACK-8492')}
                  className="btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                >
                  Scan Demo Pass (CS-2026-HACK-8492)
                </button>
                {attendeesList.length > 0 && (
                  <button
                    onClick={() => handleScanGatePass(attendeesList[0].ticketNumber || attendeesList[0].ticket?.ticketNumber)}
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                  >
                    Scan 1st Roster Ticket
                  </button>
                )}
              </div>
            </div>

            {/* Real-time Verification Feedback Result */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
                Gate Admission Decision
              </h4>

              {lastScanResult ? (
                lastScanResult.verified ? (
                  /* ACCESS GRANTED */
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '2px solid #10b981',
                    borderRadius: '16px',
                    padding: '24px',
                    textAlign: 'center',
                    boxShadow: '0 0 35px rgba(16, 185, 129, 0.25)',
                  }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: '#10b981',
                      color: '#0b132b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px',
                    }}>
                      <CheckCircle2 size={32} />
                    </div>

                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34d399', letterSpacing: '0.04em' }}>
                      ACCESS GRANTED ✓
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#a7f3d0', marginTop: '4px' }}>
                      Verified by Gate Security • Attendance Logged
                    </div>

                    <div style={{
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(16, 185, 129, 0.25)',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '10px',
                      textAlign: 'left',
                      fontSize: '0.82rem',
                    }}>
                      <div>
                        <span style={{ color: '#6ee7b7', fontSize: '0.7rem' }}>STUDENT NAME</span>
                        <div style={{ fontWeight: 800, color: '#ffffff' }}>{lastScanResult.studentName}</div>
                      </div>
                      <div>
                        <span style={{ color: '#6ee7b7', fontSize: '0.7rem' }}>UNIVERSITY ROLL</span>
                        <div style={{ fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                          {lastScanResult.studentRollNo}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: '#6ee7b7', fontSize: '0.7rem' }}>DEPARTMENT</span>
                        <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{lastScanResult.department}</div>
                      </div>
                      <div>
                        <span style={{ color: '#6ee7b7', fontSize: '0.7rem' }}>AICTE CREDITS</span>
                        <div style={{ fontWeight: 800, color: '#c084fc' }}>+{lastScanResult.activityPointsAwarded} Activity Points</div>
                      </div>
                    </div>
                  </div>
                ) : lastScanResult.alreadyCheckedIn ? (
                  /* DUPLICATE ENTRY FRAUD DETECTED */
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '2px solid #ef4444',
                    borderRadius: '16px',
                    padding: '24px',
                    textAlign: 'center',
                    boxShadow: '0 0 35px rgba(239, 68, 68, 0.25)',
                  }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: '#ef4444',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px',
                    }}>
                      <ShieldAlert size={32} />
                    </div>

                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f87171', letterSpacing: '0.04em' }}>
                      DUPLICATE ENTRY DETECTED ❌
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#fca5a5', marginTop: '4px' }}>
                      Anti-Screenshot Fraud Prevention Active: Ticket Already Used!
                    </div>

                    <div style={{
                      marginTop: '16px',
                      padding: '12px',
                      background: 'rgba(0, 0, 0, 0.4)',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      color: '#fecaca',
                      lineHeight: 1.5,
                    }}>
                      This pass for <strong>{lastScanResult.studentName}</strong> ({lastScanResult.studentRollNo}) was already scanned and checked in earlier. Deny admission at gate.
                    </div>
                  </div>
                ) : (
                  /* INVALID TICKET */
                  <div style={{
                    background: 'rgba(245, 158, 11, 0.12)',
                    border: '2px solid #f59e0b',
                    borderRadius: '16px',
                    padding: '24px',
                    textAlign: 'center',
                  }}>
                    <AlertTriangle size={40} color="#f59e0b" style={{ margin: '0 auto 10px' }} />
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>
                      INVALID TICKET NUMBER
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px' }}>
                      {lastScanResult.message || 'Pass number does not exist in Arya College database.'}
                    </div>
                  </div>
                )
              ) : (
                <div style={{
                  border: '2px dashed rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '36px',
                  textAlign: 'center',
                  color: '#64748b',
                }}>
                  <ShieldCheck size={40} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Ready to Scan Passes</div>
                  <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                    Aim student QR pass at scanner or enter pass number above.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Attendee Roster Table */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Live Event Attendee Roster
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '2px' }}>
                  Registered students stored in MongoDB Atlas for this event.
                </p>
              </div>
              <button
                onClick={() => { if (selectedEventForScan) loadAttendees(selectedEventForScan); }}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCw size={13} className={loadingAttendees ? 'animate-spin' : ''} />
                <span>Refresh Roster</span>
              </button>
            </div>

            {attendeesList.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
                No registrations recorded yet for this event. Switch to Student view to test registering passes.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                      <th style={{ padding: '12px' }}>STUDENT ATTENDEE</th>
                      <th style={{ padding: '12px' }}>UNIVERSITY ROLL</th>
                      <th style={{ padding: '12px' }}>MODE</th>
                      <th style={{ padding: '12px' }}>TICKET PASS #</th>
                      <th style={{ padding: '12px' }}>FEE / PAYMENT</th>
                      <th style={{ padding: '12px' }}>GATE ADMISSION</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendeesList.map(att => {
                      const tNum = att.ticketNumber || att.ticket?.ticketNumber || 'CS-2026-XXXX';
                      return (
                        <tr key={att.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                          <td style={{ padding: '12px', color: '#f8fafc', fontWeight: 700 }}>
                            {att.userName}
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 400 }}>
                              {att.department || 'CSE'} • Sem {att.semester || 6}
                            </div>
                          </td>
                          <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                            {att.userRollNo || '22EACIT089'}
                          </td>
                          <td style={{ padding: '12px', color: '#cbd5e1' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              background: att.registrationType === 'TEAM' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                              color: att.registrationType === 'TEAM' ? '#a5b4fc' : '#cbd5e1',
                            }}>
                              {att.registrationType} {att.teamName ? `(${att.teamName})` : ''}
                            </span>
                          </td>
                          <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>
                            {tNum}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              color: att.amountPaid > 0 ? '#fbbf24' : '#34d399',
                              fontWeight: 700,
                            }}>
                              {att.amountPaid > 0 ? `₹${att.amountPaid} (Paid)` : 'Free'}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            {att.attendanceVerified ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: '#34d399',
                                background: 'rgba(16, 185, 129, 0.15)',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontWeight: 700,
                                fontSize: '0.72rem',
                              }}>
                                <CheckCircle2 size={12} /> Checked In
                              </span>
                            ) : (
                              <span style={{
                                color: '#fbbf24',
                                background: 'rgba(245, 158, 11, 0.1)',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontWeight: 600,
                                fontSize: '0.72rem',
                              }}>
                                Pending
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            {!att.attendanceVerified && (
                              <button
                                onClick={() => handleScanGatePass(tNum)}
                                className="btn-primary"
                                style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                              >
                                Admit at Gate
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: YOU SAID, WE DID KANBAN & 5-VECTOR FEEDBACK REVIEWS */}
      {activeTab === 'FEEDBACK' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Section 1: Event 5-Vector Feedback Analytics */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={22} color="#f59e0b" fill="#f59e0b" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    Attendance-Gated 5-Vector Event Analytics
                  </h3>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '3px' }}>
                  Cryptographically verified feedback from students who completed gate check-in.
                </p>
              </div>

              {/* Event Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Select Event:</span>
                <select
                  value={selectedEventForFeedback}
                  onChange={e => setSelectedEventForFeedback(e.target.value)}
                  className="glass-input"
                  style={{ padding: '8px 14px', fontSize: '0.85rem', maxWidth: '320px' }}
                >
                  {clubEvents.map(ev => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => { if (selectedEventForFeedback) loadFeedbackForEvent(selectedEventForFeedback); }}
                  className="btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <RefreshCw size={13} className={loadingFeedback ? 'animate-spin' : ''} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {feedbackSummary ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Scorecards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                  {/* Overall Card */}
                  <div style={{
                    padding: '20px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.05))',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#fef3c7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Overall Rating
                    </span>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fbbf24', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                      ★ {(feedbackSummary.averageOverall || feedbackSummary.averageOverallRating || 4.8).toFixed(1)}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {feedbackSummary.totalVerifiedReviews || feedbackSummary.totalReviews || 1} Verified Reviews
                    </span>
                  </div>

                  {/* Vector 1: Content */}
                  <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Content Depth</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                      ★ {(feedbackSummary.averageContentDepth || 5.0).toFixed(1)}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Technical rigor & labs</span>
                  </div>

                  {/* Vector 2: Organization */}
                  <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Event Flow</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#a78bfa', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                      ★ {(feedbackSummary.averageOrganization || 5.0).toFixed(1)}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Schedule & support</span>
                  </div>

                  {/* Vector 3: Speaker */}
                  <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Speaker Quality</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                      ★ {(feedbackSummary.averageSpeakerQuality || 4.0).toFixed(1)}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Delivery & mentoring</span>
                  </div>

                  {/* Vector 4: Venue */}
                  <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Venue Facilities</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f472b6', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                      ★ {(feedbackSummary.averageVenueFacilities || 4.0).toFixed(1)}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Wi-Fi, AV & seating</span>
                  </div>

                  {/* Vector 5: Value */}
                  <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Value for Time</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fb923c', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                      ★ {(feedbackSummary.averageValueForTime || 5.0).toFixed(1)}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Skill ROI & points</span>
                  </div>
                </div>

                {/* Sentiment Bar */}
                <div style={{
                  padding: '16px 20px',
                  borderRadius: '14px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>Community Sentiment Analysis:</span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}>
                      {feedbackSummary.positivePercentage ?? 100}% Positive ({feedbackSummary.positiveCount ?? 1})
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '8px',
                      background: 'rgba(59, 130, 246, 0.15)',
                      color: '#60a5fa',
                      border: '1px solid rgba(59, 130, 246, 0.3)'
                    }}>
                      {feedbackSummary.neutralCount ?? 0} Neutral
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '8px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#fbbf24',
                      border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                      {feedbackSummary.constructiveCount ?? 0} Constructive
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    AICTE Institutional Quality Score Impact: <strong style={{ color: '#10b981' }}>+4.8 / 5.0</strong>
                  </span>
                </div>

                {/* Verified Reviews Stream */}
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '14px' }}>
                    Verified Attendee Reviews ({eventReviews.length})
                  </h4>
                  {eventReviews.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                      No verified reviews submitted yet for this event. Verified attendees can review from their My Passes page.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                      {eventReviews.map((rev) => (
                        <div
                          key={rev.id}
                          style={{
                            padding: '18px',
                            borderRadius: '14px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.88rem' }}>{rev.studentName}</span>
                                <span style={{
                                  fontSize: '0.65rem',
                                  padding: '2px 6px',
                                  borderRadius: '6px',
                                  background: 'rgba(16, 185, 129, 0.15)',
                                  color: '#34d399',
                                  border: '1px solid rgba(16, 185, 129, 0.3)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}>
                                  <ShieldCheck size={10} /> Verified Attendee
                                </span>
                              </div>
                              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                Roll: {rev.studentRollNo} • {new Date(rev.submittedAt).toLocaleDateString('en-IN')}
                              </span>
                            </div>
                            <div style={{
                              fontSize: '0.85rem',
                              fontWeight: 800,
                              color: '#fbbf24',
                              fontFamily: 'var(--font-mono)'
                            }}>
                              ★ {rev.ratings.overallAverage.toFixed(1)}
                            </div>
                          </div>

                          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                            "{rev.comments}"
                          </p>

                          {rev.strengths && (
                            <div style={{ fontSize: '0.75rem', color: '#34d399' }}>
                              <strong>Strengths:</strong> {rev.strengths}
                            </div>
                          )}

                          {rev.areasOfImprovement && (
                            <div style={{ fontSize: '0.75rem', color: '#fbbf24' }}>
                              <strong>Suggested Improvement:</strong> {rev.areasOfImprovement}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                Loading 5-vector feedback analytics for selected event...
              </div>
            )}
          </div>

          {/* Section 2: "You Said, We Did" Closed-Loop Action Kanban Board */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lightbulb size={22} color="#fbbf24" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    "You Said, We Did" Closed-Loop Action Kanban
                  </h3>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '3px' }}>
                  Public student suggestions with community upvotes. Transition items through execution stages with official resolution proof.
                </p>
              </div>

              <button
                onClick={loadSuggestions}
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCw size={13} className={loadingSuggestions ? 'animate-spin' : ''} />
                <span>Refresh Kanban ({clubSuggestions.length})</span>
              </button>
            </div>

            {/* 4-Column Kanban Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '18px',
              alignItems: 'start'
            }}>
              {[
                { 
                  status: 'SUBMITTED' as SuggestionStatus, 
                  title: '1. Submitted', 
                  desc: 'New suggestions from students',
                  color: '#fbbf24', 
                  bg: 'rgba(245, 158, 11, 0.08)', 
                  border: 'rgba(245, 158, 11, 0.3)' 
                },
                { 
                  status: 'UNDER_REVIEW' as SuggestionStatus, 
                  title: '2. Under Review', 
                  desc: 'Core team & faculty analyzing',
                  color: '#38bdf8', 
                  bg: 'rgba(56, 189, 248, 0.08)', 
                  border: 'rgba(56, 189, 248, 0.3)' 
                },
                { 
                  status: 'PLANNED' as SuggestionStatus, 
                  title: '3. Planned', 
                  desc: 'Approved & resources allocated',
                  color: '#a78bfa', 
                  bg: 'rgba(167, 139, 250, 0.08)', 
                  border: 'rgba(167, 139, 250, 0.3)' 
                },
                { 
                  status: 'IMPLEMENTED' as SuggestionStatus, 
                  title: '4. Implemented', 
                  desc: 'Executed with proof & remarks',
                  color: '#34d399', 
                  bg: 'rgba(52, 211, 153, 0.08)', 
                  border: 'rgba(52, 211, 153, 0.3)' 
                },
              ].map(col => {
                const colItems = clubSuggestions.filter(s => s.kanbanStatus === col.status);
                return (
                  <div
                    key={col.status}
                    style={{
                      background: col.bg,
                      border: `1px solid ${col.border}`,
                      borderRadius: '16px',
                      padding: '16px',
                      minHeight: '440px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    {/* Column Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: `1px solid ${col.border}` }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem', color: col.color }}>
                          {col.title}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                          {col.desc}
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: col.color,
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {colItems.length}
                      </span>
                    </div>

                    {/* Cards Container */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                      {colItems.length === 0 ? (
                        <div style={{ padding: '24px 12px', textAlign: 'center', color: '#64748b', fontSize: '0.78rem' }}>
                          No suggestions in this stage
                        </div>
                      ) : (
                        colItems.map(item => (
                          <div
                            key={item.id}
                            style={{
                              background: 'rgba(15, 23, 42, 0.75)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '12px',
                              padding: '14px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', margin: 0, lineHeight: 1.4 }}>
                                {item.title}
                              </h5>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '6px',
                                background: 'rgba(245, 158, 11, 0.15)',
                                color: '#fbbf24',
                                whiteSpace: 'nowrap'
                              }}>
                                <ThumbsUp size={10} /> {item.upvotesCount}
                              </span>
                            </div>

                            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45, margin: 0 }}>
                              {item.description}
                            </p>

                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              By <strong>{item.authorName}</strong> ({item.authorRollNo || 'Student'})
                            </div>

                            {/* Institutional Response Box ("We Did") */}
                            {item.clubActionResponseText && (
                              <div style={{
                                padding: '8px 10px',
                                borderRadius: '8px',
                                background: item.kanbanStatus === 'IMPLEMENTED' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                                border: item.kanbanStatus === 'IMPLEMENTED' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(99, 102, 241, 0.25)',
                                fontSize: '0.72rem',
                                color: item.kanbanStatus === 'IMPLEMENTED' ? '#a7f3d0' : '#c7d2fe',
                                lineHeight: 1.4
                              }}>
                                <strong>🏛️ We Did:</strong> {item.clubActionResponseText}
                              </div>
                            )}

                            {/* Transition & Edit Button */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
                              <button
                                onClick={() => {
                                  setSelectedSuggestionForEdit(item);
                                  setNewKanbanStatus(item.kanbanStatus);
                                  setResponseText(item.clubActionResponseText || '');
                                  setProofUrl(item.proofImageUrl || '');
                                }}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(255, 255, 255, 0.12)',
                                  color: '#e2e8f0',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <ArrowRightCircle size={12} />
                                <span>Change Status & Reply</span>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* KANBAN CARD STATUS EDIT MODAL */}
      {selectedSuggestionForEdit && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 3000
        }}>
          <div style={{
            width: '100%',
            maxWidth: '540px',
            background: 'linear-gradient(to bottom, #0f172a, #020617)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Update Action Board Status
                </span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: '2px 0 0' }}>
                  {selectedSuggestionForEdit.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedSuggestionForEdit(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '18px', lineHeight: 1.45 }}>
              "{selectedSuggestionForEdit.description}"
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Target Kanban Status
                </label>
                <select
                  value={newKanbanStatus}
                  onChange={e => setNewKanbanStatus(e.target.value as SuggestionStatus)}
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem' }}
                >
                  <option value="SUBMITTED">1. Submitted (Backlog)</option>
                  <option value="UNDER_REVIEW">2. Under Review (Analyzing)</option>
                  <option value="PLANNED">3. Planned (Scheduled for Execution)</option>
                  <option value="IMPLEMENTED">4. Implemented (Completed Resolution)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Institutional Action Response ("We Did")
                </label>
                <textarea
                  value={responseText}
                  onChange={e => setResponseText(e.target.value)}
                  placeholder="Explain the concrete action taken, purchase order, equipment installed, or schedule change..."
                  rows={3}
                  className="glass-input"
                  style={{ width: '100%', padding: '10px 12px', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Resolution Proof URL / Document Link (Optional)
                </label>
                <input
                  type="text"
                  value={proofUrl}
                  onChange={e => setProofUrl(e.target.value)}
                  placeholder="https://aryacollege.in/proofs/wifi-upgrade.pdf"
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
              <button
                onClick={() => setSelectedSuggestionForEdit(null)}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateKanbanStatus}
                disabled={updatingKanban}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {updatingKanban ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={15} />}
                <span>Save & Update Kanban</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT JOIN APPLICATIONS */}
      {activeTab === 'APPLICATIONS' && (

        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Spring 2026 Student Recruitment Queue
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '2px' }}>
                Review and approve/reject membership applications from Arya College students.
              </p>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>
              Total Applications: {clubApps.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {clubApps.length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                No membership applications currently in queue for {activeClub.name}.
              </div>
            ) : (
              clubApps.map(app => (
                <div key={app.id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                        {app.userName}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: '#fbbf24', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                        {app.userRollNo}
                      </span>
                      <span className={`badge-status ${app.status === 'ACCEPTED' ? 'badge-status-approved' : app.status === 'REJECTED' ? 'badge-status-rejected' : 'badge-status-pending'}`}>
                        {app.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '10px' }}>
                      {app.department} • Semester {app.semester} • Applied for: <strong>{app.preferredRole}</strong>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                      "{app.statementOfPurpose}"
                    </div>

                    {app.reviewedAt && (
                      <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '6px' }}>
                        Reviewed on {new Date(app.reviewedAt).toLocaleDateString()}: {app.reviewerNotes}
                      </div>
                    )}
                  </div>

                  {app.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '8px', alignSelf: 'center' }}>
                      <button
                        onClick={() => {
                          const res = reviewJoinApplication(app.id, 'ACCEPTED', 'Welcome to the core committee!');
                          showNotification(res.message, 'success');
                        }}
                        className="btn-gold"
                        style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                      >
                        Accept Member
                      </button>
                      <button
                        onClick={() => {
                          const res = reviewJoinApplication(app.id, 'REJECTED', 'Not selected for this cycle.');
                          showNotification(res.message, 'error');
                        }}
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#f87171',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: EXECUTIVE ROSTER */}
      {activeTab === 'ROSTER' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Executive Leadership & Coordinator Roster
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '2px' }}>
                Appointed coordinators for {activeClub.name}.
              </p>
            </div>

            <button
              onClick={() => setShowAddCoordModal(true)}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <UserPlus size={16} /> Appoint New Coordinator
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
            {activeClub.studentLeads.map((lead, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0b132b',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                  }}>
                    {lead.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                      {lead}
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '2px' }}>
                      {idx === 0 ? 'Club President' : 'Executive Coordinator'}
                    </div>
                  </div>
                </div>
                <span className="badge-role-club">Executive</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CLUB PROFILE & SETTINGS */}
      {activeTab === 'PROFILE' && (
        <div className="glass-panel" style={{ padding: '28px', maxWidth: '800px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
            Club Configuration & Institutional Settings
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '24px' }}>
            Update public details displayed on the campus directory and treasury payout configurations.
          </p>

          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>
                Club Tagline / Slogan
              </label>
              <input
                type="text"
                value={profileForm.tagline}
                onChange={e => setProfileForm({ ...profileForm, tagline: e.target.value })}
                className="glass-input"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>
                Full Club Description & Mission
              </label>
              <textarea
                rows={4}
                value={profileForm.description}
                onChange={e => setProfileForm({ ...profileForm, description: e.target.value })}
                className="glass-input"
                style={{ resize: 'vertical' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>
                  Faculty In-Charge & Mentor
                </label>
                <input
                  type="text"
                  value={profileForm.facultyCoordinator}
                  onChange={e => setProfileForm({ ...profileForm, facultyCoordinator: e.target.value })}
                  className="glass-input"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>
                  Registered Payout UPI ID
                </label>
                <input
                  type="text"
                  value={profileForm.payoutUpiId}
                  onChange={e => setProfileForm({ ...profileForm, payoutUpiId: e.target.value })}
                  className="glass-input"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>
                  Regular Meeting Schedule
                </label>
                <input
                  type="text"
                  value={profileForm.meetingSchedule}
                  onChange={e => setProfileForm({ ...profileForm, meetingSchedule: e.target.value })}
                  className="glass-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>
                  Recruitment Status
                </label>
                <select
                  value={profileForm.recruitmentStatus}
                  onChange={e => setProfileForm({ ...profileForm, recruitmentStatus: e.target.value as any })}
                  className="glass-input"
                >
                  <option value="OPEN">Recruitment Open (Accepting Applications)</option>
                  <option value="CLOSED">Recruitment Closed (Invitation Only)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button type="submit" className="btn-gold" style={{ padding: '12px 24px', fontSize: '0.9rem' }}>
                Save Club Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PAYOUT REQUEST MODAL */}
      {showPayoutModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div className="glass-panel" style={{ maxWidth: '520px', width: '100%', padding: '32px', position: 'relative' }}>
            <button
              onClick={() => {
                setShowPayoutModal(false);
                setPayoutReceipt(null);
              }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            {payoutReceipt ? (
              <div style={{ textAlign: 'center' }}>
                <CheckCircle2 size={54} color="#10b981" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
                  Payout Request Submitted!
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>
                  Your disbursement voucher has been registered in the institutional ledger.
                </p>

                {/* Printable Voucher */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px dashed rgba(245, 158, 11, 0.4)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'left',
                  marginBottom: '20px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>VOUCHER NO:</span>
                    <strong style={{ color: '#38bdf8' }}>{payoutReceipt.referenceId}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>AMOUNT:</span>
                    <strong style={{ color: '#fbbf24' }}>₹{Number(payoutReceipt.amount).toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>PAYOUT VPA:</span>
                    <strong style={{ color: '#cbd5e1' }}>{payoutReceipt.upiId}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>PURPOSE:</span>
                    <span style={{ color: '#cbd5e1' }}>{payoutReceipt.note || 'Event Logistics'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>AUDIT STATUS:</span>
                    <span style={{ color: '#f97316', fontWeight: 700 }}>PENDING DEAN APPROVAL</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowPayoutModal(false);
                    setPayoutReceipt(null);
                  }}
                  className="btn-gold"
                  style={{ width: '100%', padding: '12px' }}
                >
                  Close & View in Ledger
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestPayout} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Coins size={24} color="#f59e0b" />
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    Request Treasury Disbursement
                  </h3>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  Disburse funds from <strong>{activeClub.name}</strong> dedicated treasury to the registered UPI ID.
                </p>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.78rem' }}>
                    <span style={{ color: '#94a3b8' }}>Disbursement Amount (₹)</span>
                    <span style={{ color: '#fbbf24' }}>Max Available: ₹{activeClub.treasury.availableBalance.toLocaleString()}</span>
                  </div>
                  <input
                    type="number"
                    min="100"
                    max={activeClub.treasury.availableBalance}
                    value={payoutAmount}
                    onChange={e => setPayoutAmount(Number(e.target.value))}
                    className="glass-input"
                    style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fbbf24' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                    Registered Payout UPI ID
                  </label>
                  <input
                    type="text"
                    disabled
                    value={activeClub.treasury.payoutUpiId}
                    className="glass-input"
                    style={{ background: 'rgba(255, 255, 255, 0.03)', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                    Purpose / Expense Description
                  </label>
                  <textarea
                    rows={2}
                    value={payoutNote}
                    onChange={e => setPayoutNote(e.target.value)}
                    placeholder="e.g. HackSprint catering, cloud server cluster costs, mementos..."
                    className="glass-input"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowPayoutModal(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#94a3b8',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gold"
                    style={{ padding: '10px 22px', fontSize: '0.85rem' }}
                  >
                    Submit Payout Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ADD COORDINATOR MODAL */}
      {showAddCoordModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div className="glass-panel" style={{ maxWidth: '480px', width: '100%', padding: '30px', position: 'relative' }}>
            <button
              onClick={() => setShowAddCoordModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
              Appoint Club Coordinator
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '20px' }}>
              Add a student to the official leadership roster of {activeClub.name}.
            </p>

            <form onSubmit={handleAddCoordinator} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                  Student Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Siddharth Verma"
                  value={newCoordName}
                  onChange={e => setNewCoordName(e.target.value)}
                  className="glass-input"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                  Designation / Role
                </label>
                <select
                  value={newCoordRole}
                  onChange={e => setNewCoordRole(e.target.value)}
                  className="glass-input"
                >
                  <option value="Technical Lead">Technical Lead</option>
                  <option value="Vice President">Vice President</option>
                  <option value="Event Logistics Coordinator">Event Logistics Coordinator</option>
                  <option value="PR & Social Media Head">PR & Social Media Head</option>
                  <option value="Treasurer / Accounts Manager">Treasurer / Accounts Manager</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                  Institutional Email
                </label>
                <input
                  type="email"
                  placeholder="name.branch@aryacollege.in"
                  value={newCoordEmail}
                  onChange={e => setNewCoordEmail(e.target.value)}
                  className="glass-input"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddCoordModal(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#94a3b8',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.85rem' }}>
                  Appoint Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Event Modal (Phase 3) */}
      <CreateEventModal
        isOpen={showCreateEventModal}
        onClose={() => setShowCreateEventModal(false)}
        clubId={activeClub.id}
        clubName={activeClub.name}
        onEventCreated={() => {
          loadClubEvents();
          showNotification('Event proposal submitted for Dean approval! Venue slot locked.', 'success');
        }}
      />
    </div>
  );
};
