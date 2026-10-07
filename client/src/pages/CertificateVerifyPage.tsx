import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Calendar, 
  User, 
  Hash, 
  FileCheck, 
  ExternalLink, 
  Printer, 
  Share2, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { verifyCertificatePublic } from '../services/api';
import { Certificate } from '../types';

export const CertificateVerifyPage: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!certificateId) return;
    const loadCert = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await verifyCertificatePublic(certificateId);
        setCert(data);
      } catch (err: any) {
        setError(err.message || 'Verification failed. Serial number not recognized.');
      } finally {
        setLoading(false);
      }
    };
    loadCert();
  }, [certificateId]);

  const handlePrint = () => {
    window.print();
  };

  const handleLinkedInShare = () => {
    if (!cert) return;
    const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.eventTitle)}&organizationName=${encodeURIComponent(cert.institution || 'Arya College of Engineering & IT')}&issueYear=2026&issueMonth=10&certUrl=${encodeURIComponent(window.location.href)}&certId=${encodeURIComponent(cert.certificateId)}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ maxWidth: '940px', margin: '40px auto', padding: '0 20px' }}>
      {/* Top Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Link to="/" style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          ← Back to CampusSphere
        </Link>
        <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
          REGISTRY VERIFICATION v5.0
        </span>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <RefreshCw size={36} color="#fbbf24" className="animate-spin" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
            Validating Cryptographic Seal...
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
            Querying Arya College Institutional Registry for Serial ID: <strong>{certificateId}</strong>
          </p>
        </div>
      ) : error ? (
        <div className="glass-panel" style={{ padding: '48px 32px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '2px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
          }}>
            <AlertTriangle size={32} color="#ef4444" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171' }}>
            Credential Verification Failed
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', maxWidth: '520px', margin: '10px auto 20px', lineHeight: 1.6 }}>
            {error}
          </p>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontFamily: 'var(--font-mono)', marginBottom: '24px' }}>
            Searched Serial: {certificateId}
          </div>
          <Link to="/certificates" className="btn-secondary" style={{ display: 'inline-flex', padding: '10px 20px', fontSize: '0.85rem', textDecoration: 'none' }}>
            View Verified Student Credentials
          </Link>
        </div>
      ) : cert ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Official Verification Header Badge */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '20px',
            padding: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '18px',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 18px rgba(16, 185, 129, 0.4)'
              }}>
                <ShieldCheck size={36} color="#ffffff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#34d399',
                    background: 'rgba(16, 185, 129, 0.2)',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    Cryptographically Validated
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Institutional Ledger Registry
                  </span>
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f8fafc', margin: '4px 0 0' }}>
                  Authentic Arya College Credential
                </h1>
                <p style={{ color: '#cbd5e1', fontSize: '0.82rem', margin: '2px 0 0' }}>
                  Official AICTE-accredited activity points transcript document.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleLinkedInShare}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.8rem', background: '#0a66c2', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Share2 size={14} />
                <span>Verify on LinkedIn</span>
              </button>
              <button
                onClick={handlePrint}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer size={14} />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>

          {/* Master Certificate Display Card */}
          <div className="glass-panel" style={{
            padding: '48px',
            position: 'relative',
            overflow: 'hidden',
            border: '2px solid rgba(245, 158, 11, 0.3)',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.98) 100%)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)'
          }}>
            {/* Watermark / Crest */}
            <div style={{
              position: 'absolute',
              right: '-40px',
              bottom: '-40px',
              opacity: 0.04,
              pointerEvents: 'none'
            }}>
              <Award size={360} color="#fbbf24" />
            </div>

            {/* Certificate Header Banner */}
            <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '24px', marginBottom: '32px' }}>
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
                marginBottom: '12px'
              }}>
                <Building2 size={13} />
                {cert.institution || 'Arya College of Engineering & IT (ACEIT), Jaipur'}
              </div>

              <h2 style={{
                fontSize: '1.9rem',
                fontWeight: 900,
                color: '#f8fafc',
                letterSpacing: '-0.02em',
                margin: 0,
                textTransform: 'uppercase'
              }}>
                Certificate of Merit & Participation
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
                Affiliated to Rajasthan Technical University (RTU) & Approved by AICTE, New Delhi
              </p>
            </div>

            {/* Recipient Details */}
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 36px' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                This is proudly presented to
              </span>

              <h3 style={{
                fontSize: '2.4rem',
                fontWeight: 900,
                color: '#fbbf24',
                letterSpacing: '-0.01em',
                margin: '10px 0 6px',
                fontFamily: 'serif'
              }}>
                {cert.studentName}
              </h3>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.9rem', color: '#cbd5e1', flexWrap: 'wrap' }}>
                <span>University Roll No: <strong>{cert.rollNo}</strong></span>
                <span>•</span>
                <span>Department: <strong>{cert.department || 'Computer Science & Engineering'}</strong></span>
                {cert.semester && (
                  <>
                    <span>•</span>
                    <span>Semester {cert.semester}</span>
                  </>
                )}
              </div>

              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginTop: '18px' }}>
                for outstanding active participation and successful gate-verified attendance in{' '}
                <strong style={{ color: '#f8fafc' }}>"{cert.eventTitle}"</strong> organized by{' '}
                <strong style={{ color: '#38bdf8' }}>{cert.organizingClub}</strong>.
              </p>
            </div>

            {/* Key Certificate Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              padding: '20px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              marginBottom: '32px'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Serial Credential ID</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  {cert.certificateId}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>AICTE Activity Points Awarded</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  +{cert.activityPointsAwarded} Points
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Date of Issuance</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0', marginTop: '4px' }}>
                  {new Date(cert.issuedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>

            {/* Cryptographic SHA-256 Seal Stamp */}
            <div style={{
              padding: '14px 18px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              marginBottom: '36px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Hash size={14} color="#38bdf8" />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                  SHA-256 Tamper-Evident Seal Hash
                </span>
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#94a3b8',
                wordBreak: 'break-all',
                lineHeight: 1.4
              }}>
                {cert.verificationHash}
              </div>
            </div>

            {/* Signatory Footnote */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '24px' }}>
              <div>
                <div style={{
                  fontSize: '1rem',
                  fontFamily: 'serif',
                  fontStyle: 'italic',
                  color: '#fbbf24',
                  borderBottom: '1px dashed #64748b',
                  paddingBottom: '4px',
                  marginBottom: '6px'
                }}>
                  {cert.deanSignatory}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Dean Academics & Student Welfare
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Arya College of Engineering & IT, Jaipur
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>
                  <CheckCircle2 size={15} />
                  <span>Verified Against Live MongoDB Atlas Node</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                  Official Registry: campussphere.aryacollege.in
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
