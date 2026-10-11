import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useClub } from '../context/ClubContext';
import { useAuth } from '../context/AuthContext';
import { fetchEvents } from '../services/api';
import { EventRegistrationModal } from '../components/EventRegistrationModal';
import { Event } from '../types';
import {
  Building2,
  Users,
  Calendar,
  Coins,
  Award,
  ShieldCheck,
  ExternalLink,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Clock,
  MapPin,
  UserCheck,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Send,
  Lock,
  Globe,
  Sliders,
  AlertCircle,
  Video,
  Bell,
  FileText,
  CheckSquare,
  ShieldAlert,
  BookOpen
} from 'lucide-react';

export const ClubDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { 
    getClubBySlug, 
    submitJoinApplication,
    getClubMembers,
    getClubMeetings,
    isUserMemberOfClub
  } = useClub();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'LEADERSHIP' | 'EVENTS' | 'TREASURY' | 'MEMBERS_HUB'>('OVERVIEW');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [selectedEventForModal, setSelectedEventForModal] = useState<Event | null>(null);

  // Application form state
  const [applicantRole, setApplicantRole] = useState('Core Technical Coordinator');
  const [sop, setSop] = useState('');
  const [semester, setSemester] = useState(currentUser?.studentProfile?.semester || 4);
  const [department, setDepartment] = useState(currentUser?.studentProfile?.department || 'Computer Science & Engineering');

  const club = slug ? getClubBySlug(slug) : undefined;

  if (!club) {
    return (
      <div style={{ maxWidth: '800px', margin: '80px auto', padding: '32px', textAlign: 'center' }} className="glass-panel">
        <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Club Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          No registered Arya College club exists matching identifier "{slug}".
        </p>
        <Link to="/clubs" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> Return to Master Clubs Directory
        </Link>
      </div>
    );
  }

  // Live club events from MongoDB Atlas
  const [clubEvents, setClubEvents] = useState<any[]>([]);

  React.useEffect(() => {
    if (!club) return;
    fetchEvents({ clubId: club.id })
      .then(setClubEvents)
      .catch(err => console.error('Failed to load club events:', err));
  }, [club?.id]);

  // Check if current user is admin of this club
  const isClubAdmin = currentUser?.role === 'CLUB_ADMIN' && currentUser?.administeredClubId === club.slug;
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const canManageTreasury = isClubAdmin || isSuperAdmin;

  // Membership & Meeting Segregation
  const userRoll = currentUser?.studentProfile?.rollNo;
  const userEmail = currentUser?.email;
  const isMember = club ? (
    isUserMemberOfClub(club.id, userRoll, userEmail) ||
    (currentUser?.role === 'CLUB_ADMIN' && currentUser?.administeredClubId === club.slug) ||
    currentUser?.role === 'SUPER_ADMIN'
  ) : false;

  const clubMeetings = club ? getClubMeetings(club.id) : [];
  const clubMembersList = club ? getClubMembers(club.id) : [];

  const todayYMD = new Date().toISOString().split('T')[0];
  const todayMeetings = clubMeetings.filter(m => {
    return m.meetingDateTime.split('T')[0] === todayYMD && m.status === 'SCHEDULED';
  });
  const upcomingMeetings = clubMeetings.filter(m => {
    return m.status === 'SCHEDULED' && m.meetingDateTime.split('T')[0] !== todayYMD;
  });
  const concludedMeetings = clubMeetings.filter(m => m.status === 'CONCLUDED' || !!m.summary);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in with your Arya College student credentials to apply.');
      return;
    }

    submitJoinApplication({
      clubId: club.id,
      clubName: club.name,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRollNo: currentUser.studentProfile?.rollNo || '22EACIT089',
      department,
      semester: Number(semester),
      preferredRole: applicantRole,
      statementOfPurpose: sop || `Enthusiastic to contribute to ${club.name} activities, workshops, and flagship sprints.`,
    });

    setApplicationSuccess(true);
    setTimeout(() => {
      setApplicationSuccess(false);
      setShowApplyModal(false);
      setSop('');
    }, 2500);
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '24px' }}>
      {/* Back button & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/clubs')}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            padding: '4px 8px',
            transition: 'color 0.2s',
          }}
        >
          <ArrowLeft size={16} /> All 15 Clubs
        </button>
        <span style={{ color: '#475569' }}>/</span>
        <span style={{ color: '#06b6d4', fontSize: '0.85rem', fontWeight: 600 }}>{club.name}</span>
      </div>

      {/* Hero Banner with Logo & Badges */}
      <div className="glass-panel" style={{ overflow: 'hidden', padding: 0, marginBottom: '28px', position: 'relative' }}>
        {/* Banner Image */}
        <div style={{ height: '260px', position: 'relative', overflow: 'hidden' }}>
          <img
            src={club.bannerUrl}
            alt={club.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, #0b132b 0%, rgba(11, 19, 43, 0.7) 50%, rgba(11, 19, 43, 0.2) 100%)',
          }} />

          {/* Category Pill on top right */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(6, 10, 20, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            padding: '6px 16px',
            borderRadius: '24px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <Sparkles size={14} color="#06b6d4" />
            {club.category}
          </div>
        </div>

        {/* Club Profile Info Bar */}
        <div style={{ padding: '0 32px 28px 32px', position: 'relative' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '20px',
            marginTop: '-60px',
            marginBottom: '20px',
          }}>
            {/* Logo & Identity */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{
                width: '110px',
                height: '110px',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '4px solid #0b132b',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                background: '#0b132b',
              }}>
                <img
                  src={club.logoUrl}
                  alt={club.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                    {club.name}
                  </h1>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#34d399',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '20px',
                  }}>
                    <ShieldCheck size={13} />
                    Verified ACEIT Chapter
                  </span>
                </div>
                <p style={{ color: 'var(--acid)', fontSize: '1rem', fontWeight: 600, marginTop: '4px' }}>
                  "{club.tagline}"
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {canManageTreasury && (
                <Link
                  to="/club-admin"
                  className="btn-gold"
                  style={{
                    padding: '12px 22px',
                    fontSize: '0.9rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 0 20px rgba(245, 158, 11, 0.35)',
                  }}
                >
                  <Coins size={18} />
                  Manage Dedicated Treasury
                </Link>
              )}

              <button
                onClick={() => setShowApplyModal(true)}
                className="btn-primary"
                style={{
                  padding: '12px 22px',
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <UserCheck size={18} />
                Apply to Join Club
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            padding: '16px 20px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Members
              </span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                {club.memberCount} Students
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Events Hosted
              </span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                {club.eventsHostedCount} Flagship Fests
              </div>
            </div>

            {canManageTreasury ? (
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Dedicated Treasury (Admin View)
                </span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--acid)', fontFamily: 'var(--font-mono)' }}>
                  ₹{club.treasury.availableBalance.toLocaleString()}
                </div>
              </div>
            ) : (
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  AICTE Activity Credits
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                  Up to 50 Pts/Yr
                </div>
              </div>
            )}

            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Recruitment Status
              </span>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '4px',
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                Open for Spring 2026
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '0 24px',
          gap: '8px',
          background: 'rgba(6, 10, 20, 0.4)',
          overflowX: 'auto',
        }}>
          {[
            { id: 'OVERVIEW', label: 'Club Overview & Manifesto', icon: Building2 },
            { id: 'LEADERSHIP', label: 'Faculty & Student Leads', icon: Users },
            { id: 'EVENTS', label: `Club Events (${clubEvents.length})`, icon: Calendar },
            { 
              id: 'MEMBERS_HUB', 
              label: isMember 
                ? `🔒 Internal Members Hub (${clubMeetings.length})` 
                : '🔒 Internal Members Hub (Locked)', 
              icon: Lock 
            },
            ...(canManageTreasury ? [{ id: 'TREASURY', label: 'Treasury & Financial Audit (Admin)', icon: Coins }] : []),
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
                  padding: '16px 20px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '3px solid var(--acid2)' : '3px solid transparent',
                  color: isActive ? 'var(--acid)' : '#94a3b8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {/* 1. OVERVIEW TAB */}
      {activeTab === 'OVERVIEW' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {/* Manifesto & Purpose */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={18} color="#06b6d4" />
              Club Mission & Domain Focus
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '24px' }}>
              {club.description}
            </p>

            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Weekly Routine & Assembly Venue
            </h4>
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid var(--card-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                <Clock size={16} color="var(--acid)" />
                <span>Regular Meetup: <strong>Every Wednesday at 4:30 PM</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                <MapPin size={16} color="#06b6d4" />
                <span>Venue: <strong>Turing Advanced Computing Lab (Block B, 2nd Floor)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                <Award size={16} color="#10b981" />
                <span>Eligible for: <strong>AICTE / RTU Activity Points (10-25 pts per event)</strong></span>
              </div>
            </div>
          </div>

          {/* Faculty In-Charge & Social Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Faculty Card */}
            <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #06b6d4' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Faculty Coordinator & Mentor
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0284c7, #0f172a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #06b6d4',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}>
                  {club.facultyCoordinator.charAt(4) || 'F'}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {club.facultyCoordinator}
                  </h4>
                  <div style={{ fontSize: '0.82rem', color: '#0284c7', marginTop: '2px', fontWeight: 600 }}>
                    Institutional Mentor — Arya College of Engineering & IT
                  </div>
                </div>
              </div>
            </div>

            {/* Official Social & Repository Links */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
                Official Communication Channels
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {club.socialLinks.github && (
                  <a
                    href={club.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Github size={16} /> GitHub Organization
                    </span>
                    <ExternalLink size={14} color="var(--text-secondary)" />
                  </a>
                )}

                {club.socialLinks.instagram && (
                  <a
                    href={club.socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Instagram size={16} color="#e1306c" /> Instagram Handle
                    </span>
                    <ExternalLink size={14} color="var(--text-secondary)" />
                  </a>
                )}

                {club.socialLinks.linkedin && (
                  <a
                    href={club.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Linkedin size={16} color="#0077b5" /> LinkedIn Page
                    </span>
                    <ExternalLink size={14} color="var(--text-secondary)" />
                  </a>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Mail size={16} color="var(--acid)" /> Official Email
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    {club.slug}@aryacollege.in
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LEADERSHIP TAB */}
      {activeTab === 'LEADERSHIP' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Executive Student Board & Coordinators
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                Elected coordinators driving student workshops, logistics, tech operations, and hackathons.
              </p>
            </div>

            {canManageTreasury && (
              <Link to="/club-admin" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                <Sliders size={14} /> Manage Coordinators Roster
              </Link>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {/* Student Leads from seed */}
            {club.studentLeads.map((lead, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, var(--acid2), #b45309)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0b132b',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
                }}>
                  {lead.charAt(0)}
                </div>

                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {lead}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--acid)', fontWeight: 600, marginTop: '2px' }}>
                    {idx === 0 ? 'Club President' : 'Executive Tech Lead'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Computer Science & Engineering • 2026 Batch
                  </div>
                </div>
              </div>
            ))}

            {/* Additional mock coordinators if empty */}
            <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0b132b',
                fontWeight: 800,
                fontSize: '1.1rem',
              }}>
                A
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Aarav Mathur
                </h4>
                <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600, marginTop: '2px' }}>
                  Event Operations Lead
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Information Technology • 2026 Batch
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #10b981, #047857)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0b132b',
                fontWeight: 800,
                fontSize: '1.1rem',
              }}>
                K
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Kavita Joshi
                </h4>
                <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                  PR & Sponsorship Head
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Electronics & Comm • 2026 Batch
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. EVENTS TAB */}
      {activeTab === 'EVENTS' && (
        <div>
          {clubEvents.length === 0 ? (
            <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
              <Calendar size={40} color="var(--text-secondary)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                No Active Events Scheduled
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>
                {club.name} is preparing new event proposals. Check back soon!
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
              {clubEvents.map(event => (
                <div key={event.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '160px', position: 'relative' }}>
                    <img
                      src={event.bannerImage}
                      alt={event.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(6, 10, 20, 0.85)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--acid)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                    }}>
                      +{event.activityPointsAwarded} AICTE Pts
                    </div>
                  </div>

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#0284c7', marginBottom: '6px', fontWeight: 600 }}>
                      <Calendar size={13} />
                      {new Date(event.schedule.startTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>

                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                      {event.title}
                    </h4>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '16px', flex: 1 }}>
                      {event.shortSummary}
                    </p>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid var(--card-border)',
                      paddingTop: '14px',
                    }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Fee:</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: event.ticketing.isPaid ? 'var(--acid)' : '#059669', fontFamily: 'var(--font-mono)' }}>
                          {event.ticketing.isPaid ? `₹${event.ticketing.ticketPrice}` : 'Free Entry'}
                        </div>
                      </div>

                      {canManageTreasury ? (
                        <Link to="/club-admin" className="btn-gold" style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ShieldCheck size={14} /> Gate Console
                        </Link>
                      ) : (
                        <button
                          onClick={() => setSelectedEventForModal(event)}
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                        >
                          Register Pass
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. TREASURY AUDIT TAB */}
      {activeTab === 'TREASURY' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Dedicated Club Treasury Transparency
                </h3>
                <span className="badge-status badge-status-approved">Audited Ledger</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                Under CampusSphere institutional rules, this club's ticket collections remain strictly isolated in its dedicated treasury.
              </p>
            </div>

            {canManageTreasury && (
              <Link to="/club-admin" className="btn-gold" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                <Coins size={16} /> Open Treasury & Payout Console
              </Link>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Available Balance</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--acid)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                ₹{club.treasury.availableBalance.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '2px' }}>Ready for club activities</div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>All-Time Collection</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                ₹{club.treasury.totalRevenue.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>From tickets & registrations</div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Pending Settlements</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f97316', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                ₹{club.treasury.pendingSettlement.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>Disbursements awaiting Dean seal</div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Registered Payout UPI ID</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0', fontFamily: 'var(--font-mono)', marginTop: '8px', wordBreak: 'break-all' }}>
                {club.treasury.payoutUpiId}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#06b6d4', marginTop: '4px' }}>Verified Institutional VPA</div>
            </div>
          </div>

          <div style={{
            background: 'rgba(6, 182, 212, 0.05)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <ShieldCheck size={24} color="#06b6d4" />
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              <strong>Institutional Split-Accounting Guarantee:</strong> All event registration fees processed via Razorpay gateway credit directly to this club's verified account. No pooling across other clubs. Dean Dr. Sharma maintains centralized read-only audit log.
            </div>
          </div>
        </div>
      )}

      {/* TAB: INTERNAL CLUB MEMBERS HUB & MoM ARCHIVE */}
      {activeTab === 'MEMBERS_HUB' && (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {!isMember ? (
            /* ACCESS LOCKED FOR REGULAR / NON-INDUCTED STUDENTS */
            <div className="glass-panel" style={{ padding: '48px 32px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.35)', position: 'relative' }}>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <Lock size={32} color="#f87171" />
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 14px',
                borderRadius: '20px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '14px',
              }}>
                <ShieldAlert size={14} /> Confidential Internal Governance
              </div>

              <h3 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
                Restricted to Inducted {club.name} Members Only
              </h3>

              <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto 24px' }}>
                Internal club meetings, confidential sprint agendas, today's meeting notification alerts, and Minutes of Meeting (MoM) summaries are strictly reserved for verified inducted members of {club.name}. Normal students and non-members are not permitted to view internal club proceedings.
              </p>

              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '14px',
                padding: '20px 24px',
                textAlign: 'left',
                maxWidth: '600px',
                margin: '0 auto 28px',
                fontSize: '0.84rem',
                color: '#cbd5e1',
                lineHeight: 1.6,
              }}>
                <div style={{ fontWeight: 800, color: '#fbbf24', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} /> How to gain authorized member access:
                </div>
                <div>
                  1. <strong>Already an inducted member?</strong> Verify that you are logged into CampusSphere using your University Roll No (<code>{userRoll || 'Not logged in'}</code>) or your institutional email (<code>{userEmail || 'Not logged in'}</code>).
                </div>
                <div style={{ marginTop: '8px' }}>
                  2. <strong>Want to join {club.name}?</strong> Submit an application through the recruitment window or ask your Club Admin to induct your Roll Number into the active roster.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="btn-gold"
                  style={{ padding: '10px 24px', fontSize: '0.88rem' }}
                >
                  Apply to Join {club.name}
                </button>
                <button
                  onClick={() => setActiveTab('OVERVIEW')}
                  className="btn-secondary"
                  style={{ padding: '10px 20px', fontSize: '0.88rem' }}
                >
                  Back to Public Overview
                </button>
              </div>
            </div>
          ) : (
            /* UNLOCKED FOR INDUCTED CLUB MEMBERS & ADMINS */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Member Verification Badge & Top Hub Banner */}
              <div className="glass-panel" style={{ padding: '28px', borderLeft: '4px solid #10b981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                      <CheckCircle2 size={15} /> Verified Inducted Member Console
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {club.name} Internal Members Hub
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.84rem', marginTop: '4px' }}>
                      Logged in as <strong>{currentUser?.name}</strong> ({userRoll || userEmail}) • You have access to internal meetings, today's alerts, and MoM summaries.
                    </p>
                  </div>

                  <span style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34d399',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}>
                    Member Access Active
                  </span>
                </div>
              </div>

              {/* TODAY'S MEETING NOTIFICATION ALERT BANNER */}
              {todayMeetings.length > 0 && (
                <div style={{
                  padding: '24px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.1) 100%)',
                  border: '2px solid #f59e0b',
                  boxShadow: '0 8px 30px rgba(245, 158, 11, 0.15)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#f59e0b',
                      color: '#0b132b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'pulse 2s infinite',
                    }}>
                      <Bell size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fbbf24', margin: 0 }}>
                        🚨 TODAY'S INTERNAL CLUB MEETING NOTIFICATION!
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: 0 }}>
                        All inducted members are requested to attend today's scheduled session.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {todayMeetings.map(meeting => {
                      const meetDate = new Date(meeting.meetingDateTime);
                      return (
                        <div
                          key={meeting.id}
                          style={{
                            background: 'rgba(15, 23, 42, 0.7)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: '12px',
                            padding: '18px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                            <div>
                              <h5 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                                {meeting.title}
                              </h5>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', fontSize: '0.82rem', color: '#fbbf24', flexWrap: 'wrap' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <Clock size={14} /> Today at {meetDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  {meeting.isOnline ? <Video size={14} /> : <MapPin size={14} />} {meeting.location}
                                </span>
                              </div>
                            </div>

                            {meeting.isOnline && meeting.meetingLink && (
                              <a
                                href={meeting.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-gold"
                                style={{
                                  fontSize: '0.82rem',
                                  padding: '8px 16px',
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                }}
                              >
                                <Video size={14} /> Join Meeting Now <ExternalLink size={12} />
                              </a>
                            )}
                          </div>

                          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '12px', lineHeight: 1.5 }}>
                            <strong>Agenda:</strong> {meeting.agenda}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* UPCOMING SCHEDULED MEETINGS */}
              {upcomingMeetings.length > 0 && (
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={18} color="#38bdf8" /> Upcoming Internal Meetings ({upcomingMeetings.length})
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    {upcomingMeetings.map(meeting => {
                      const meetDate = new Date(meeting.meetingDateTime);
                      return (
                        <div
                          key={meeting.id}
                          className="glass-card"
                          style={{ padding: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                        >
                          <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                            {meeting.title}
                          </h5>
                          <div style={{ fontSize: '0.78rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                            <Clock size={13} /> {meetDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} at {meetDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
                            {meeting.isOnline ? <Video size={13} /> : <MapPin size={13} />} {meeting.location}
                          </div>
                          <p style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.4, margin: 0 }}>
                            {meeting.agenda}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MINUTES OF MEETING (MoM) ARCHIVE FOR ABSENT MEMBERS */}
              <div className="glass-panel" style={{ padding: '28px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '0.8rem', fontWeight: 800, marginBottom: '4px' }}>
                    <BookOpen size={16} />
                    <span>MINUTES OF MEETING (MoM) ARCHIVE</span>
                  </div>
                  <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Meeting Summaries for Absent & Attending Members
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.84rem', marginTop: '4px' }}>
                    Did you miss a recent meeting? Review the official discussion points, finalized resolutions, and assigned tasks below so you stay completely up to date with club proceedings.
                  </p>
                </div>

                {concludedMeetings.length === 0 ? (
                  <div style={{ padding: '36px 16px', textAlign: 'center', color: '#94a3b8', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px' }}>
                    <FileText size={32} color="#64748b" style={{ margin: '0 auto 8px', opacity: 0.6 }} />
                    <p style={{ fontSize: '0.85rem' }}>No past meeting summaries recorded yet. The Club Admin will publish MoM summaries here after each session concludes.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {concludedMeetings.map(meeting => {
                      const meetDate = new Date(meeting.meetingDateTime);
                      const summary = meeting.summary;

                      return (
                        <div
                          key={meeting.id}
                          className="glass-card"
                          style={{
                            padding: '24px',
                            border: '1px solid rgba(52, 211, 153, 0.3)',
                            background: 'rgba(15, 23, 42, 0.75)',
                            borderRadius: '16px',
                          }}
                        >
                          {/* MoM Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <h5 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                                  {meeting.title}
                                </h5>
                                <span style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  color: '#34d399',
                                  background: 'rgba(16, 185, 129, 0.15)',
                                  border: '1px solid rgba(16, 185, 129, 0.3)',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                }}>
                                  MoM Concluded
                                </span>
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                                Held on {meetDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {meeting.location}
                              </div>
                            </div>

                            {summary && (
                              <div style={{
                                background: 'rgba(56, 189, 248, 0.1)',
                                border: '1px solid rgba(56, 189, 248, 0.25)',
                                color: '#38bdf8',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                              }}>
                                👥 {summary.attendanceCount} Members Attended
                              </div>
                            )}
                          </div>

                          {summary ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {/* 1. Key Discussions */}
                              <div style={{
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '12px',
                                padding: '16px',
                              }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fbbf24', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  📌 Key Discussions Covered
                                </div>
                                <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                  {Array.isArray(summary.keyDiscussions) ? summary.keyDiscussions.join('\n') : summary.keyDiscussions}
                                </div>
                              </div>

                              {/* 2. Decisions Finalized */}
                              <div style={{
                                background: 'rgba(16, 185, 129, 0.06)',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                borderRadius: '12px',
                                padding: '16px',
                              }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#34d399', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  ⚖️ Finalized Decisions & Resolutions
                                </div>
                                <div style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                  {Array.isArray(summary.decisionsFinalized) ? summary.decisionsFinalized.join('\n') : summary.decisionsFinalized}
                                </div>
                              </div>

                              {/* 3. Action Items / Tasks Assigned */}
                              {summary.actionItems && summary.actionItems.length > 0 && (
                                <div style={{
                                  background: 'rgba(99, 102, 241, 0.06)',
                                  border: '1px solid rgba(99, 102, 241, 0.2)',
                                  borderRadius: '12px',
                                  padding: '16px',
                                }}>
                                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#a78bfa', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    ✅ Assigned Action Items & Next Tasks ({summary.actionItems.length})
                                  </div>

                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                                    {summary.actionItems.map(item => (
                                      <div
                                        key={item.id}
                                        style={{
                                          background: 'rgba(15, 23, 42, 0.7)',
                                          border: '1px solid rgba(255, 255, 255, 0.08)',
                                          borderRadius: '8px',
                                          padding: '10px 14px',
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          gap: '8px',
                                        }}
                                      >
                                        <div>
                                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                            {item.task}
                                          </div>
                                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                                            Assignee: <strong style={{ color: '#38bdf8' }}>{item.assignee || 'Core Member'}</strong>
                                          </div>
                                        </div>

                                        <span style={{
                                          fontSize: '0.7rem',
                                          fontWeight: 700,
                                          fontFamily: 'var(--font-mono)',
                                          color: '#fbbf24',
                                          background: 'rgba(245, 158, 11, 0.1)',
                                          padding: '2px 6px',
                                          borderRadius: '4px',
                                          whiteSpace: 'nowrap',
                                        }}>
                                          Due: {item.dueDate}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* 4. Document / Drive Link */}
                              {summary.documentUrl && (
                                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
                                  <a
                                    href={summary.documentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      color: '#38bdf8',
                                      fontSize: '0.78rem',
                                      fontWeight: 700,
                                      textDecoration: 'none',
                                    }}
                                  >
                                    <ExternalLink size={13} /> Open Official MoM Document / Drive Notes
                                  </a>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic' }}>
                              Meeting agenda: {meeting.agenda} (Detailed MoM summary pending publication by admin)
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* JOIN CLUB MODAL */}
      {showApplyModal && (
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
          <div className="glass-panel" style={{ maxWidth: '540px', width: '100%', padding: '32px', position: 'relative' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Join {club.name}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Submit your formal application to the club executive board for Spring 2026.
            </p>

            {applicationSuccess ? (
              <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Application Submitted Successfully!
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  The {club.name} board will review your application. Check back on your student portal for status updates.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                    Applicant Name & Roll Number
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${currentUser?.name || 'Govind Jangid'} (${currentUser?.studentProfile?.rollNo || '22EACIT089'})`}
                    className="glass-input"
                    style={{ background: 'rgba(255, 255, 255, 0.03)', color: '#94a3b8' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                      Department / Branch
                    </label>
                    <select
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      className="glass-input"
                    >
                      <option value="Computer Science & Engineering">CSE</option>
                      <option value="Information Technology">IT</option>
                      <option value="AI & Data Science">AI & DS</option>
                      <option value="Electronics & Communication">ECE</option>
                      <option value="Electrical Engineering">EE</option>
                      <option value="Mechanical Engineering">ME</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                      Current Semester
                    </label>
                    <select
                      value={semester}
                      onChange={e => setSemester(Number(e.target.value))}
                      className="glass-input"
                    >
                      <option value="2">Sem 2 (1st Year)</option>
                      <option value="4">Sem 4 (2nd Year)</option>
                      <option value="6">Sem 6 (3rd Year)</option>
                      <option value="8">Sem 8 (4th Year)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                    Preferred Role / Domain
                  </label>
                  <select
                    value={applicantRole}
                    onChange={e => setApplicantRole(e.target.value)}
                    className="glass-input"
                  >
                    <option value="Core Technical Coordinator">Core Technical Coordinator</option>
                    <option value="Competitive Programming & Mentorship">Competitive Programming & Mentorship</option>
                    <option value="Event Logistics & Stage Manager">Event Logistics & Stage Manager</option>
                    <option value="PR, Social Media & Design Lead">PR, Social Media & Design Lead</option>
                    <option value="Sponsorship & Industry Outreach">Sponsorship & Industry Outreach</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                    Statement of Purpose / Why do you want to join?
                  </label>
                  <textarea
                    rows={3}
                    value={sop}
                    onChange={e => setSop(e.target.value)}
                    placeholder="Briefly describe your relevant skills, projects, or why you'd like to join this club..."
                    className="glass-input"
                    style={{ resize: 'vertical' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
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
                    className="btn-primary"
                    style={{ padding: '10px 22px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Send size={16} /> Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* EVENT REGISTRATION & RAZORPAY MODAL */}
      {selectedEventForModal && (
        <EventRegistrationModal
          isOpen={!!selectedEventForModal}
          onClose={() => setSelectedEventForModal(null)}
          event={selectedEventForModal}
        />
      )}
    </div>
  );
};
