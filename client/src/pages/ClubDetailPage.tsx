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
  AlertCircle
} from 'lucide-react';

export const ClubDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getClubBySlug, submitJoinApplication } = useClub();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'LEADERSHIP' | 'EVENTS' | 'TREASURY'>('OVERVIEW');
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
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
          Club Not Found
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
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
                  <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', margin: 0 }}>
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
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={18} color="#06b6d4" />
              Club Mission & Domain Focus
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '24px' }}>
              {club.description}
            </p>

            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Weekly Routine & Assembly Venue
            </h4>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0', fontSize: '0.88rem' }}>
                <Clock size={16} color="var(--acid)" />
                <span>Regular Meetup: <strong>Every Wednesday at 4:30 PM</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0', fontSize: '0.88rem' }}>
                <MapPin size={16} color="#06b6d4" />
                <span>Venue: <strong>Turing Advanced Computing Lab (Block B, 2nd Floor)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0', fontSize: '0.88rem' }}>
                <Award size={16} color="#10b981" />
                <span>Eligible for: <strong>AICTE / RTU Activity Points (10-25 pts per event)</strong></span>
              </div>
            </div>
          </div>

          {/* Faculty In-Charge & Social Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Faculty Card */}
            <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #06b6d4' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
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
                  color: '#f8fafc',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}>
                  {club.facultyCoordinator.charAt(4) || 'F'}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    {club.facultyCoordinator}
                  </h4>
                  <div style={{ fontSize: '0.82rem', color: '#38bdf8', marginTop: '2px' }}>
                    Institutional Mentor — Arya College of Engineering & IT
                  </div>
                </div>
              </div>
            </div>

            {/* Official Social & Repository Links */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
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
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Github size={16} /> GitHub Organization
                    </span>
                    <ExternalLink size={14} color="#94a3b8" />
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
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Instagram size={16} color="#e1306c" /> Instagram Handle
                    </span>
                    <ExternalLink size={14} color="#94a3b8" />
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
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Linkedin size={16} color="#0077b5" /> LinkedIn Page
                    </span>
                    <ExternalLink size={14} color="#94a3b8" />
                  </a>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.85rem',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Mail size={16} color="var(--acid)" /> Official Email
                  </span>
                  <span style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Executive Student Board & Coordinators
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
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
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    {lead}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--acid)', fontWeight: 600, marginTop: '2px' }}>
                    {idx === 0 ? 'Club President' : 'Executive Tech Lead'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
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
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                  Aarav Mathur
                </h4>
                <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600, marginTop: '2px' }}>
                  Event Operations Lead
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
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
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                  Kavita Joshi
                </h4>
                <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600, marginTop: '2px' }}>
                  PR & Sponsorship Head
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
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
              <Calendar size={40} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
                No Active Events Scheduled
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '6px' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#38bdf8', marginBottom: '6px' }}>
                      <Calendar size={13} />
                      {new Date(event.schedule.startTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>

                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
                      {event.title}
                    </h4>

                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '16px', flex: 1 }}>
                      {event.shortSummary}
                    </p>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      paddingTop: '14px',
                    }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Fee:</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: event.ticketing.isPaid ? 'var(--acid)' : '#34d399', fontFamily: 'var(--font-mono)' }}>
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
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Dedicated Club Treasury Transparency
                </h3>
                <span className="badge-status badge-status-approved">Audited Ledger</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
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
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
              Join {club.name}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>
              Submit your formal application to the club executive board for Spring 2026.
            </p>

            {applicationSuccess ? (
              <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
                  Application Submitted Successfully!
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
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
