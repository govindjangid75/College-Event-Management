import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { currentUser, switchRole, switchClubAdmin, allClubAdmins, isStudent, isClubAdmin, isSuperAdmin } = useAuth();

  return (
    <div className="topbar" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      flexWrap: 'wrap',
      gap: '10px',
      padding: '7px 5vw',
    }}>
      {/* Left indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span className="eyebrow" style={{
          background: 'var(--ink2)',
          borderColor: '#393934',
          color: 'var(--paper)',
          padding: '3px 8px',
          fontSize: '9px',
        }}>
          <i></i>
          EVALUATOR DEMO
        </span>
        <span style={{ color: '#a49d90', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
          Active: <b style={{ color: 'var(--acid)' }}>{currentUser?.name}</b>{' '}
          ({currentUser?.role === 'CLUB_ADMIN' ? `Club Lead: ${currentUser.administeredClubId}` : currentUser?.role})
        </span>
      </div>

      {/* 1-Click Role Switcher Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ color: '#777166', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>SWITCH PERSONA:</span>

        {/* Student Button */}
        <button
          onClick={() => switchRole('STUDENT')}
          style={{
            background: isStudent ? 'var(--acid)' : 'transparent',
            color: isStudent ? 'var(--ink)' : 'var(--paper)',
            border: '1px solid ' + (isStudent ? 'var(--acid)' : '#393934'),
            padding: '3px 9px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontWeight: 800,
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            transition: 'all 0.2s',
          }}
          title="Switch to Student View (Govind Jangid - Roll: 22EACIT089)"
        >
          <GraduationCap size={12} />
          Student (Govind)
          {isStudent && <UserCheck size={11} />}
        </button>

        {/* 15 Club Admins Selector Dropdown */}
        <div style={{ display: 'inline-flex', alignItems: 'center', position: 'relative' }}>
          <select
            value={isClubAdmin ? currentUser?.administeredClubId : ''}
            onChange={(e) => {
              if (e.target.value) {
                switchClubAdmin(e.target.value);
              }
            }}
            style={{
              background: isClubAdmin ? 'var(--acid)' : 'var(--ink2)',
              color: isClubAdmin ? 'var(--ink)' : 'var(--paper)',
              border: '1px solid ' + (isClubAdmin ? 'var(--acid)' : '#393934'),
              padding: '3px 9px',
              fontSize: '10px',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s',
            }}
            title="Switch directly between all 15 different Club Admin accounts"
          >
            <option value="" disabled style={{ background: '#171715', color: '#a49d90' }}>
              ⚡ 15 Dedicated Club Admins...
            </option>
            {allClubAdmins.map((admin) => (
              <option key={admin.id} value={admin.administeredClubId} style={{ background: '#171715', color: '#eeeae1' }}>
                {admin.name} ({admin.facultyDesignation?.replace('Lead - ', '').replace('President - ', '')})
              </option>
            ))}
          </select>
        </div>

        {/* Super Admin Button */}
        <button
          onClick={() => switchRole('SUPER_ADMIN')}
          style={{
            background: isSuperAdmin ? 'var(--acid)' : 'transparent',
            color: isSuperAdmin ? 'var(--ink)' : 'var(--paper)',
            border: '1px solid ' + (isSuperAdmin ? 'var(--acid)' : '#393934'),
            padding: '3px 9px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontWeight: 800,
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            transition: 'all 0.2s',
          }}
          title="Switch to Super Admin View (Dr. R.K. Sharma - Dean Academics)"
        >
          <ShieldAlert size={12} />
          Super Admin (Dean)
          {isSuperAdmin && <UserCheck size={11} />}
        </button>
      </div>
    </div>
  );
};
