import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, UserPlus, CheckCircle2, ArrowRight } from 'lucide-react';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
];

const INTEREST_TAGS = [
  'Competitive Coding',
  'Hackathons',
  'Robotics',
  'Drones & UAVs',
  'AI & Machine Learning',
  'Esports & Gaming',
  'Cultural & Dance',
  'Music & Bands',
  'Literature & Debate',
  'Open Source / Linux',
  'Social CSR Drives',
  'Chess & Strategy',
];

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [semester, setSemester] = useState(4);
  const [password, setPassword] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Competitive Coding', 'Hackathons']);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const toggleInterest = (tag: string) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter(t => t !== tag));
    } else {
      setSelectedInterests([...selectedInterests, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !rollNo || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await register({
        name,
        email,
        password,
        rollNo,
        enrollmentNo: enrollmentNo.trim() || undefined,
        department,
        semester,
      });

      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          navigate('/profile');
        }, 800);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('Failed to complete registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{ maxWidth: '640px', width: '100%' }}>
        {/* Header */}
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
            marginBottom: '14px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <Building2 size={30} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Student Enrollment Registration
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>
            Arya College of Engineering & IT (ACEIT), Jaipur
          </p>
        </div>

        {/* Card */}
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
            {/* Name, RTU Roll No, & Enrollment No */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="glass-input"
                  placeholder="e.g. Govind Jangid"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  RTU Roll Number *
                </label>
                <input
                  type="text"
                  required
                  value={rollNo}
                  onChange={e => setRollNo(e.target.value.toUpperCase())}
                  className="glass-input"
                  placeholder="e.g. 22EACIT089"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Enrollment Number
                </label>
                <input
                  type="text"
                  value={enrollmentNo}
                  onChange={e => setEnrollmentNo(e.target.value.toUpperCase())}
                  className="glass-input"
                  placeholder="e.g. 22EAICSE089"
                />
              </div>
            </div>

            {/* Email & Password */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Institutional Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="glass-input"
                  placeholder="name@aryacollege.in"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="glass-input"
                  placeholder="Minimum 8 characters"
                />
              </div>
            </div>

            {/* Department & Semester */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Engineering Department *
                </label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="glass-input"
                  style={{ background: '#0d1629' }}
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Semester *
                </label>
                <select
                  value={semester}
                  onChange={e => setSemester(Number(e.target.value))}
                  className="glass-input"
                  style={{ background: '#0d1629' }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interest Tags */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                Extracurricular & Technical Interests (Used by AI Recommender)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {INTEREST_TAGS.map(tag => {
                  const selected = selectedInterests.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleInterest(tag)}
                      style={{
                        background: selected ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        border: selected ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: selected ? '#38bdf8' : '#94a3b8',
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {selected ? '✓ ' : '+ '}{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '10px' }}
            >
              {loading ? (
                'Creating Student Account...'
              ) : (
                <>
                  <UserPlus size={18} />
                  Complete Enrollment Registration
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '22px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '18px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Already registered?{' '}
            </span>
            <Link to="/login" style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600, textDecoration: 'none' }}>
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
