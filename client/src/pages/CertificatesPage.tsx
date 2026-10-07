import React, { useEffect, useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  FileText, 
  Share2, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  RefreshCw, 
  Building2, 
  Printer, 
  Eye, 
  Lock 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserCertificates, claimCertificate, fetchUserPasses } from '../services/api';
import { Certificate, Registration } from '../types';
import { Link } from 'react-router-dom';

export const CertificatesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [userPasses, setUserPasses] = useState<Registration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [claimingEventId, setClaimingEventId] = useState<string | null>(null);
  const [selectedPreviewCert, setSelectedPreviewCert] = useState<Certificate | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadData = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const [certs, passes] = await Promise.all([
        fetchUserCertificates(currentUser.id).catch(() => []),
        fetchUserPasses(currentUser.id).catch(() => [])
      ]);
      setCertificates(certs);
      setUserPasses(passes);
    } catch (err) {
      console.error('Failed to load certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser?.id]);

  const handleClaim = async (eventId: string) => {
    if (!currentUser) return;
    try {
      setClaimingEventId(eventId);
      const claimed = await claimCertificate(eventId, currentUser.id);
      setMessage({ text: `Certificate generated for ${claimed.eventTitle}! Serial: ${claimed.certificateId}`, type: 'success' });
      await loadData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to claim certificate', type: 'error' });
    } finally {
      setClaimingEventId(null);
    }
  };

  const handleLinkedInShare = (cert: Certificate) => {
    const verifyUrl = `${window.location.origin}/verify/${cert.certificateId}`;
    const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.eventTitle)}&organizationName=${encodeURIComponent(cert.institution || 'Arya College of Engineering & IT')}&issueYear=2026&issueMonth=10&certUrl=${encodeURIComponent(verifyUrl)}&certId=${encodeURIComponent(cert.certificateId)}`;
    window.open(url, '_blank');
  };

  // Find passes where attendanceVerified == true but no certificate claimed yet
  const claimablePasses = userPasses.filter(p => {
    const isVerified = p.attendanceVerified;
    const hasCert = certificates.some(c => c.eventId === p.eventId);
    return isVerified && !hasCert;
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '36px 20px' }}>
      {/* Toast */}
      {message && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
          color: '#ffffff',
          padding: '14px 22px',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          zIndex: 2000,
          fontWeight: 700,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <Lock size={18} />}
          {message.text}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
          <Award size={16} />
          CRYPTOGRAPHICALLY SEALED CREDENTIALS
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em', margin: 0 }}>
          My Verifiable E-Certificates
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>
          Official Arya College credentials tethered to gate-verified event attendance. Sealed with SHA-256 signatures for LinkedIn and RTU / AICTE transcript submissions.
        </p>
      </div>

      {/* Claimable Gate-Verified Passes Banner */}
      {claimablePasses.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.05))',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000'
            }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fbbf24', margin: 0 }}>
                {claimablePasses.length} Unclaimed E-Certificate Available!
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: '2px 0 0' }}>
                Your gate check-in was verified for <strong>{claimablePasses[0].eventTitle}</strong>. Generate your official sealed credential now.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleClaim(claimablePasses[0].eventId)}
            disabled={claimingEventId === claimablePasses[0].eventId}
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {claimingEventId === claimablePasses[0].eventId ? (
              <RefreshCw size={15} className="animate-spin" />
            ) : (
              <Award size={16} />
            )}
            <span>Claim E-Certificate</span>
          </button>
        </div>
      )}

      {/* Certificates List */}
      {loading ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <RefreshCw size={36} color="#fbbf24" className="animate-spin" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
            Fetching Certificates from MongoDB Atlas...
          </h3>
        </div>
      ) : certificates.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 32px', textAlign: 'center' }}>
          <Award size={48} color="#64748b" style={{ margin: '0 auto 14px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
            No Certificates Issued Yet
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '480px', margin: '8px auto 20px', lineHeight: 1.5 }}>
            Certificates are automatically unlocked after you register for an event and your Dynamic QR Pass is scanned and verified at the venue gate.
          </p>
          <Link to="/events" className="btn-primary" style={{ display: 'inline-flex', padding: '10px 20px', fontSize: '0.85rem', textDecoration: 'none' }}>
            Browse Upcoming Campus Events
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {certificates.map(cert => (
            <div
              key={cert.id}
              className="glass-panel"
              style={{
                padding: '28px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '24px',
                borderLeft: '4px solid #f59e0b'
              }}
            >
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.3) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)',
                  flexShrink: 0
                }}>
                  <Award size={34} color="#fbbf24" />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span className="badge-status badge-status-approved" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} />
                      SHA-256 Sealed
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                      +{cert.activityPointsAwarded} AICTE Activity Points
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      • {cert.organizingClub}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: '2px 0 4px' }}>
                    {cert.eventTitle}
                  </h2>

                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    Recipient: <strong>{cert.studentName}</strong> (Roll: {cert.rollNo})
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                    Serial: <strong style={{ color: '#38bdf8' }}>{cert.certificateId}</strong> • Issued: {new Date(cert.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSelectedPreviewCert(cert)}
                  className="btn-secondary"
                  style={{ padding: '9px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Eye size={14} />
                  <span>View Diploma</span>
                </button>

                <Link
                  to={`/verify/${cert.certificateId}`}
                  className="btn-secondary"
                  style={{ padding: '9px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  <ShieldCheck size={14} color="#34d399" />
                  <span>Public URL</span>
                </Link>

                <button
                  onClick={() => handleLinkedInShare(cert)}
                  className="btn-primary"
                  style={{ padding: '9px 16px', fontSize: '0.8rem', background: '#0a66c2', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Share2 size={14} />
                  <span>Add to LinkedIn</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DIPLOMA PREVIEW MODAL */}
      {selectedPreviewCert && (
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
            maxWidth: '820px',
            background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
            border: '2px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedPreviewCert(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#cbd5e1',
                padding: '8px',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            {/* Crest & College Header */}
            <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '20px', marginBottom: '28px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 14px',
                borderRadius: '20px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#fbbf24',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '10px'
              }}>
                <Building2 size={13} />
                {selectedPreviewCert.institution || 'Arya College of Engineering & IT (ACEIT), Jaipur'}
              </div>

              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f8fafc', margin: 0, textTransform: 'uppercase' }}>
                Certificate of Merit & Participation
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '4px' }}>
                Affiliated to Rajasthan Technical University (RTU) & Approved by AICTE, New Delhi
              </p>
            </div>

            {/* Recipient Details */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                This is proudly presented to
              </span>

              <h3 style={{
                fontSize: '2.2rem',
                fontWeight: 900,
                color: '#fbbf24',
                margin: '8px 0 4px',
                fontFamily: 'serif'
              }}>
                {selectedPreviewCert.studentName}
              </h3>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <span>University Roll No: <strong>{selectedPreviewCert.rollNo}</strong></span>
                <span>•</span>
                <span>Department: <strong>{selectedPreviewCert.department || 'Computer Science & Engineering'}</strong></span>
              </div>

              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5, marginTop: '14px' }}>
                for active participation and successful gate-verified attendance in{' '}
                <strong style={{ color: '#f8fafc' }}>"{selectedPreviewCert.eventTitle}"</strong> organized by{' '}
                <strong style={{ color: '#38bdf8' }}>{selectedPreviewCert.organizingClub}</strong>.
              </p>
            </div>

            {/* Badges */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              marginBottom: '24px'
            }}>
              <div>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Serial Number</span>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  {selectedPreviewCert.certificateId}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>AICTE Points</span>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                  +{selectedPreviewCert.activityPointsAwarded} Points
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Issue Date</span>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>
                  {new Date(selectedPreviewCert.issuedAt).toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>

            {/* SHA Hash */}
            <div style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '2px' }}>
                Cryptographic Seal (SHA-256)
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94a3b8', wordBreak: 'break-all' }}>
                {selectedPreviewCert.verificationHash}
              </div>
            </div>

            {/* Signatory */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '18px' }}>
              <div>
                <div style={{ fontStyle: 'italic', fontFamily: 'serif', color: '#fbbf24', fontSize: '0.95rem' }}>
                  {selectedPreviewCert.deanSignatory}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Dean Academics & Student Welfare</div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => window.print()}
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Printer size={13} />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => handleLinkedInShare(selectedPreviewCert)}
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.8rem', background: '#0a66c2', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Share2 size={13} />
                  <span>LinkedIn</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
