import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentUser, isAuthenticated, switchRole } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return (
      <div style={{
        maxWidth: '560px',
        margin: '60px auto',
        padding: '36px',
        textAlign: 'center',
      }} className="glass-panel">
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '16px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}>
          <ShieldAlert size={32} color="#f87171" />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
          Restricted Portal Access
        </h2>

        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '24px' }}>
          This portal requires <strong>{allowedRoles.join(' or ')}</strong> privileges. 
          Your active session is currently logged in as <strong>{currentUser.name} ({currentUser.role})</strong>.
        </p>

        {/* Quick Role Switch Suggestion */}
        <div style={{
          background: 'rgba(11, 19, 43, 0.6)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '20px',
          textAlign: 'left',
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} />
            ONE-CLICK EVALUATOR ROLE SWITCH:
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>
            Click below to instantly switch your demo session to the required authority:
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {allowedRoles.map(role => (
              <button
                key={role}
                onClick={() => switchRole(role)}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
              >
                Switch to {role}
                <ArrowRight size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
