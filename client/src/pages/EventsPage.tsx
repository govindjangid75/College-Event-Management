import React, { useState, useEffect } from 'react';
import { 
  Calendar, Search, Filter, ShieldCheck, Flame, ArrowRight, Tag, 
  PlusCircle, RefreshCw, Clock, MapPin, Users, CheckCircle2, AlertCircle,
  LayoutGrid, Compass
} from 'lucide-react';
import { Event } from '../types';
import { fetchEvents } from '../services/api';
import { CreateEventModal } from '../components/CreateEventModal';
import { EventRegistrationModal } from '../components/EventRegistrationModal';
import { Campus3DExplorer } from '../components/Campus3DExplorer';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const EventsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'GRID' | '3D'>('GRID');
  const [searchQuery, setSearchQuery] = useState('');
  const [timelineFilter, setTimelineFilter] = useState<'UPCOMING' | 'ALL' | 'PAST'>('UPCOMING');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventForModal, setSelectedEventForModal] = useState<Event | null>(null);

  const categories = ['ALL', 'TECHNICAL', 'HACKATHON', 'WORKSHOP', 'CULTURAL', 'SPORTS', 'LITERARY'];

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events from live backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const now = new Date();

  const isPastEvent = (event: Event) => {
    const startTimeStr = event.startTime || event.schedule?.startTime || '';
    const endTimeStr = event.endTime || event.schedule?.endTime || '';
    return (
      event.status === 'COMPLETED' ||
      (endTimeStr ? new Date(endTimeStr) < now : (startTimeStr ? new Date(startTimeStr) < now : false))
    );
  };

  const filteredEvents = events.filter((event) => {
    const isPast = isPastEvent(event);

    const matchesTimeline =
      timelineFilter === 'ALL' ||
      (timelineFilter === 'UPCOMING' && !isPast) ||
      (timelineFilter === 'PAST' && isPast);

    const matchesCategory =
      selectedCategory === 'ALL' ||
      event.category?.toUpperCase() === selectedCategory.toUpperCase();

    const matchesStatus =
      selectedStatus === 'ALL' || event.status === selectedStatus;

    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.shortSummary && event.shortSummary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.tags && event.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesTimeline && matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#06b6d4', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
            <Calendar size={18} />
            CAMPUS EVENT FEED & INSTITUTIONAL SCHEDULER (LIVE MONGODB ATLAS)
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', margin: 0 }}>
            Explore Upcoming Campus Events
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '6px' }}>
            Register for technical sprints, hackathons, and earn verified AICTE Activity Points. All bookings enforce institutional 30-min setup and teardown buffers.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* View Mode Toggle */}
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', padding: '3px' }}>
            <button
              onClick={() => setViewMode('GRID')}
              style={{
                padding: '7px 14px',
                borderRadius: '9px',
                border: 'none',
                background: viewMode === 'GRID' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                color: viewMode === 'GRID' ? '#38bdf8' : '#94a3b8',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LayoutGrid size={15} />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('3D')}
              style={{
                padding: '7px 14px',
                borderRadius: '9px',
                border: 'none',
                background: viewMode === '3D' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                color: viewMode === '3D' ? '#38bdf8' : '#94a3b8',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Compass size={15} />
              <span>3D Spatial Map</span>
            </button>
          </div>

          <button
            onClick={loadEvents}
            disabled={loading}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: '10px 16px' }}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>Sync Live</span>
          </button>

          {(currentUser?.role === 'CLUB_ADMIN' || currentUser?.role === 'SUPER_ADMIN') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', padding: '10px 20px' }}
            >
              <PlusCircle size={16} />
              <span>Propose Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '32px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by title, tags (e.g. AI, Hackathon, Dance)..."
            className="glass-input"
            style={{ paddingLeft: '42px' }}
          />
        </div>

        {/* Timeline Filter: Upcoming vs Concluded */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <button
            onClick={() => setTimelineFilter('UPCOMING')}
            style={{
              padding: '6px 14px',
              borderRadius: '9px',
              border: 'none',
              background: timelineFilter === 'UPCOMING' ? 'var(--acid)' : 'transparent',
              color: timelineFilter === 'UPCOMING' ? '#000000' : '#94a3b8',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s',
            }}
          >
            <Flame size={13} />
            Upcoming ({events.filter(e => !isPastEvent(e)).length})
          </button>
          <button
            onClick={() => setTimelineFilter('ALL')}
            style={{
              padding: '6px 14px',
              borderRadius: '9px',
              border: 'none',
              background: timelineFilter === 'ALL' ? 'var(--acid)' : 'transparent',
              color: timelineFilter === 'ALL' ? '#000000' : '#94a3b8',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            All Events ({events.length})
          </button>
          <button
            onClick={() => setTimelineFilter('PAST')}
            style={{
              padding: '6px 14px',
              borderRadius: '9px',
              border: 'none',
              background: timelineFilter === 'PAST' ? 'var(--acid)' : 'transparent',
              color: timelineFilter === 'PAST' ? '#000000' : '#94a3b8',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            Concluded / Past ({events.filter(e => isPastEvent(e)).length})
          </button>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Filter size={16} color="#94a3b8" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                border: selectedCategory === cat ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.1)',
                color: selectedCategory === cat ? '#38bdf8' : '#94a3b8',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Map View or Standard Grid View */}
      {viewMode === '3D' ? (
        <div style={{ marginBottom: '32px' }}>
          <Campus3DExplorer />
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px', color: '#6366f1' }} />
          <p style={{ fontSize: '0.95rem' }}>Loading events directly from live MongoDB Atlas...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <Calendar size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', fontWeight: 700, marginBottom: '6px' }}>No Events Match Filter</h3>
          <p style={{ fontSize: '0.9rem' }}>Try clearing the search query or proposing a new event.</p>
        </div>
      ) : (
        /* Events Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {filteredEvents.map((event) => {
            const startTimeStr = event.startTime || event.schedule?.startTime || '';
            const endTimeStr = event.endTime || event.schedule?.endTime || '';
            const isPaid = event.isPaid ?? event.ticketing?.isPaid ?? false;
            const price = event.ticketPrice ?? event.ticketing?.ticketPrice ?? 0;

            const isPast = isPastEvent(event);
            const isRegClosed = isPast || (event.registrationDeadline ? new Date(event.registrationDeadline) < now : false);

            return (
              <div key={event.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', opacity: isPast ? 0.85 : 1 }}>
                {/* Banner with Pricing & Status Badge */}
                <div style={{ position: 'relative', height: '190px' }}>
                  <img
                    src={event.bannerImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200'}
                    alt={event.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isPast ? 'grayscale(35%)' : 'none' }}
                  />
                  
                  {/* Top Badges */}
                  <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                    {isPast ? (
                      <span style={{
                        background: 'rgba(30, 41, 59, 0.85)',
                        backdropFilter: 'blur(8px)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#94a3b8',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                      }}>
                        ● EVENT CONCLUDED
                      </span>
                    ) : (
                      <span style={{
                        background: event.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.85)' : 'rgba(245, 158, 11, 0.85)',
                        backdropFilter: 'blur(8px)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#ffffff',
                      }}>
                        {event.status === 'APPROVED' ? '✓ REGISTRATIONS OPEN' : event.status}
                      </span>
                    )}
                  </div>

                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(6, 10, 20, 0.85)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: isPast ? '#94a3b8' : (isPaid ? 'var(--acid-bright)' : '#34d399'),
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}>
                    {isPast ? 'CONCLUDED' : (isPaid ? `₹${price} ENTRY` : 'FREE ENTRY')}
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    background: 'rgba(6, 10, 20, 0.85)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    {event.clubLogoUrl && (
                      <img src={event.clubLogoUrl} alt="" style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
                    )}
                    {event.clubName}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: isPast ? '#94a3b8' : '#c084fc',
                      background: isPast ? 'rgba(255, 255, 255, 0.05)' : 'rgba(139, 92, 246, 0.15)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${isPast ? 'rgba(255, 255, 255, 0.1)' : 'rgba(139, 92, 246, 0.3)'}`
                    }}>
                      +{event.activityPointsAwarded} AICTE CREDITS
                    </span>

                    <span style={{ fontSize: '0.75rem', color: isPast ? '#94a3b8' : '#38bdf8', fontWeight: 600 }}>
                      {event.registrationType === 'TEAM' ? '👥 Squad Mode' : '👤 Solo Mode'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '8px' }}>
                    {event.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px', flex: 1 }}>
                    {event.shortSummary}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {event.tags?.map((t) => (
                      <span key={t} style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-secondary)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}>
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Institutional Buffer Tag */}
                  <div style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.72rem',
                    color: '#a5b4fc',
                  }}>
                    <ShieldCheck size={14} color="#818cf8" />
                    <span>30-min setup buffer & 30-min teardown buffer reserved in venue calendar</span>
                  </div>

                  {/* Footer with Venue & Register */}
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} color="var(--acid)" />
                        {event.venueName || 'Arya Campus'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {startTimeStr ? new Date(startTimeStr).toLocaleDateString() : 'Upcoming'}
                        {startTimeStr ? ` • ${new Date(startTimeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                      </div>
                    </div>

                    {currentUser?.role === 'CLUB_ADMIN' ? (
                      <Link
                        to="/club-admin"
                        className="btn-gold"
                        style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <ShieldCheck size={14} /> Gate Scanner
                      </Link>
                    ) : currentUser?.role === 'SUPER_ADMIN' ? (
                      <Link
                        to="/admin"
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <ShieldCheck size={14} /> Dean Audit
                      </Link>
                    ) : isPast || isRegClosed ? (
                      <button
                        disabled
                        style={{
                          padding: '8px 16px',
                          fontSize: '0.82rem',
                          background: 'rgba(255, 255, 255, 0.04)',
                          color: 'var(--muted)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '4px',
                          cursor: 'not-allowed',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontWeight: 600
                        }}
                      >
                        <CheckCircle2 size={13} color="var(--muted)" />
                        <span>Registrations Closed</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedEventForModal(event)}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                      >
                        Register Pass <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clubId={currentUser?.administeredClubId || "6ac5048e9e7f6659899e6cdc"}
        clubName={currentUser?.administeredClubId === 'arya_cipher' ? 'Arya Cipher Coding Club' : 'Arya ACEIT Hackathon Club'}
        onEventCreated={() => {
          loadEvents();
        }}
      />

      {/* Phase 4: Event Registration & Razorpay Modal */}
      {selectedEventForModal && (
        <EventRegistrationModal
          isOpen={!!selectedEventForModal}
          onClose={() => setSelectedEventForModal(null)}
          event={selectedEventForModal}
          onSuccess={() => loadEvents()}
        />
      )}
    </div>
  );
};
