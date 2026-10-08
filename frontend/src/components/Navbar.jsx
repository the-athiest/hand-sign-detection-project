import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  FiVideo,
  FiBookOpen,
  FiInfo,
  FiHome,
  FiMenu,
  FiX,
  FiCpu,
} from 'react-icons/fi';
import { TbHandStop, TbDeviceVisionPro } from 'react-icons/tb';

export function Navbar({ backendStatus = 'online' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Overview', icon: FiHome },
    { to: '/detection', label: 'Vision Studio', icon: FiVideo },
    { to: '/signs', label: 'Gesture Catalog', icon: FiBookOpen },
    { to: '/about', label: 'Geometry & Docs', icon: FiInfo },
  ];

  return (
    <div
      style={{
        position: 'sticky',
        top: '12px',
        zIndex: 100,
        padding: '0 24px',
        width: '100%',
        pointerEvents: 'none',
      }}
    >
      <header
        style={{
          maxWidth: '1540px',
          margin: '0 auto',
          background: 'rgba(9, 14, 26, 0.78)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          pointerEvents: 'auto',
          transition: 'all var(--transition-normal)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
            padding: '0 22px',
          }}
        >
          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(14, 165, 233, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              <TbHandStop style={{ color: '#ffffff', fontSize: '1.35rem' }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: '#ffffff',
                  }}
                >
                  HandSense
                </span>
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    color: 'var(--accent-cyan)',
                    background: 'var(--accent-cyan-subtle)',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    border: '1px solid var(--accent-cyan-border)',
                    letterSpacing: '0.06em',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  CV
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--text-dim)',
                  letterSpacing: '0.04em',
                  display: 'block',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                MediaPipe Neural Core
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(4, 7, 14, 0.5)',
              padding: '4px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '7px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'}`,
                    transition: 'all var(--transition-fast)',
                  })}
                >
                  <Icon style={{ fontSize: '0.9rem' }} />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Section: Engine Status & Launch Studio CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Engine Status Beacon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(5, 9, 18, 0.65)',
                border: '1px solid var(--border-glass)',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span
                className={`status-dot ${backendStatus === 'online' ? 'active' : 'inactive'}`}
              />
              <span style={{ display: 'none', color: 'var(--text-dim)' }} className="status-label-desktop">
                ENGINE:
              </span>
              <span
                style={{
                  color: backendStatus === 'online' ? 'var(--status-open)' : 'var(--status-closed)',
                  fontWeight: 700,
                }}
              >
                {backendStatus === 'online' ? 'ACTIVE' : 'OFFLINE'}
              </span>
            </div>

            <Link
              to="/detection"
              className="btn btn-primary btn-sm"
              style={{ display: 'none', borderRadius: 'var(--radius-full)', padding: '8px 18px' }}
              id="nav-cta-btn"
            >
              <FiVideo /> Live Studio
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                cursor: 'pointer',
              }}
              className="mobile-toggle"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              background: 'rgba(9, 14, 26, 0.98)',
              backdropFilter: 'blur(24px)',
              borderTop: '1px solid var(--border-glass)',
              borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
              padding: '16px 20px 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '11px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--accent-cyan-subtle)' : 'transparent',
                    border: `1px solid ${isActive ? 'var(--accent-cyan-border)' : 'transparent'}`,
                  })}
                >
                  <Icon style={{ fontSize: '1.05rem' }} />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
            <Link
              to="/detection"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary"
              style={{ marginTop: '8px', borderRadius: 'var(--radius-full)' }}
            >
              <FiVideo /> Launch Vision Studio
            </Link>
          </div>
        )}

        <style>{`
          @media (min-width: 820px) {
            .desktop-nav { display: flex !important; }
            #nav-cta-btn { display: inline-flex !important; }
            .mobile-toggle { display: none !important; }
            .status-label-desktop { display: inline !important; }
          }
        `}</style>
      </header>
    </div>
  );
}

export default Navbar;
