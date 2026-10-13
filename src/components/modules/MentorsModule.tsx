import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Users, 
  Star, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { MOCK_MENTORS } from '../../data/defaultData';
import { Mentor } from '../../types';

export const MentorsModule: React.FC = () => {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-10-16');
  const [bookingTime, setBookingTime] = useState('15:00');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
    confetti({
      particleCount: 70,
      spread: 50,
      origin: { y: 0.6 },
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#14B8A6',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          <Users size={14} />
          <span>VERIFIED FOUNDER ADVISORY BOARD</span>
        </div>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.2rem)',
          fontWeight: 900,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-heading)',
          marginTop: '0.2rem',
        }}>
          Mentor Directory & 1-on-1 Booking
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Connect directly with 40+ verified operators and partners from Flipkart, Zomato, Razorpay, and top venture funds.
        </p>
      </div>

      {/* ── Mentors Grid ───────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
      }}>
        {MOCK_MENTORS.map((mentor) => (
          <div
            key={mentor.id}
            className="card-elevated"
            style={{
              borderRadius: '20px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img 
                src={mentor.avatar} 
                alt={mentor.name}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(20, 184, 166, 0.4)',
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {mentor.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#F59E0B', fontSize: '0.8rem', fontWeight: 700 }}>
                    <Star size={13} fill="#F59E0B" />
                    <span>{mentor.rating}</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#14B8A6', fontWeight: 700 }}>
                  {mentor.role}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {mentor.company} • {mentor.sessions} sessions completed
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {mentor.bio}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {mentor.tags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: 'rgba(20, 184, 166, 0.12)',
                    color: '#2DD4BF',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div style={{
              marginTop: 'auto',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 800 }}>
                {mentor.rate}
              </span>

              <button
                onClick={() => {
                  setSelectedMentor(mentor);
                  setIsBooked(false);
                }}
                className="btn-cyan"
                style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
              >
                <span>Book 1-on-1 Call</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Booking Modal ──────────────────────────────────────────────── */}
      {selectedMentor && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid rgba(20, 184, 166, 0.4)',
            padding: '2.5rem',
            maxWidth: '520px',
            width: '100%',
            boxShadow: 'var(--shadow-2xl)',
            position: 'relative',
          }}>
            <button
              onClick={() => setSelectedMentor(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '1.4rem',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>

            {!isBooked ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <img 
                    src={selectedMentor.avatar} 
                    alt={selectedMentor.name}
                    style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Book Session with {selectedMentor.name}
                    </h3>
                    <span style={{ fontSize: '0.82rem', color: '#14B8A6' }}>
                      {selectedMentor.role}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Date
                      </label>
                      <input 
                        type="date" 
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        style={{
                          width: '100%',
                          backgroundColor: 'rgba(2, 4, 10, 0.7)',
                          border: '1px solid rgba(20, 184, 166, 0.3)',
                          borderRadius: '10px',
                          padding: '0.7rem',
                          color: '#FFFFFF',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Time (IST)
                      </label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        style={{
                          width: '100%',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid rgba(20, 184, 166, 0.3)',
                          borderRadius: '10px',
                          padding: '0.7rem',
                          color: '#FFFFFF',
                          fontSize: '0.9rem',
                        }}
                      >
                        <option value="11:00">11:00 AM IST</option>
                        <option value="15:00">03:00 PM IST</option>
                        <option value="17:30">05:30 PM IST</option>
                        <option value="19:00">07:00 PM IST</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Session Agenda & Focus Points
                    </label>
                    <textarea 
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="e.g. Preparing for Blume Ventures lead partner pitch. Need feedback on slide 5 CAC payback bridge..."
                      rows={3}
                      style={{
                        width: '100%',
                        backgroundColor: 'rgba(2, 4, 10, 0.7)',
                        border: '1px solid rgba(20, 184, 166, 0.3)',
                        borderRadius: '10px',
                        padding: '0.75rem',
                        color: '#FFFFFF',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-cyan"
                    style={{ padding: '0.85rem', width: '100%', marginTop: '0.5rem' }}
                  >
                    Confirm Strategy Call
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  Call Confirmed!
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                  Strategy session scheduled with {selectedMentor.name} for {bookingDate} at {bookingTime} IST. Google Meet invitation dispatched to founder email.
                </p>
                <button
                  onClick={() => setSelectedMentor(null)}
                  className="btn-outline"
                  style={{
                    marginTop: '1.5rem',
                    padding: '0.7rem 1.5rem',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
