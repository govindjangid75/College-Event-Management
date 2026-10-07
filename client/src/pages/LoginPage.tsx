import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, LogIn, Sparkles, GraduationCap, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SEED_USERS } from '../data/seedData';

export const LoginPage: React.FC = () => {
  const { login, allClubAdmins } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('govind@aryacollege.in');
  const [password, setPassword] = useState('SecurePass123!');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await login(identifier, password);
      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          navigate('/');
        }, 600);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (targetId: string) => {
    setIdentifier(targetId);
    setPassword('SecurePass123!');
    setErrorMessage('');
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{ maxWidth: '520px', width: '100%' }}>
        {/* Header Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #1e40af 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)',
            marginBottom: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <Building2 size={30} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Sign in to <span className="text-gradient-cyan">CampusSphere</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            Arya College of Engineering & IT (ACEIT), Jaipur
          </p>
        </div>

        {/* Quick Demo Pre-Fill Selector */}
        <div className="glass-panel" style={{ padding: '16px', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} />
            ONE-CLICK EVALUATOR LOGIN PROFILES:
          </div>

          {/* Student Multi-Credential Fill Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickFill('govind@aryacollege.in')}
              style={{
                background: identifier === 'govind@aryacollege.in' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                border: identifier === 'govind@aryacollege.in' ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.08)',
                color: identifier === 'govind@aryacollege.in' ? '#38bdf8' : 'var(--text-secondary)',
                padding: '6px 4px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
              }}
              title="Login with Student Email"
            >
              <GraduationCap size={12} style={{ margin: '0 auto 2px auto', display: 'block' }} />
              Govind (Email)
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('22EACIT089')}
              style={{
                background: identifier === '22EACIT089' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                border: identifier === '22EACIT089' ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.08)',
                color: identifier === '22EACIT089' ? '#38bdf8' : 'var(--text-secondary)',
                padding: '6px 4px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
              }}
              title="Login with RTU Roll Number"
            >
              <GraduationCap size={12} style={{ margin: '0 auto 2px auto', display: 'block' }} />
              Roll: 22EACIT089
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('22EAICSE089')}
              style={{
                background: identifier === '22EAICSE089' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                border: identifier === '22EAICSE089' ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.08)',
                color: identifier === '22EAICSE089' ? '#38bdf8' : 'var(--text-secondary)',
                padding: '6px 4px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
              }}
              title="Login with Enrollment Number"
            >
              <GraduationCap size={12} style={{ margin: '0 auto 2px auto', display: 'block' }} />
              Enroll: 22EAICSE089
            </button>
          </div>

          {/* 15 Club Admins & Dean Selector Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '6px' }}>
            <select
              value={identifier}
              onChange={(e) => handleQuickFill(e.target.value)}
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#fbbf24',
                padding: '6px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
              title="Select any of the 15 Dedicated Club Admin Accounts"
            >
              <option value="" disabled style={{ background: '#0b132b', color: '#94a3b8' }}>
                👑 Quick Login: 15 Club Admins...
              </option>
              {allClubAdmins.map((admin) => (
                <option key={admin.id} value={admin.email} style={{ background: '#0b132b', color: '#f8fafc' }}>
                  {admin.name} ({admin.facultyDesignation?.replace('Lead - ', '').replace('President - ', '')})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => handleQuickFill('dean@aryacollege.in')}
              style={{
                background: identifier === 'dean@aryacollege.in' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                border: identifier === 'dean@aryacollege.in' ? '1px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.08)',
                color: identifier === 'dean@aryacollege.in' ? '#c084fc' : 'var(--text-secondary)',
                padding: '6px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <ShieldAlert size={12} />
              Dean (Admin)
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          {errorMessage && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#f87171',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '18px',
            }}>
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <CheckCircle2 size={16} />
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Email, RTU Roll No, or Enrollment No
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                className="glass-input"
                placeholder="e.g. govind@aryacollege.in OR 22EACIT089 OR 22EAICSE089"
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                💡 Students can log in using their Institutional Email, RTU Roll No, or Enrollment No.
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Password
                </label>
                <a href="#forgot" style={{ fontSize: '0.78rem', color: '#38bdf8', textDecoration: 'none' }}>
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="glass-input"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '6px' }}
            >
              {loading ? (
                'Signing In...'
              ) : (
                <>
                  <LogIn size={18} />
                  Authorize & Enter Campus
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '22px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '18px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Enrolled Arya Student without an account?{' '}
            </span>
            <Link to="/register" style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600, textDecoration: 'none' }}>
              Register Roll No
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
