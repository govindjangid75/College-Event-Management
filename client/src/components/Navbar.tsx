import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Compass, 
  Calendar, 
  Users, 
  Ticket, 
  Award, 
  LayoutDashboard, 
  LogOut, 
  UserCircle, 
  Sparkles, 
  ChevronDown,
  Building2,
  ShieldCheck,
  Star,
  Sun,
  Moon
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, isAuthenticated, logout, isStudent, isClubAdmin, isSuperAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navBg = isDark ? 'rgba(17, 17, 15, 0.94)' : 'rgba(242, 238, 229, 0.92)';
  const navBorder = isDark ? '1px solid #353531' : '1px solid var(--line)';

  return (
    <nav style={{
      background: navBg,
      backdropFilter: 'blur(18px)',
      borderBottom: navBorder,
      position: 'sticky',
      top: '38px', // right below the topbar
      zIndex: 90,
      padding: '0 5vw',
      transition: 'background 0.25s, border-color 0.25s',
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        height: '74px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
      }}>
        {/* Brand & Reference Geometric Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '11px' }}>
          <span style={{
            width: '31px',
            height: '31px',
            border: `2px solid ${isDark ? 'var(--paper)' : 'var(--ink)'}`,
            position: 'relative',
            display: 'block',
            overflow: 'hidden',
            background: isDark ? '#191917' : 'transparent',
            flexShrink: 0,
          }}>
            <span style={{
              position: 'absolute',
              width: '13px',
              height: '13px',
              left: '4px',
              top: '4px',
              background: 'var(--acid)',
            }} />
            <span style={{
              position: 'absolute',
              width: '10px',
              height: '10px',
              right: '3px',
              bottom: '3px',
              border: `2px solid ${isDark ? 'var(--paper)' : 'var(--ink)'}`,
            }} />
          </span>
          <div>
            <div style={{ 
              fontWeight: 800, 
              fontSize: '20px', 
              letterSpacing: '-0.065em', 
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              lineHeight: 1,
            }}>
              <span>Campus</span>
              <span style={{ color: isDark ? 'var(--acid)' : 'inherit' }}>Sphere</span>
            </div>
            <div style={{ 
              fontSize: '9px', 
              color: 'var(--muted)', 
              fontWeight: 600, 
              letterSpacing: '0.04em', 
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
              marginTop: '3px',
            }}>
              Arya College of Engg. & IT
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              padding: '8px 12px',
              fontSize: '11px',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: isActive('/') ? (isDark ? 'var(--acid)' : 'var(--ink)') : 'var(--muted)',
              borderBottom: isActive('/') ? `2px solid ${isDark ? 'var(--acid)' : 'var(--ink)'}` : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Compass size={15} />
            Explore
          </Link>

          <Link
            to="/events"
            style={{
              textDecoration: 'none',
              padding: '8px 12px',
              fontSize: '11px',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: isActive('/events') ? (isDark ? 'var(--acid)' : 'var(--ink)') : 'var(--muted)',
              borderBottom: isActive('/events') ? `2px solid ${isDark ? 'var(--acid)' : 'var(--ink)'}` : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Calendar size={15} />
            Events
          </Link>

          <Link
            to="/clubs"
            style={{
              textDecoration: 'none',
              padding: '8px 12px',
              fontSize: '11px',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: isActive('/clubs') ? (isDark ? 'var(--acid)' : 'var(--ink)') : 'var(--muted)',
              borderBottom: isActive('/clubs') ? `2px solid ${isDark ? 'var(--acid)' : 'var(--ink)'}` : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Users size={15} />
            15 Clubs
          </Link>

          {/* Student Specific Links */}
          {isStudent && (
            <>
              <Link
                to="/my-passes"
                style={{
                  textDecoration: 'none',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: isActive('/my-passes') ? '#38bdf8' : '#94a3b8',
                  background: isActive('/my-passes') ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                }}
              >
                <Ticket size={16} />
                My Passes
              </Link>

              <Link
                to="/my-certificates"
                style={{
                  textDecoration: 'none',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: isActive('/my-certificates') ? '#38bdf8' : '#94a3b8',
                  background: isActive('/my-certificates') ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                }}
              >
                <Award size={16} />
                Certificates
              </Link>
            </>
          )}

          {/* Club Admin Links */}
          {isClubAdmin && (
            <Link
              to="/club-admin"
              style={{
                textDecoration: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive('/club-admin') ? '#fbbf24' : '#fbbf24',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              <LayoutDashboard size={16} />
              Club Console
            </Link>
          )}

          {/* Super Admin Links */}
          {isSuperAdmin && (
            <Link
              to="/admin"
              style={{
                textDecoration: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive('/admin') ? '#c084fc' : '#c084fc',
                background: 'rgba(139, 92, 246, 0.12)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              <ShieldCheck size={16} />
              Dean Hub
            </Link>
          )}
        </div>

        {/* Right Section: Activity Points Chip, Day/Night Toggle & User Profile / Login */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Day / Night Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              width: '38px',
              height: '38px',
              background: 'transparent',
              border: `1px solid ${isDark ? '#393934' : 'var(--ink)'}`,
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              color: isDark ? 'var(--acid)' : 'var(--ink)',
              transition: 'all 0.2s',
            }}
            title={isDark ? "Switch to Day Mode (Editorial Paper)" : "Switch to Night Mode (Deep Ink)"}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* AICTE Activity Points Badge (if student) */}
          {isStudent && currentUser?.studentProfile && (
            <Link
              to="/profile"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: isDark ? '#191917' : 'var(--paper2)',
                border: `1px solid ${isDark ? '#393934' : 'var(--ink)'}`,
                padding: '5px 10px',
                color: isDark ? 'var(--acid)' : 'var(--ink)',
                fontSize: '11px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
              }}
              title="AICTE / RTU Activity Points towards Degree Honors"
            >
              <Star size={12} fill={isDark ? 'var(--acid)' : 'var(--ink)'} />
              <span>{currentUser.studentProfile.activityPointsTotal} / 100 PTS</span>
            </Link>
          )}

          {isAuthenticated && currentUser ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  background: isDark ? '#181816' : 'var(--white)',
                  border: `1px solid ${isDark ? '#393934' : 'var(--ink)'}`,
                  padding: '5px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: isDark ? 'var(--paper)' : 'var(--ink)',
                  transition: 'all 0.2s',
                }}
              >
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser.name}
                  style={{ width: '24px', height: '24px', objectFit: 'cover', border: `1px solid ${isDark ? '#393934' : 'var(--ink)'}` }}
                />
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: isDark ? '#9c988e' : 'var(--muted)' }}>
                    {currentUser.role === 'STUDENT' && (currentUser.studentProfile?.rollNo || 'Student')}
                    {currentUser.role === 'CLUB_ADMIN' && 'Club Lead'}
                    {currentUser.role === 'SUPER_ADMIN' && 'Dean Office'}
                  </div>
                </div>
                <ChevronDown size={13} color={isDark ? 'var(--paper)' : 'var(--ink)'} />
              </button>

              {/* Profile Dropdown */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '115%',
                  width: '240px',
                  background: isDark ? '#171715' : 'var(--white)',
                  border: `1px solid ${isDark ? '#393934' : 'var(--ink)'}`,
                  boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.6)' : '6px 6px 0 var(--ink)',
                  padding: '8px',
                  zIndex: 100,
                }}>
                  <div style={{ padding: '8px 10px', borderBottom: `1px solid ${isDark ? '#292926' : 'var(--line)'}` }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>{currentUser.email}</div>
                    <div style={{ marginTop: '6px' }}>
                      {currentUser.role === 'STUDENT' && <span className="badge-role-student">Student</span>}
                      {currentUser.role === 'CLUB_ADMIN' && <span className="badge-role-club">Club Admin</span>}
                      {currentUser.role === 'SUPER_ADMIN' && <span className="badge-role-admin">Super Admin</span>}
                    </div>
                  </div>

                  <div style={{ padding: '4px 0' }}>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        color: 'inherit',
                        fontSize: '11px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        textDecoration: 'none',
                        transition: 'background 0.2s',
                      }}
                    >
                      <UserCircle size={14} />
                      {currentUser.role === 'SUPER_ADMIN' ? 'Dean Executive Profile' : (currentUser.role === 'CLUB_ADMIN' ? 'Club Lead Profile' : 'Academic Profile')}
                    </Link>

                    {isStudent && (
                      <Link
                        to="/my-passes"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          color: 'inherit',
                          fontSize: '11px',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                          textDecoration: 'none',
                        }}
                      >
                        <Ticket size={14} />
                        My Rolling Passes
                      </Link>
                    )}

                    {isClubAdmin && (
                      <Link
                        to="/club-admin"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          color: 'inherit',
                          fontSize: '11px',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                          textDecoration: 'none',
                        }}
                      >
                        <LayoutDashboard size={14} />
                        Club Console
                      </Link>
                    )}

                    {isSuperAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          color: 'inherit',
                          fontSize: '11px',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                          textDecoration: 'none',
                        }}
                      >
                        <ShieldCheck size={14} />
                        Dean Hub
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '8px 10px',
                        color: 'var(--red)',
                        fontSize: '11px',
                        fontWeight: 800,
                        fontFamily: 'var(--font-mono)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        marginTop: '4px',
                        borderTop: `1px solid ${isDark ? '#292926' : 'var(--line)'}`,
                      }}
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login" className="btn ghost small">
                Sign In
              </Link>
              <Link to="/register" className="btn acid small">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
