import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClub } from '../context/ClubContext';
import { 
  Users, 
  Search, 
  Award, 
  Filter, 
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';

export const ClubsPage: React.FC = () => {
  const { clubs } = useClub();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    'ALL',
    'Coding / Dev',
    'Hackathons',
    'Gaming / Esports',
    'Cultural',
    'Social Welfare',
    'Robotics',
    'Aerospace',
    'Science & Tech',
    'Mind Sports',
    'Open Source',
  ];

  const filteredClubs = clubs.filter(club => {
    const matchesCategory = selectedCategory === 'ALL' || club.category === selectedCategory;
    const matchesSearch = 
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (club.facultyCoordinator && club.facultyCoordinator.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--acid)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>
          <Users size={18} />
          ARYA COLLEGE INSTITUTIONAL SOCIETIES & CHAPTERS
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', margin: 0, lineHeight: 1.1 }}>
              15 Official Arya College Clubs
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '8px', maxWidth: '680px' }}>
              Explore official RTU-recognized student chapters, department HOD mentorship, AICTE activity points, and flagship campus fests.
            </p>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '10px 18px',
            borderRadius: '4px',
            fontSize: '0.82rem',
            color: 'var(--acid)',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <CheckCircle2 size={16} />
            15 VERIFIED CAMPUS SOCIETIES
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '18px 20px', marginBottom: '32px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', borderRadius: '6px' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by club name, HOD mentor, category..."
            className="glass-input"
            style={{ 
              paddingLeft: '42px',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--line)',
              width: '100%',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Filter size={16} color="var(--text-secondary)" />
          {categories.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: isActive ? 'var(--acid)' : 'var(--bg-secondary)',
                  border: isActive ? '1px solid var(--acid)' : '1px solid var(--line)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  padding: '6px 14px',
                  borderRadius: '4px',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clubs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '26px' }}>
        {filteredClubs.map(club => (
          <div 
            key={club.id} 
            className="glass-panel" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              overflow: 'hidden',
              borderRadius: '6px',
              border: '1px solid var(--card-border)',
              background: 'var(--card-bg)',
            }}
          >
            {/* Banner with Logo Overlay */}
            <div style={{ position: 'relative', height: '130px', background: 'var(--bg-tertiary)' }}>
              <img
                src={club.bannerUrl}
                alt={club.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              
              {/* Overlaid Logo */}
              <div style={{
                position: 'absolute',
                bottom: '-22px',
                left: '20px',
                width: '56px',
                height: '56px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '2px solid var(--card-bg)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                background: 'var(--bg-secondary)'
              }}>
                <img src={club.logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Category Pill */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(10, 20, 16, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--acid-bright)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontFamily: 'var(--font-mono)',
              }}>
                {club.category}
              </div>
            </div>

            {/* Club Details */}
            <div style={{ padding: '32px 22px 22px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
                {club.name}
              </h3>
              
              <div style={{ fontSize: '0.84rem', color: 'var(--acid)', fontWeight: 600, marginBottom: '12px', fontStyle: 'italic' }}>
                "{club.tagline}"
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '18px', flex: 1 }}>
                {club.description}
              </p>

              {/* Faculty Info with Official HOD details */}
              <div style={{ 
                background: 'var(--bg-secondary)', 
                borderRadius: '4px', 
                padding: '10px 14px', 
                border: '1px solid var(--line)', 
                marginBottom: '16px' 
              }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>
                  Faculty Coordinator / HOD:
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {club.facultyCoordinator}
                </div>
              </div>

              {/* Systematic Student Metrics (AICTE Points & Member Count - ZERO private balances) */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--line)',
                paddingTop: '14px',
                marginBottom: '18px',
                fontSize: '0.75rem',
              }}>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>
                    AICTE Activity Pts
                  </div>
                  <strong style={{ color: 'var(--acid)', fontSize: '0.98rem', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                    Up to 50 Pts
                  </strong>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>
                    Active Community
                  </div>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 800 }}>
                    {club.memberCount} Students
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <Link
                to={`/clubs/${club.slug}`}
                className="btn-primary"
                style={{
                  padding: '11px',
                  fontSize: '0.82rem',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                View Showcase & Mentorship
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
