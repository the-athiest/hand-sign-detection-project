import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';
import { TbHandStop } from 'react-icons/tb';

export function Footer() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-glass)',
        background: 'rgba(5, 8, 17, 0.95)',
        padding: '50px 0 28px',
        color: 'var(--text-muted)',
      }}
    >
      <div className="container" style={{ maxWidth: '1540px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '36px',
            marginBottom: '40px',
          }}
        >
          {/* Brand & Mission */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TbHandStop style={{ color: '#ffffff', fontSize: '1.2rem' }} />
              </div>
              <strong style={{ color: '#ffffff', fontSize: '1.15rem', fontFamily: 'var(--font-heading)' }}>
                HandSense AI
              </strong>
            </div>

            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              Real-time optical finger detection and hand sign recognition system.
              Scale-invariant 3D anatomical geometry powered by MediaPipe and FastAPI.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              <FiShield style={{ color: 'var(--status-open)' }} />
              <span>100% Client-Side Privacy • Zero Frame Logging</span>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.82rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
              STUDIO SUITE
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '0.88rem' }}>
              <Link to="/" style={{ transition: 'color 0.2s', color: 'inherit' }}>System Overview</Link>
              <Link to="/detection" style={{ transition: 'color 0.2s', color: 'inherit' }}>Vision Studio</Link>
              <Link to="/signs" style={{ transition: 'color 0.2s', color: 'inherit' }}>Gesture Catalog</Link>
              <Link to="/about" style={{ transition: 'color 0.2s', color: 'inherit' }}>Geometry & Math</Link>
            </div>
          </div>

          {/* Technology Badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.82rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
              CORE ENGINE STACK
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {['Python 3.11', 'MediaPipe Hands', 'OpenCV', 'FastAPI', 'WebSockets', 'React 19', 'Vite', 'Bento 2.0'].map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontSize: '0.72rem',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-xs)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.8rem',
            color: 'var(--text-dim)',
          }}
        >
          <span>© {new Date().getFullYear()} HandSense AI. All rights reserved.</span>
          <span>Designed for Computer Vision Research & Interactive HCI</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
