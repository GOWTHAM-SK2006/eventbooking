'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getSession, setSession, UserSession } from '../../utils/api';
import { User, Mail, Phone, Lock, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSessionState] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Status Alert States
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const sess = getSession();
    if (!sess) {
      router.push('/login');
      return;
    }
    setSessionState(sess);
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = await api.get('/auth/profile');
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phone || '');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setUpdating(true);

    try {
      const res = await api.put('/auth/profile', {
        firstName,
        lastName,
        phone,
        currentPassword: currentPassword.trim() ? currentPassword : null,
        newPassword: newPassword.trim() ? newPassword : null
      });

      // Update local storage session values
      if (session) {
        const updatedSession = {
          ...session,
          firstName,
          lastName
        };
        setSession(updatedSession);
        setSessionState(updatedSession);
      }

      setMessage(res.message || 'Profile updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0', width: '100%' }}>
        <Loader size={40} className="spin" style={{ animation: 'spin 1s linear infinite', color: '#FF6B00' }} />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '800px', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Account Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Keep your contact details up to date and manage security credentials.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        
        {/* Left Side: General Profile Info Card */}
        <div className="glass-card" style={{ padding: '2rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C42 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#FFFFFF'
            }}>
              {firstName.charAt(0)}{lastName.charAt(0)}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>{firstName} {lastName}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{session?.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <Mail size={16} />
              <span>{session?.email}</span>
            </div>
            {phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <Phone size={16} />
                <span>{phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Update Profile Form */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Account Details</h2>

          {message && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              color: '#10B981',
              fontSize: '0.85rem',
              marginBottom: '1.5rem'
            }}>
              <CheckCircle size={18} />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              color: '#EF4444',
              fontSize: '0.85rem',
              marginBottom: '1.5rem'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>First Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0.5rem 0', paddingTop: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#FFFFFF' }}>Change Password</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={updating} className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              {updating ? 'Saving Changes...' : 'Save Profile Details'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
