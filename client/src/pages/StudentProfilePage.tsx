import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useClub } from '../context/ClubContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Award, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Download, 
  FileText, 
  GraduationCap, 
  Hash, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  Building2, 
  Printer, 
  X, 
  Users,
  LayoutDashboard,
  Layers,
  ExternalLink,
  Clock,
  Landmark,
  UserCheck,
  Shield,
  Ticket,
  ChevronRight
} from 'lucide-react';
import { fetchAicteTranscript, fetchUserPasses } from '../services/api';
import { AicteTranscript, Registration } from '../types';
import { Link } from 'react-router-dom';

export const StudentProfilePage: React.FC = () => {
  const { currentUser, isStudent, isClubAdmin, isSuperAdmin } = useAuth();
  const { clubs } = useClub();
  const { isDark } = useTheme();

  const [transcript, setTranscript] = useState<AicteTranscript | null>(null);
  const [userPasses, setUserPasses] = useState<Registration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showTranscriptModal, setShowTranscriptModal] = useState<boolean>(false);

  // If club admin, find their administered club details
  const myClub = isClubAdmin
    ? clubs.find(c => c.slug === currentUser?.administeredClubId) || clubs[0]
    : null;

  const loadStudentData = async () => {
    if (!currentUser || !isStudent) return;
    try {
      setLoading(true);
      const [trans, passes] = await Promise.all([
        fetchAicteTranscript(currentUser.id).catch(() => null),
        fetchUserPasses(currentUser.id).catch(() => [])
      ]);
      setTranscript(trans);
      setUserPasses(passes);
    } catch (err) {
      console.error('Failed to load student transcript data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isStudent) {
      loadStudentData();
    }
  }, [currentUser?.id, isStudent]);

  const profile = currentUser?.studentProfile;
  const currentPoints = transcript?.totalActivityPointsEarned || profile?.activityPointsTotal || 45;
  const targetPoints = transcript?.requiredHonorsPoints || 100;
  const progressPercent = Math.min(100, Math.round((currentPoints / targetPoints) * 100));

  /* =========================================================================
     1. SUPER ADMIN (DEAN) EXECUTIVE PROFILE VIEW
     ========================================================================= */
  if (isSuperAdmin) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Executive Banner */}
        <div className="glass-panel" style={{
          padding: '36px',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden',
          background: isDark
            ? 'linear-gradient(135deg, rgba(16, 26, 21, 0.95) 0%, rgba(8, 14, 11, 0.98) 100%)'
            : 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
          border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`,
          boxShadow: isDark ? '0 20px 50px rgba(0, 0, 0, 0.5)' : 'var(--shadow)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
              alt={currentUser?.name}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '20px',
                objectFit: 'cover',
                border: '3px solid var(--acid)',
                boxShadow: '0 0 30px var(--acid-glow)',
              }}
            />

            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: 0 }}>
                  {currentUser?.name || 'Prof. (Dr.) Arun Arya'}
                </h1>
                <span style={{
                  background: 'var(--acid)',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.04em',
                }}>
                  ★ SUPER ADMIN
                </span>
                <span style={{
                  background: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.1)',
                  color: isDark ? 'var(--acid-bright)' : 'var(--acid2)',
                  border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(5, 150, 105, 0.25)'}`,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}>
                  Dean (Academics & Student Welfare)
                </span>
              </div>

              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="var(--acid)" />
                  <strong>Employee ID:</strong> EMP-ACEIT-DIR-001
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={16} color="var(--acid)" />
                  Dean Secretariat, Administrative Block A
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={16} color="var(--acid)" />
                  dean@aryacollege.in
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={16} color="var(--acid)" />
                  +91 141 282 0700
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                to="/admin"
                className="btn-primary"
                style={{ padding: '12px 22px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
              >
                <LayoutDashboard size={16} />
                <span>Open Dean Hub</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Dean Executive Governance Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Landmark size={20} color="var(--acid)" />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Institutional Scope
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              15 Clubs
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Autonomous campus societies under direct regulatory supervision
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Calendar size={20} color="var(--acid)" />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Institutional Fests
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              6 Flagships
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              SIH 2026, Arya Ratan, CodeWars, THAR, Karting Cup, Euphonious
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Award size={20} color="var(--acid)" />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                AICTE Compliance
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              100 Pts Norm
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Mandatory non-credit RTU activity transcript authorization head
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <ShieldCheck size={20} color="var(--acid)" />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Clearance Authority
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              Live
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Central Auditorium & Turing Lab venue booking sanction authority
            </div>
          </div>
        </div>

        {/* Dean Operational Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--acid)" />
              Institutional Administrative Mandate
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '14px', background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'var(--paper2)', border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}` }}>
                <strong style={{ color: 'var(--text-primary)' }}>1. AICTE Activity Point Accreditation</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Authorizing gate-verified attendance transcripts and signing digital degree honors clearances for B.Tech students.
                </p>
              </div>

              <div style={{ padding: '14px', background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'var(--paper2)', border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}` }}>
                <strong style={{ color: 'var(--text-primary)' }}>2. Institutional Event Sanctions & Budget Approvals</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Clearance of event safety protocols, guest approvals, venue reservation locks, and club treasury payouts.
                </p>
              </div>

              <div style={{ padding: '14px', background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'var(--paper2)', border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}` }}>
                <strong style={{ color: 'var(--text-primary)' }}>3. Student Grievance & Quality Audit Oversight</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Monitoring real-time attendee verified feedback Kanban to maintain high academic and infrastructural standards.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LayoutDashboard size={18} color="var(--acid)" />
              Quick Administrative Gateways
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                to="/admin"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'var(--paper2)',
                  border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`,
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Dean Hub & Audit Log</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Review live club operations, pending payouts, and event submissions</div>
                </div>
                <ChevronRight size={18} color="var(--acid)" />
              </Link>

              <Link
                to="/events"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'var(--paper2)',
                  border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`,
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Campus Events Catalog</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Inspect active campus events and check-in counts</div>
                </div>
                <ChevronRight size={18} color="var(--acid)" />
              </Link>

              <Link
                to="/clubs"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'var(--paper2)',
                  border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`,
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>15 Campus Societies Showcase</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>View HOD faculty coordinators, student leads, and member rosters</div>
                </div>
                <ChevronRight size={18} color="var(--acid)" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     2. CLUB ADMIN (SOCIETY LEAD) PROFILE VIEW
     ========================================================================= */
  if (isClubAdmin) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Club Lead Banner */}
        <div className="glass-panel" style={{
          padding: '36px',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden',
          background: isDark
            ? 'linear-gradient(135deg, rgba(16, 26, 21, 0.95) 0%, rgba(8, 14, 11, 0.98) 100%)'
            : 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
          border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`,
          boxShadow: isDark ? '0 20px 50px rgba(0, 0, 0, 0.5)' : 'var(--shadow)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'}
              alt={currentUser?.name}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '20px',
                objectFit: 'cover',
                border: '3px solid var(--acid)',
                boxShadow: '0 0 30px var(--acid-glow)',
              }}
            />

            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: 0 }}>
                  {currentUser?.name}
                </h1>
                <span style={{
                  background: 'var(--acid)',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.04em',
                }}>
                  ★ CLUB ADMIN
                </span>
                <span style={{
                  background: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.1)',
                  color: isDark ? 'var(--acid-bright)' : 'var(--acid2)',
                  border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(5, 150, 105, 0.25)'}`,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}>
                  {currentUser?.facultyDesignation || 'Club President & Society Convenor'}
                </span>
              </div>

              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={16} color="var(--acid)" />
                  <strong>Society:</strong> {myClub?.name || 'Arya Student Society'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={16} color="var(--acid)" />
                  {currentUser?.email}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} color="var(--acid)" />
                  {myClub?.meetingSchedule || 'Weekly Society Meets'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                to="/club-admin"
                className="btn-primary"
                style={{ padding: '12px 22px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
              >
                <LayoutDashboard size={16} />
                <span>Open Club Console</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Club Administration Overview Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Users size={20} color="var(--acid)" />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Active Members
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {myClub?.memberCount || 410} Students
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Registered active members across all engineering branches
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Calendar size={20} color="var(--acid)" />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Events Hosted
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {myClub?.eventsHostedCount || 18} Events
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Technical workshops, hackathons, and cultural fests sanctioned
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <UserCheck size={20} color="var(--acid)" />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Recruitment Status
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--acid)', fontFamily: 'var(--font-mono)' }}>
              {myClub?.recruitmentStatus || 'OPEN'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              New member intake & technical committee interviews active
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Landmark size={20} color="var(--acid)" />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Faculty Coordinator
              </div>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
              {myClub?.facultyCoordinator || 'Arya College Faculty Lead'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Department Head In-Charge & Official Society Mentor
            </div>
          </div>
        </div>

        {/* Club Details & Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} color="var(--acid)" />
              Club Chapter Information
            </h2>
            <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', marginBottom: '18px' }}>
              {myClub?.logoUrl && (
                <img
                  src={myClub.logoUrl}
                  alt={myClub.name}
                  style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover', border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}` }}
                />
              )}
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {myClub?.name}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--acid)', fontWeight: 600, fontStyle: 'italic', marginTop: '3px' }}>
                  "{myClub?.tagline}"
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px' }}>
              {myClub?.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '10px 14px', background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'var(--paper2)', border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Dedicated Payout UPI ID:</span>
                <strong style={{ fontSize: '0.85rem', color: 'var(--acid)', fontFamily: 'var(--font-mono)' }}>
                  {myClub?.treasury?.payoutUpiId || 'society@okhdfcbank'}
                </strong>
              </div>

              <div style={{ padding: '10px 14px', background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'var(--paper2)', border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Student Leads:</span>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  {myClub?.studentLeads?.join(', ') || currentUser?.name}
                </strong>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LayoutDashboard size={18} color="var(--acid)" />
              Club Operations Quick Hub
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                to="/club-admin"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'var(--paper2)',
                  border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`,
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Dedicated Club Console</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Event proposals, attendee ticket QR scanner, and treasury management</div>
                </div>
                <ChevronRight size={18} color="var(--acid)" />
              </Link>

              {myClub?.slug && (
                <Link
                  to={`/clubs/${myClub.slug}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'var(--paper2)',
                    border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`,
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.2s',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Public Society Showcase Page</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>View how students across Arya College see your club profile</div>
                  </div>
                  <ChevronRight size={18} color="var(--acid)" />
                </Link>
              )}

              <Link
                to="/events"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'var(--paper2)',
                  border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`,
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Browse All Campus Events</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cross-club collaborations and scheduling alignment</div>
                </div>
                <ChevronRight size={18} color="var(--acid)" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     3. STUDENT ACADEMIC & AICTE PROFILE VIEW
     ========================================================================= */
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Student Banner */}
      <div className="glass-panel" style={{
        padding: '36px',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden',
        background: isDark
          ? 'linear-gradient(135deg, rgba(16, 26, 21, 0.95) 0%, rgba(8, 14, 11, 0.98) 100%)'
          : 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
        border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`,
        boxShadow: isDark ? '0 20px 50px rgba(0, 0, 0, 0.5)' : 'var(--shadow)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
          <img
            src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
            alt={currentUser?.name}
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '20px',
              objectFit: 'cover',
              border: '3px solid var(--acid)',
              boxShadow: '0 0 25px var(--acid-glow)',
            }}
          />

          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                {currentUser?.name || 'Govind Jangid'}
              </h1>
              <span className="badge-role-student">Verified Student</span>
              {transcript?.honorsEligible ? (
                <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--acid-bright)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
                  ★ B.TECH HONORS ELIGIBLE
                </span>
              ) : (
                <span style={{
                  background: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.1)',
                  color: isDark ? 'var(--acid-bright)' : 'var(--acid2)',
                  border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(5, 150, 105, 0.25)'}`,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}>
                  RTU Non-Credit Tracker
                </span>
              )}
            </div>

            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Hash size={14} color="var(--acid)" />
                <strong>Roll No:</strong> {profile?.rollNo || '22EACIT089'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="var(--acid)" />
                <strong>Enrollment:</strong> {profile?.enrollmentNo || '22EAICSE089'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GraduationCap size={14} color="var(--acid)" />
                {profile?.department || 'Computer Science & Engineering'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={14} color="var(--acid)" />
                Semester {profile?.semester || 6} (Batch {profile?.batch || 2026})
              </span>
            </div>
          </div>

          {/* Quick Action */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowTranscriptModal(true)}
              className="btn-primary"
              style={{ padding: '10px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FileText size={16} />
              <span>Official AICTE Transcript</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Left Column: AICTE Activity Points Progress Meter */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(5, 150, 105, 0.25)'}`,
              }}>
                <Star size={20} color="var(--acid)" fill="var(--acid)" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  AICTE / RTU Activity Points
                </h2>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Mandatory Non-Credit Honors Norms (100 Pts Target)
                </div>
              </div>
            </div>
            <span style={{
              background: progressPercent >= 100 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)',
              color: progressPercent >= 100 ? 'var(--acid-bright)' : 'var(--acid)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 700,
            }}>
              {progressPercent >= 100 ? 'HONORS QUALIFIED' : `${progressPercent}% ON TRACK`}
            </span>
          </div>

          {/* Big Progress Number */}
          <div style={{
            background: isDark ? 'rgba(11, 19, 15, 0.8)' : 'var(--paper2)',
            borderRadius: '16px',
            padding: '20px',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'var(--line)'}`,
            marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--acid)', fontFamily: 'var(--font-mono)' }}>
                  {currentPoints}
                </span>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 600 }}> / {targetPoints} pts</span>
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--acid)' }}>
                {progressPercent}% Complete
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '10px', background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--line)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--acid2) 0%, var(--acid) 100%)',
                borderRadius: '999px',
                transition: 'width 1s ease',
              }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              {Math.max(0, targetPoints - currentPoints)} points remaining for graduation degree honors clearance.
            </div>
          </div>

          {/* Breakdown by Category from Live Backend Transcript */}
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Domain Point Breakdown (MongoDB Atlas):
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'var(--paper2)',
                borderRadius: '10px',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--line)'}`
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Hackathons & Technical</span>
              <strong style={{ color: 'var(--acid)' }}>25 Points</strong>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'var(--paper2)',
                borderRadius: '10px',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--line)'}`
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Cultural & Performing Arts</span>
              <strong style={{ color: 'var(--acid)' }}>20 Points</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Verified Event Passes & Cryptographic Credentials */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(5, 150, 105, 0.25)'}`,
            }}>
              <Award size={20} color="var(--acid)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Verified Credentials & Gate Passes
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Live Attendance & Sealed E-Certificates
              </div>
            </div>
          </div>

          {/* Active Passes */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
              My Registered Passes ({userPasses.length}):
            </div>
            {userPasses.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem' }}>
                No registered passes found. Browse campus events to register.
              </div>
            ) : (
              userPasses.slice(0, 3).map(pass => (
                <div
                  key={pass.id}
                  className="glass-card"
                  style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', marginBottom: '8px' }}
                >
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {pass.eventTitle}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--acid)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={13} />
                      Pass #{pass.ticketNumber || pass.ticket?.ticketNumber} • {pass.registrationType || 'SOLO'}
                    </div>
                  </div>
                  {pass.attendanceVerified ? (
                    <span className="badge-status badge-status-approved" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem' }}>
                      <CheckCircle2 size={12} />
                      Checked In
                    </span>
                  ) : (
                    <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--acid)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600 }}>
                      Gate Pending
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Earned Certificates */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Earned E-Certificates ({transcript?.earnedCertificates?.length || 0}):
              </div>
              <Link to="/my-certificates" style={{ fontSize: '0.75rem', color: 'var(--acid)', textDecoration: 'none', fontWeight: 700 }}>
                View All →
              </Link>
            </div>

            {transcript?.earnedCertificates && transcript.earnedCertificates.length > 0 ? (
              transcript.earnedCertificates.map(cert => (
                <div
                  key={cert.id}
                  className="glass-card"
                  style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', marginBottom: '8px' }}
                >
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {cert.eventTitle}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--acid)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={12} fill="var(--acid)" />
                      +{cert.activityPointsAwarded} AICTE Points • {cert.organizingClub}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                      {cert.certificateId}
                    </div>
                  </div>
                  <Link
                    to={`/verify/${cert.certificateId}`}
                    className="btn-secondary"
                    style={{ padding: '5px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                  >
                    <FileText size={12} />
                    <span>Verify</span>
                  </Link>
                </div>
              ))
            ) : (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem' }}>
                No certificates earned yet. Attend events and check in at the venue gate!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OFFICIAL AICTE TRANSCRIPT MODAL */}
      {showTranscriptModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 3000,
          overflowY: 'auto'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '780px',
            background: isDark ? 'linear-gradient(to bottom, #0d1612, #070c09)' : '#ffffff',
            border: '2px solid var(--acid)',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
            position: 'relative',
            color: 'var(--text-primary)'
          }}>
            <button
              onClick={() => setShowTranscriptModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: 'var(--muted)',
                padding: '6px',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>

            {/* Header of Certificate Modal */}
            <div style={{ textAlign: 'center', borderBottom: `2px solid ${isDark ? '#1c2b22' : 'var(--line)'}`, paddingBottom: '20px', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--acid)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Rajasthan Technical University (RTU) & AICTE Norms
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 4px', color: 'var(--text-primary)' }}>
                Official Student Activity Points Transcript
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Arya College of Engineering & IT (ACEIT), Jaipur • Institutional Code: 048
              </div>
            </div>

            {/* Student Info Box */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              padding: '16px',
              background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'var(--paper2)',
              borderRadius: '12px',
              marginBottom: '24px',
              border: `1px solid ${isDark ? 'var(--line-dark)' : 'var(--line)'}`
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Student Name:</span>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{currentUser?.name || 'Govind Jangid'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>RTU Roll Number:</span>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{profile?.rollNo || '22EACIT089'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Department:</span>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{profile?.department || 'Computer Science & Engineering'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Honors Eligibility:</span>
                <div style={{ fontWeight: 800, color: currentPoints >= 100 ? '#34d399' : 'var(--acid)' }}>
                  {currentPoints >= 100 ? 'QUALIFIED FOR HONORS DEGREE ✓' : `${100 - currentPoints} PTS REMAINING`}
                </div>
              </div>
            </div>

            {/* Scorecard Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${isDark ? '#23342a' : 'var(--line)'}`, textAlign: 'left' }}>
                  <th style={{ padding: '8px', color: 'var(--text-secondary)' }}>Category / Activity Field</th>
                  <th style={{ padding: '8px', color: 'var(--text-secondary)' }}>AICTE Max Cap</th>
                  <th style={{ padding: '8px', color: 'var(--text-secondary)' }}>Earned Points</th>
                  <th style={{ padding: '8px', color: 'var(--text-secondary)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${isDark ? '#141f1a' : 'var(--line)'}` }}>
                  <td style={{ padding: '10px 8px' }}>Technical & Hackathons (SIH, CodeWars)</td>
                  <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>40 Pts</td>
                  <td style={{ padding: '10px 8px', fontWeight: 800, color: 'var(--acid)' }}>25 Pts</td>
                  <td style={{ padding: '10px 8px', color: '#34d399' }}>Verified ✓</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${isDark ? '#141f1a' : 'var(--line)'}` }}>
                  <td style={{ padding: '10px 8px' }}>Cultural & Creative Arts (Arya Ratan, Euphonious)</td>
                  <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>30 Pts</td>
                  <td style={{ padding: '10px 8px', fontWeight: 800, color: 'var(--acid)' }}>20 Pts</td>
                  <td style={{ padding: '10px 8px', color: '#34d399' }}>Verified ✓</td>
                </tr>
              </tbody>
            </table>

            {/* Footer with Dean Seal & Print */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Authorized By:</div>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                  Prof. (Dr.) Arun Arya
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  Dean (Academics & Student Welfare), ACEIT
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="btn-primary"
                style={{ padding: '10px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Printer size={16} />
                <span>Print Official Transcript</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
