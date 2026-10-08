import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClub } from '../context/ClubContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Calendar, 
  Users, 
  ArrowRight, 
  Ticket, 
  QrCode, 
  Coins, 
  MessageSquare, 
  Award,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  Flame,
  Star,
  GraduationCap,
  Building2,
  ExternalLink,
  CheckCircle2,
  LayoutDashboard,
  Clock,
  Landmark,
  UserCheck
} from 'lucide-react';
import { fetchEvents } from '../services/api';
import { Event } from '../types';
import { Campus3DExplorer } from '../components/Campus3DExplorer';

export const HomePage: React.FC = () => {
  const { currentUser, isStudent, isClubAdmin, isSuperAdmin, isAuthenticated } = useAuth();
  const { clubs } = useClub();
  const { isDark } = useTheme();

  const [liveEvents, setLiveEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PUBLIC'>(
    isAuthenticated && currentUser ? 'DASHBOARD' : 'PUBLIC'
  );

  useEffect(() => {
    fetchEvents()
      .then(setLiveEvents)
      .catch(err => console.error('Failed to load events for homepage:', err));
  }, []);

  // Update tab if user changes login status
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setActiveTab('DASHBOARD');
    } else {
      setActiveTab('PUBLIC');
    }
  }, [currentUser?.id, isAuthenticated]);

  const now = new Date();

  // Filter only upcoming and active events for registration
  const upcomingEvents = liveEvents.filter(e => {
    const endStr = e.endTime || e.schedule?.endTime;
    const startStr = e.startTime || e.schedule?.startTime;
    return e.status !== 'COMPLETED' && (!endStr || new Date(endStr) >= now) && (!startStr || new Date(startStr) >= now);
  });

  const studentProfile = currentUser?.studentProfile;
  const currentPoints = studentProfile?.activityPointsTotal ?? 0;
  const targetPoints = 100;
  const progressPercent = Math.min(100, Math.round((currentPoints / targetPoints) * 100));

  // Find club for club admin
  const myClub = isClubAdmin
    ? clubs.find(c => c.slug === currentUser?.administeredClubId) || clubs[0]
    : null;

  return (
    <div>
      {/* If User is Logged In, show the Dashboard Switcher Ribbon */}
      {currentUser && (
        <div style={{
          background: isDark ? 'rgba(16, 26, 21, 0.8)' : 'var(--paper2)',
          borderBottom: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`,
          padding: '10px 5vw',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--acid)',
              boxShadow: '0 0 10px var(--acid)'
            }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {isStudent && `Student Portal • ${currentUser.name} (${studentProfile?.rollNo || '22EACIT089'})`}
              {isClubAdmin && `Club Command • ${myClub?.name || 'Society Lead'}`}
              {isSuperAdmin && `Dean Academic Directorate • Institutional Control`}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setActiveTab('DASHBOARD')}
              style={{
                background: activeTab === 'DASHBOARD' ? 'var(--acid)' : 'transparent',
                color: activeTab === 'DASHBOARD' ? '#000000' : 'var(--text-secondary)',
                border: activeTab === 'DASHBOARD' ? '1px solid var(--acid)' : `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`,
                padding: '5px 14px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s'
              }}
            >
              <LayoutDashboard size={13} />
              <span>Personal Command Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('PUBLIC')}
              style={{
                background: activeTab === 'PUBLIC' ? 'var(--acid)' : 'transparent',
                color: activeTab === 'PUBLIC' ? '#000000' : 'var(--text-secondary)',
                border: activeTab === 'PUBLIC' ? '1px solid var(--acid)' : `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`,
                padding: '5px 14px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s'
              }}
            >
              <Building2 size={13} />
              <span>Public Campus Overview</span>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          AUTHENTICATED DASHBOARD VIEW (AFTER LOGIN)
          ===================================================================== */}
      {currentUser && activeTab === 'DASHBOARD' ? (
        <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '40px 5vw 80px' }}>
          
          {/* 1. STUDENT DASHBOARD */}
          {isStudent && (
            <div>
              {/* Student Welcome Header Card */}
              <div className="glass-panel" style={{
                padding: '32px',
                marginBottom: '32px',
                position: 'relative',
                overflow: 'hidden',
                background: isDark
                  ? 'linear-gradient(135deg, rgba(16, 26, 21, 0.95) 0%, rgba(8, 14, 11, 0.98) 100%)'
                  : 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                    alt={currentUser.name}
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '18px',
                      objectFit: 'cover',
                      border: '3px solid var(--acid)',
                      boxShadow: '0 0 25px var(--acid-glow)',
                    }}
                  />
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.03em' }}>
                        Welcome back, {currentUser.name}! 🎓
                      </h1>
                      <span className="badge-role-student">Verified Student</span>
                      <span style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: 'var(--acid)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        RTU Non-Credit Track
                      </span>
                    </div>

                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <span><strong>Roll No:</strong> {studentProfile?.rollNo || '22EACIT089'}</span>
                      <span><strong>Enrollment:</strong> {studentProfile?.enrollmentNo || '22EAICSE089'}</span>
                      <span><strong>Department:</strong> {studentProfile?.department || 'Computer Science & Engineering'}</span>
                      <span>Semester {studentProfile?.semester || 6} (Batch 2026)</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <Link to="/my-passes" className="btn acid" style={{ padding: '10px 18px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Ticket size={16} />
                      <span>My Rolling Passes</span>
                    </Link>
                    <Link to="/profile" className="btn ghost" style={{ padding: '10px 18px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Award size={16} />
                      <span>AICTE Transcript</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Student Core Widgets Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                {/* Widget 1: AICTE Activity Points Progress */}
                <div className="glass-card" style={{ padding: '26px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Star size={20} color="var(--acid)" fill="var(--acid)" />
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        AICTE Activity Points
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--acid)', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 8px', borderRadius: '12px' }}>
                      {progressPercent}% ON TRACK
                    </span>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                      <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--acid)', fontFamily: 'var(--font-mono)' }}>
                        {currentPoints} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ 100 Pts</span>
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {100 - currentPoints} points needed for Honors
                      </span>
                    </div>

                    <div style={{ width: '100%', height: '8px', background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'var(--line)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--acid)', borderRadius: '999px', transition: 'width 1s ease' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
                    <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'var(--paper2)', border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}` }}>
                      Tech & Hackathons: <strong>25 Pts</strong>
                    </span>
                    <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'var(--paper2)', border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}` }}>
                      Cultural & Arts: <strong>20 Pts</strong>
                    </span>
                  </div>
                </div>

                {/* Widget 2: Active Rolling Gate Pass (Direct Access) */}
                <div className="glass-card" style={{ padding: '26px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <QrCode size={20} color="var(--acid)" />
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        Next Gate Pass & Rolling QR
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: '12px' }}>
                      ● ACTIVE PASS
                    </span>
                  </div>

                  <div style={{ padding: '16px', background: isDark ? '#111915' : 'var(--paper2)', border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`, borderRadius: '8px', marginBottom: '16px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      Smart India Hackathon 2026 - ACEIT Internal Hackathon
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--acid)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={14} />
                      Pass #CS-2026-HACK-8492 • Team Squad Pass
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Venue: Dr. Radhakrishnan Central Auditorium
                    </div>
                  </div>

                  <Link to="/my-passes" className="btn small acid" style={{ width: '100%', justifyContent: 'center' }}>
                    Show Live Rotating Gate QR Pass →
                  </Link>
                </div>
              </div>

              {/* Section: Open Upcoming Events for Registration */}
              <div style={{ marginBottom: '50px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <div className="kicker">Live Campus Feed</div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', margin: 0 }}>
                      Upcoming Official Events (Open for Registration)
                    </h2>
                  </div>
                  <Link to="/events" className="btn small ghost">
                    View Full Schedule ({liveEvents.length}) →
                  </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                  {upcomingEvents.slice(0, 3).map((event) => {
                    const startStr = event.startTime || event.schedule?.startTime || '';
                    const isPaid = event.isPaid ?? event.ticketing?.isPaid ?? false;
                    const price = event.ticketPrice ?? event.ticketing?.ticketPrice ?? 0;

                    return (
                      <article key={event.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ height: '170px', position: 'relative', overflow: 'hidden' }}>
                          <span className="ribbon" style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2 }}>
                            {isPaid ? `₹${price} / PAID` : 'FREE ENTRY'}
                          </span>
                          <img
                            src={event.bannerImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800'}
                            alt={event.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>

                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ font: '9px var(--font-mono)', color: 'var(--muted)' }}>
                              {event.clubName}
                            </span>
                            <span style={{ font: '9px var(--font-mono)', color: 'var(--acid)', fontWeight: 800 }}>
                              +{event.activityPointsAwarded || 20} AICTE PTS
                            </span>
                          </div>

                          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 8px', lineHeight: 1.25 }}>
                            {event.title}
                          </h3>

                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px', flex: 1 }}>
                            {event.shortSummary}
                          </p>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`, paddingTop: '12px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              {startStr ? new Date(startStr).toLocaleDateString() : 'Upcoming'}
                            </span>
                            <Link to="/events" className="btn small acid">
                              Register Pass →
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              {/* Section: 15 Student Clubs & Societies Directory */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <div className="kicker">Campus Societies</div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', margin: 0 }}>
                      15 Verified Student Chapters & Societies
                    </h2>
                  </div>
                  <Link to="/clubs" className="btn small ghost">
                    All 15 Clubs Directory →
                  </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  {clubs.slice(0, 6).map(club => (
                    <article key={club.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <img
                          src={club.logoUrl}
                          alt={club.name}
                          style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}` }}
                        />
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.15 }}>
                            {club.name}
                          </h4>
                          <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                            {club.category}
                          </span>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '14px', flex: 1 }}>
                        {club.tagline}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`, paddingTop: '10px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{club.memberCount} MEMBERS</span>
                        <span style={{ color: 'var(--acid)', fontWeight: 800 }}>
                          ★ AICTE ACCREDITED
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. CLUB ADMIN DASHBOARD */}
          {isClubAdmin && (
            <div>
              {/* Club Command Banner */}
              <div className="glass-panel" style={{
                padding: '36px',
                marginBottom: '32px',
                position: 'relative',
                overflow: 'hidden',
                background: isDark
                  ? 'linear-gradient(135deg, rgba(16, 26, 21, 0.95) 0%, rgba(8, 14, 11, 0.98) 100%)'
                  : 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'}
                    alt={currentUser.name}
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '18px',
                      objectFit: 'cover',
                      border: '3px solid var(--acid)',
                      boxShadow: '0 0 25px var(--acid-glow)',
                    }}
                  />
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.03em' }}>
                        Club Leadership Command: {myClub?.name || 'Society Hub'}
                      </h1>
                      <span className="badge-role-club">★ CLUB ADMIN</span>
                    </div>

                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <span><strong>Lead:</strong> {currentUser.name} ({currentUser.facultyDesignation || 'Club President'})</span>
                      <span><strong>Faculty HOD In-Charge:</strong> {myClub?.facultyCoordinator || 'Arya Faculty Head'}</span>
                      <span><strong>Meeting:</strong> {myClub?.meetingSchedule || 'Weekly Meets'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <Link to="/club-admin" className="btn acid" style={{ padding: '10px 18px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <LayoutDashboard size={16} />
                      <span>Open Club Console</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Club Operations Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <Users size={20} color="var(--acid)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Active Community</span>
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {myClub?.memberCount || 410} Students
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Registered society members across all batches
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <Calendar size={20} color="var(--acid)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Events Hosted</span>
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {myClub?.eventsHostedCount || 20} Events
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Technical symposiums and campus hackathons
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <Coins size={20} color="var(--acid)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Dedicated Balance</span>
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--acid)', fontFamily: 'var(--font-mono)' }}>
                    ₹{myClub?.treasury?.availableBalance?.toLocaleString('en-IN') || '28,500'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    UPI: {myClub?.treasury?.payoutUpiId || 'society@okhdfcbank'}
                  </div>
                </div>
              </div>

              {/* Club Action Shortcuts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                <Link to="/club-admin" className="glass-card" style={{ padding: '24px', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <LayoutDashboard size={22} color="var(--acid)" />
                    <ChevronRight size={18} color="var(--acid)" />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>Manage Club Console</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Create new event proposals, access AI Event Copilot, and manage attendees.
                  </p>
                </Link>

                <Link to="/events" className="glass-card" style={{ padding: '24px', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <Calendar size={22} color="var(--acid)" />
                    <ChevronRight size={18} color="var(--acid)" />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>View Campus Calendar</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Align your club event schedules with institutional buffers and venue availability.
                  </p>
                </Link>
              </div>
            </div>
          )}

          {/* 3. SUPER ADMIN (DEAN) DASHBOARD */}
          {isSuperAdmin && (
            <div>
              {/* Dean Executive Banner */}
              <div className="glass-panel" style={{
                padding: '36px',
                marginBottom: '32px',
                position: 'relative',
                overflow: 'hidden',
                background: isDark
                  ? 'linear-gradient(135deg, rgba(16, 26, 21, 0.95) 0%, rgba(8, 14, 11, 0.98) 100%)'
                  : 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
                    alt={currentUser.name}
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '18px',
                      objectFit: 'cover',
                      border: '3px solid var(--acid)',
                      boxShadow: '0 0 25px var(--acid-glow)',
                    }}
                  />
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.03em' }}>
                        Institutional Executive Directorate: {currentUser.name}
                      </h1>
                      <span className="badge-role-admin">★ SUPER ADMIN</span>
                    </div>

                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <span><strong>Designation:</strong> Dean (Academics & Student Welfare)</span>
                      <span><strong>Office:</strong> Dean Secretariat, Administrative Block A</span>
                      <span><strong>Accreditation:</strong> RTU & AICTE 100-Point Regulatory Ledger Authority</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <Link to="/admin" className="btn acid" style={{ padding: '10px 18px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldCheck size={16} />
                      <span>Open Dean Hub & Audits</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Dean Oversight Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <Landmark size={20} color="var(--acid)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Supervised Chapters</span>
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    15 Clubs
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Active collegiate student societies across all branches
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <Calendar size={20} color="var(--acid)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Annual Flagship Fests</span>
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    6 Flagships
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    SIH 2026, Arya Ratan, CodeWars, THAR, Karting Cup, Euphonious
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <Award size={20} color="var(--acid)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>AICTE Accrual Norm</span>
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--acid)', fontFamily: 'var(--font-mono)' }}>
                    100 Points
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Mandatory activity points threshold for RTU degree honors
                  </div>
                </div>
              </div>

              {/* Dean Command Gateways */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                <Link to="/admin" className="glass-card" style={{ padding: '24px', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <ShieldCheck size={22} color="var(--acid)" />
                    <ChevronRight size={18} color="var(--acid)" />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>Dean Hub & Audit Logs</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Sanction event proposals, clear venue reservation requests, and audit club payouts.
                  </p>
                </Link>

                <Link to="/clubs" className="glass-card" style={{ padding: '24px', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <Building2 size={22} color="var(--acid)" />
                    <ChevronRight size={18} color="var(--acid)" />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>Faculty HOD & Club Directory</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Inspect faculty coordinators and society lead rosters across all departments.
                  </p>
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* =====================================================================
           PUBLIC SHOWCASE / INTRO TOUR VIEW (FOR GUESTS OR ON REQUEST)
           ===================================================================== */
        <div>
          {/* 1. HERO SECTION */}
          <section style={{
            padding: '60px 5vw 45px',
            borderBottom: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`,
            position: 'relative',
            background: 'var(--bg-primary)',
          }}>
            <div style={{
              maxWidth: '1360px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '50px',
              alignItems: 'center',
            }}>
              {/* Left Column: Hero Copy */}
              <div>
                <div className="eyebrow" style={{ marginBottom: '22px' }}>
                  <i></i> ★ Rated 4.9/5 by 3,500+ Arya College Students & Faculty
                </div>

                <h1 style={{
                  fontSize: 'clamp(46px, 6vw, 84px)',
                  fontWeight: 800,
                  lineHeight: 0.92,
                  letterSpacing: '-0.075em',
                  marginBottom: '24px',
                  color: 'var(--text-primary)',
                }}>
                  Stop stressing over <span className="outline">campus</span> <span className="accent">events.</span>
                </h1>

                <p style={{
                  fontSize: '15px',
                  lineHeight: 1.75,
                  color: 'var(--text-secondary)',
                  maxWidth: '620px',
                  marginBottom: '28px',
                }}>
                  <b>15 Dedicated Arya Clubs, anti-screenshot rolling QR passes & AICTE activity points</b> in one unified operating system. Zero scattered WhatsApp announcements, zero gate proxies, and 100% degree honors transcript compliance.
                </p>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '25px' }}>
                  <Link to="/events" className="btn acid">
                    Browse 15 Clubs & Events →
                  </Link>
                  <a href="#demo3d" className="btn ghost">
                    3D Digital Twin View <span>▶</span>
                  </a>
                  {isStudent && (
                    <Link to="/my-passes" className="btn-gold">
                      <Ticket size={14} />
                      My Rolling Passes
                    </Link>
                  )}
                </div>

                <div className="trust-row">
                  <span>Instant Gate Verification (&lt; 30s)</span>
                  <span>15 Official Student Chapters</span>
                  <span>RTU AICTE Activity Ledger Sync</span>
                </div>
              </div>

              {/* Right Column: Code Window Stage */}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <div className="float-chip chip-a">15 CLUBS / VERIFIED</div>
                <div className="float-chip chip-b">PASSES / ROLLING QR</div>
                <div className="float-chip chip-c">AICTE / 100 PTS</div>

                <div className="code-window" style={{ width: '100%', maxWidth: '540px' }}>
                  <div className="window-head">
                    <span className="wdot"></span>
                    <span className="wdot"></span>
                    <span className="wdot"></span>
                    <span className="wtitle">campussphere / arya-aceit-core</span>
                  </div>
                  <div className="code-body">
                    <div className="lines">
                      01<br/>02<br/>03<br/>04<br/>05<br/>06<br/>07<br/>08<br/>09<br/>10<br/>11<br/>12<br/>13<br/>14<br/>15
                    </div>
                    <div className="code">
                      <span className="c">// ARYA COLLEGE OPERATING SYSTEM / build 2.4.0</span><br/>
                      <span className="o">const</span> platform = <span className="w">"CampusSphere ACEIT"</span>;<br/>
                      <span className="o">const</span> clubs = [<span className="g">"SciTech"</span>, <span className="g">"Cipher"</span>, <span className="g">"Robotics"</span>];<br/><br/>
                      <span className="c">/* PRODUCTION INTEGRITY CHECKS */</span><br/>
                      <span className="g">✓ 15-clubs-ecosystem.live</span><br/>
                      <span className="g">✓ hmac-sha256-rolling-qr.active</span><br/>
                      <span className="g">✓ razorpay-split-treasury.verified</span><br/>
                      <span className="g">✓ aicte-100-credits.synced</span><br/>
                      <span className="g">✓ 3-way-student-auth.ok</span><br/><br/>
                      <span className="c">SYSTEM STATUS</span><br/>
                      <span className="barline"></span>
                      <span className="barline b2"></span>
                      <span className="barline b3"></span>
                      <span className="r">● ALL 15 CLUBS ONLINE / GATE READY</span>
                    </div>
                  </div>
                </div>

                <div className="live-pill">
                  GATE SCANNERS ONLINE
                </div>
              </div>
            </div>
          </section>

          {/* 2. TICKER MARQUEE STRIP */}
          <div className="ticker">
            <div className="ticker-track">
              <span><b>15 DEDICATED CLUBS</b> ACTIVE</span>
              <span><b>100%</b> AICTE CREDIT SYNC</span>
              <span><b>&lt; 30s</b> ROLLING QR SCAN</span>
              <span><b>ARYA COLLEGE</b> ACEIT JAIPUR</span>
              <span><b>₹2,48,000+</b> TREASURY VOLUME</span>
              <span>ARYA SCITECH</span>
              <span>ARYA CIPHER</span>
              <span>ACEIT HACKATHON</span>
              <span>ROBOTICS & UAV</span>
              <span>E-SPORTS & GAMING</span>
              <span>GREEN ENERGY</span>
              <span>LINCOM LINUX</span>
              <span><b>15 DEDICATED CLUBS</b> ACTIVE</span>
              <span><b>100%</b> AICTE CREDIT SYNC</span>
              <span><b>&lt; 30s</b> ROLLING QR SCAN</span>
              <span><b>ARYA COLLEGE</b> ACEIT JAIPUR</span>
              <span><b>₹2,48,000+</b> TREASURY VOLUME</span>
              <span>ARYA SCITECH</span>
              <span>ARYA CIPHER</span>
              <span>ACEIT HACKATHON</span>
              <span>ROBOTICS & UAV</span>
              <span>E-SPORTS & GAMING</span>
              <span>GREEN ENERGY</span>
              <span>LINCOM LINUX</span>
            </div>
          </div>

          <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '60px 5vw' }}>
            {/* 3. ARCHITECTURAL PILLARS */}
            <section style={{ marginBottom: '80px' }}>
              <div className="kicker">01 / Operational Foundation</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 1, margin: 0 }}>
                  Engineered for real college governance.
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0, maxWidth: '420px', lineHeight: 1.6 }}>
                  Replacing manual spreadsheets and chaotic WhatsApp forwards with cryptographic verification.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                <article className="glass-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span className="ribbon">SECURE</span>
                    <span style={{ font: '9px var(--font-mono)', color: 'var(--muted)' }}>PILLAR / 01</span>
                  </div>
                  <div style={{ font: '800 24px var(--font-mono)', color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <QrCode size={22} color="var(--acid)" />
                    Rolling QR Gate Pass
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    HMAC-SHA256 encrypted rolling QR rotating every 30 seconds. Screenshots sent via WhatsApp fail immediately at club entry gates.
                  </p>
                </article>

                <article className="glass-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span className="ribbon">FINANCE</span>
                    <span style={{ font: '9px var(--font-mono)', color: 'var(--muted)' }}>PILLAR / 02</span>
                  </div>
                  <div style={{ font: '800 24px var(--font-mono)', color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Coins size={22} color="var(--acid)" />
                    15 Club Treasuries
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Isolated split ledgers for all 15 Arya clubs. Event fees deposit directly into the club's fund, with central Dean oversight.
                  </p>
                </article>

                <article className="glass-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span className="ribbon">FEEDBACK</span>
                    <span style={{ font: '9px var(--font-mono)', color: 'var(--muted)' }}>PILLAR / 03</span>
                  </div>
                  <div style={{ font: '800 24px var(--font-mono)', color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={22} color="var(--acid)" />
                    Verified Kanban Loop
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Reviews open strictly to gate-verified attendees. Clubs respond publicly on the "You Said, We Did" resolution Kanban board.
                  </p>
                </article>

                <article className="glass-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span className="ribbon">DEGREE</span>
                    <span style={{ font: '9px var(--font-mono)', color: 'var(--muted)' }}>PILLAR / 04</span>
                  </div>
                  <div style={{ font: '800 24px var(--font-mono)', color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={22} color="var(--acid)" />
                    AICTE Honors Ledger
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Auto-credits activity points towards 100-point B.Tech honors degrees. Verifiable certificates with SHA-256 seals.
                  </p>
                </article>
              </div>
            </section>

            {/* 4. FEATURED EVENTS */}
            <section style={{ marginBottom: '80px' }}>
              <div className="kicker">02 / Live campus events</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
                <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 800, letterSpacing: '-0.06em', margin: 0, lineHeight: 1 }}>
                  Official Arya College Events.
                </h2>
                <Link to="/events" className="btn small ghost">
                  View All ({liveEvents.length}) →
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                {liveEvents.slice(0, 3).map((event) => {
                  const startStr = event.startTime || event.schedule?.startTime || '';
                  const isPaid = event.isPaid ?? event.ticketing?.isPaid ?? false;
                  const price = event.ticketPrice ?? event.ticketing?.ticketPrice ?? 0;

                  return (
                    <article key={event.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ height: '180px', position: 'relative', overflow: 'hidden', background: '#181816' }}>
                        <span className="ribbon" style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2 }}>
                          {isPaid ? `₹${price} / PAID` : 'FREE ENTRY'}
                        </span>
                        <img
                          src={event.bannerImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800'}
                          alt={event.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>

                      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ font: '9px var(--font-mono)', color: 'var(--muted)' }}>
                            {event.clubName}
                          </span>
                          <span style={{ font: '9px var(--font-mono)', color: 'var(--acid)', fontWeight: 800 }}>
                            +{event.activityPointsAwarded || 10} AICTE PTS
                          </span>
                        </div>

                        <h3 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.04em', margin: '6px 0 10px', lineHeight: 1.2 }}>
                          {event.title}
                        </h3>

                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '16px', flex: 1 }}>
                          {event.shortSummary}
                        </p>

                        <div className="stack-tags" style={{ marginBottom: '16px' }}>
                          <span className="stack-tag">{event.category || 'TECHNICAL'}</span>
                          <span className="stack-tag">{event.registrationType === 'TEAM' ? 'TEAM (2-4)' : 'SOLO'}</span>
                          <span className="stack-tag">{event.venueName || 'ARYA MAIN AUDITORIUM'}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`, paddingTop: '14px' }}>
                          <span style={{ font: '9px var(--font-mono)', color: 'var(--muted)' }}>
                            {startStr ? new Date(startStr).toLocaleDateString('en-IN') : 'Upcoming'}
                          </span>
                          <Link to="/events" className="btn small acid">
                            Register Pass →
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* 5. 15 ARYA COLLEGE CLUBS DIRECTORY */}
            <section style={{ marginBottom: '80px' }}>
              <div className="kicker">03 / The 15 Club Societies</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
                <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 800, letterSpacing: '-0.06em', margin: 0, lineHeight: 1 }}>
                  15 Clubs. 15 Dedicated Leaders.
                </h2>
                <Link to="/clubs" className="btn small ghost">
                  View All 15 Clubs Directory →
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                {clubs.slice(0, 6).map(club => (
                  <article key={club.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <img
                        src={club.logoUrl}
                        alt={club.name}
                        style={{ width: '38px', height: '38px', border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`, objectFit: 'cover' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.04em', margin: 0, lineHeight: 1.1 }}>
                          {club.name}
                        </h4>
                        <span style={{ font: '9px var(--font-mono)', color: 'var(--muted)' }}>
                          {club.category}
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px', flex: 1 }}>
                      {club.tagline}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`, paddingTop: '10px', font: '9px var(--font-mono)' }}>
                      <span>{club.memberCount} MEMBERS</span>
                      <span style={{ color: 'var(--acid)', fontWeight: 800 }}>
                        ★ AICTE RECOGNIZED
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* 6. COMPARISON: WHATSAPP VS CAMPUSSPHERE */}
            <section style={{ marginBottom: '80px' }}>
              <div className="kicker">04 / The Verification Standard</div>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 800, letterSpacing: '-0.06em', marginBottom: '32px', lineHeight: 1 }}>
                WhatsApp chaos.<br/><span style={{ color: 'var(--acid)' }}>CampusSphere delivers.</span>
              </h2>

              <div className="compare">
                <article className="compare-col">
                  <div className="compare-corner">UNVERIFIED / HIGH RISK</div>
                  <h3>WhatsApp & Google Sheets</h3>
                  <ul className="compare-list">
                    <li><span className="no">×</span><span>Screenshots shared on WhatsApp bypass gate checks</span></li>
                    <li><span className="no">×</span><span>Manual Google Form registrations lost or duplicated</span></li>
                    <li><span className="no">×</span><span>Club revenue pooled in personal UPI with zero accountability</span></li>
                    <li><span className="no">×</span><span>Zero real-time AICTE activity points ledger</span></li>
                    <li><span className="no">×</span><span>Student grievances lost in chats without resolution tracking</span></li>
                  </ul>
                  <div className="compare-note">THE RISK: PROXY ADMISSIONS & AUDIT FAILS</div>
                </article>

                <article className="compare-col good">
                  <div className="compare-corner">VERIFIED / READY TO RUN</div>
                  <h3>CampusSphere Operating System</h3>
                  <ul className="compare-list">
                    <li><span className="yes">✓</span><span>HMAC-SHA256 Rolling QR passes rotating every 30 seconds</span></li>
                    <li><span className="yes">✓</span><span>15 Dedicated Club Accounts with isolated split treasuries</span></li>
                    <li><span className="yes">✓</span><span>Verified attendee feedback loop with resolution Kanban</span></li>
                    <li><span className="yes">✓</span><span>Direct 100-Point AICTE activity transcript export</span></li>
                    <li><span className="yes">✓</span><span>3-Way Student Login by Email, RTU Roll No & Enrollment No</span></li>
                  </ul>
                  <div className="compare-note">THE GOAL: COMPLIANCE, SAFETY & EXCELLENCE</div>
                </article>
              </div>
            </section>

            {/* 7. 3D DIGITAL TWIN ANCHOR */}
            <section id="demo3d" style={{ marginBottom: '60px' }}>
              <div className="kicker">05 / Spatial campus exploration</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 800, letterSpacing: '-0.06em', margin: 0, lineHeight: 1 }}>
                  Arya 3D Digital Twin & Venue Explorer.
                </h2>
                <span style={{ font: '10px var(--font-mono)', color: 'var(--muted)' }}>
                  WebGL Hardware Accelerated
                </span>
              </div>

              <Campus3DExplorer />
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
