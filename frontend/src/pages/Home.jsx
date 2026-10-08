import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiVideo,
  FiBookOpen,
  FiZap,
  FiCheckCircle,
  FiShield,
  FiCpu,
  FiArrowRight,
  FiActivity,
  FiCompass,
} from 'react-icons/fi';
import {
  TbHandFinger,
  TbHandStop,
  TbDeviceVisionPro,
  TbGeometry,
  TbHandMove,
  TbFocusCentered,
  TbMathSymbols,
} from 'react-icons/tb';

const SIM_PRESETS = {
  PEACE: {
    name: 'PEACE',
    emoji: '✌️',
    match: 'MATCH: PEACE (98.4%)',
    palmScale: 'S_palm = 0.428',
    extensions: 'Index + Middle (2/5)',
    statusColor: 'var(--status-open)',
    thumb: { tipX: 38, tipY: 72, isOpen: false },
    index: { tipX: 75, tipY: 30, isOpen: true },
    middle: { tipX: 110, tipY: 25, isOpen: true },
    ring: { tipX: 135, tipY: 90, isOpen: false },
    pinky: { tipX: 155, tipY: 105, isOpen: false },
  },
  'I LOVE YOU': {
    name: 'I LOVE YOU',
    emoji: '🤟',
    match: 'MATCH: I LOVE YOU (97.6%)',
    palmScale: 'S_palm = 0.435',
    extensions: 'Thumb + Index + Pinky (3/5)',
    statusColor: 'var(--status-open)',
    thumb: { tipX: 25, tipY: 55, isOpen: true },
    index: { tipX: 75, tipY: 30, isOpen: true },
    middle: { tipX: 110, tipY: 88, isOpen: false },
    ring: { tipX: 135, tipY: 92, isOpen: false },
    pinky: { tipX: 165, tipY: 38, isOpen: true },
  },
  'THUMBS UP': {
    name: 'THUMBS UP',
    emoji: '👍',
    match: 'MATCH: THUMBS UP (99.1%)',
    palmScale: 'S_palm = 0.412',
    extensions: 'Thumb (1/5)',
    statusColor: 'var(--status-open)',
    thumb: { tipX: 35, tipY: 35, isOpen: true },
    index: { tipX: 82, tipY: 95, isOpen: false },
    middle: { tipX: 110, tipY: 95, isOpen: false },
    ring: { tipX: 135, tipY: 95, isOpen: false },
    pinky: { tipX: 155, tipY: 105, isOpen: false },
  },
  FIST: {
    name: 'FIST',
    emoji: '✊',
    match: 'MATCH: FIST (98.9%)',
    palmScale: 'S_palm = 0.401',
    extensions: 'All Folded (0/5)',
    statusColor: 'var(--status-closed)',
    thumb: { tipX: 45, tipY: 82, isOpen: false },
    index: { tipX: 82, tipY: 95, isOpen: false },
    middle: { tipX: 110, tipY: 95, isOpen: false },
    ring: { tipX: 135, tipY: 95, isOpen: false },
    pinky: { tipX: 155, tipY: 105, isOpen: false },
  },
  'OPEN PALM': {
    name: 'OPEN PALM',
    emoji: '🖐️',
    match: 'MATCH: OPEN PALM (99.5%)',
    palmScale: 'S_palm = 0.442',
    extensions: 'All Fingers (5/5)',
    statusColor: 'var(--status-open)',
    thumb: { tipX: 25, tipY: 55, isOpen: true },
    index: { tipX: 75, tipY: 30, isOpen: true },
    middle: { tipX: 110, tipY: 25, isOpen: true },
    ring: { tipX: 140, tipY: 35, isOpen: true },
    pinky: { tipX: 165, tipY: 45, isOpen: true },
  },
};

export function Home() {
  const [activeSimKey, setActiveSimKey] = useState('PEACE');
  const sim = SIM_PRESETS[activeSimKey] || SIM_PRESETS['PEACE'];

  const showcaseGestures = [
    { name: 'PEACE', emoji: '✌️', count: 2, category: 'Gestures', icon: TbHandFinger, desc: 'Index + Middle in V-formation' },
    { name: 'I LOVE YOU', emoji: '🤟', count: 3, category: 'ASL Signs', icon: TbHandMove, desc: 'Thumb + Index + Pinky extended' },
    { name: 'THUMBS UP', emoji: '👍', count: 1, category: 'Gestures', icon: TbFocusCentered, desc: 'Thumb raised straight upward' },
    { name: 'FIST', emoji: '✊', count: 0, category: 'Basic', icon: TbHandStop, desc: 'All 5 fingers curled to palm' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '96px', padding: '60px 0 100px' }}>
      {/* 1. Asymmetric Split Hero Section (Anti-Center Bias) */}
      <section className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
            gap: '48px',
            alignItems: 'center',
          }}
          className="hero-split-grid"
        >
          {/* Left Column: Bold Typography & Technical Proposition */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start' }}>
              <span className="badge badge-cyan">
                <TbDeviceVisionPro style={{ fontSize: '0.9rem' }} /> COMPUTER VISION PIPELINE
              </span>
              <span className="badge badge-neutral">v1.0.0 STABLE</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: '#ffffff',
              }}
            >
              Real-Time Biometric Hand Pose Estimation
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              High-throughput optical tracking engine mapping 21 anatomical joints with rotation-invariant
              palm scaling. Classify 20+ predefined hand gestures over low-latency WebSockets under 30ms.
            </p>

            {/* Technical Metric Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                padding: '16px 0',
                borderTop: '1px solid var(--border-subtle)',
                borderBottom: '1px solid var(--border-subtle)',
                margin: '4px 0',
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  LANDMARKS
                </span>
                <strong style={{ display: 'block', fontSize: '1.5rem', fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
                  21
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3D Joints</span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  STREAM LATENCY
                </span>
                <strong style={{ display: 'block', fontSize: '1.5rem', fontFamily: 'var(--font-mono)', color: 'var(--status-open)' }}>
                  &lt;30ms
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WebSocket RTT</span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  GESTURE MODELS
                </span>
                <strong style={{ display: 'block', fontSize: '1.5rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  20+
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ASL & Numbers</span>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/detection" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '0.96rem' }}>
                <FiVideo /> Launch Vision Studio <FiArrowRight />
              </Link>
              <Link to="/signs" className="btn btn-secondary" style={{ padding: '14px 24px', fontSize: '0.96rem' }}>
                <FiBookOpen /> Gesture Catalog
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Optical Visualizer Simulator */}
          <div
            className="glass-panel"
            style={{
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              background: 'radial-gradient(ellipse at 50% 30%, rgba(14, 165, 233, 0.12) 0%, rgba(7, 11, 20, 0.85) 80%)',
            }}
          >
            <span className="hud-corner hud-corner-tl" />
            <span className="hud-corner hud-corner-tr" />
            <span className="hud-corner hud-corner-bl" />
            <span className="hud-corner hud-corner-br" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="status-dot active" />
                <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  OPTICAL SIMULATOR
                </span>
              </div>
              <span className="badge badge-cyan">30 FPS ENGINE</span>
            </div>

            {/* Interactive Simulation Switcher Pills */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                flexWrap: 'wrap',
                background: 'rgba(4, 7, 14, 0.65)',
                padding: '6px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {Object.keys(SIM_PRESETS).map((key) => {
                const item = SIM_PRESETS[key];
                const isSelected = activeSimKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveSimKey(key)}
                    style={{
                      flex: '1 1 auto',
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'var(--accent-cyan)' : 'transparent',
                      border: 'none',
                      color: isSelected ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      transition: 'all var(--transition-fast)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Stylized Vector Skeleton Preview Canvas Simulator */}
            <div
              style={{
                height: '260px',
                background: 'rgba(4, 7, 14, 0.75)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {/* Coordinate Grid lines */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Dynamic Geometric Hand Skeleton SVG */}
              <svg width="220" height="230" viewBox="0 0 200 220" style={{ zIndex: 1, transition: 'all 0.3s ease' }}>
                {/* Palm Base Lines to Knuckles */}
                <line x1="100" y1="180" x2="60" y2="120" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.8" />
                <line x1="100" y1="180" x2="85" y2="105" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.8" />
                <line x1="100" y1="180" x2="110" y2="100" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.8" />
                <line x1="100" y1="180" x2="135" y2="105" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.8" />
                <line x1="100" y1="180" x2="155" y2="120" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.8" />

                {/* Knuckle Cross Links (Palmar Arch) */}
                <line x1="60" y1="120" x2="85" y2="105" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.5" strokeDasharray="3 3" />
                <line x1="85" y1="105" x2="110" y2="100" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.5" strokeDasharray="3 3" />
                <line x1="110" y1="100" x2="135" y2="105" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.5" strokeDasharray="3 3" />
                <line x1="135" y1="105" x2="155" y2="120" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.5" strokeDasharray="3 3" />

                {/* Thumb Bone */}
                <line x1="60" y1="120" x2="45" y2="85" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.8" />
                <line
                  x1="45"
                  y1="85"
                  x2={sim.thumb.tipX}
                  y2={sim.thumb.tipY}
                  stroke={sim.thumb.isOpen ? '#10b981' : '#f43f5e'}
                  strokeWidth="2.5"
                  opacity="0.9"
                />

                {/* Index Bone */}
                <line x1="85" y1="105" x2="80" y2="65" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.8" />
                <line
                  x1="80"
                  y1="65"
                  x2={sim.index.tipX}
                  y2={sim.index.tipY}
                  stroke={sim.index.isOpen ? '#10b981' : '#f43f5e'}
                  strokeWidth="2.5"
                  opacity="0.9"
                />

                {/* Middle Bone */}
                <line x1="110" y1="100" x2="110" y2="60" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.8" />
                <line
                  x1="110"
                  y1="60"
                  x2={sim.middle.tipX}
                  y2={sim.middle.tipY}
                  stroke={sim.middle.isOpen ? '#10b981' : '#f43f5e'}
                  strokeWidth="2.5"
                  opacity="0.9"
                />

                {/* Ring Bone */}
                <line x1="135" y1="105" x2="135" y2="75" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.8" />
                <line
                  x1="135"
                  y1="75"
                  x2={sim.ring.tipX}
                  y2={sim.ring.tipY}
                  stroke={sim.ring.isOpen ? '#10b981' : '#f43f5e'}
                  strokeWidth="2.5"
                  opacity="0.9"
                />

                {/* Pinky Bone */}
                <line x1="155" y1="120" x2="155" y2="90" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.8" />
                <line
                  x1="155"
                  y1="90"
                  x2={sim.pinky.tipX}
                  y2={sim.pinky.tipY}
                  stroke={sim.pinky.isOpen ? '#10b981' : '#f43f5e'}
                  strokeWidth="2.5"
                  opacity="0.9"
                />

                {/* Landmark Keypoints */}
                <circle cx="100" cy="180" r="5" fill="#38bdf8" />
                <circle cx="60" cy="120" r="4" fill="#cbd5e1" />
                <circle cx="45" cy="85" r="4" fill="#cbd5e1" />
                <circle cx={sim.thumb.tipX} cy={sim.thumb.tipY} r="5.5" fill={sim.thumb.isOpen ? '#10b981' : '#f43f5e'} />

                <circle cx="85" cy="105" r="4" fill="#cbd5e1" />
                <circle cx="80" cy="65" r="4" fill="#cbd5e1" />
                <circle cx={sim.index.tipX} cy={sim.index.tipY} r="5.5" fill={sim.index.isOpen ? '#10b981' : '#f43f5e'} />

                <circle cx="110" cy="100" r="4" fill="#cbd5e1" />
                <circle cx="110" cy="60" r="4" fill="#cbd5e1" />
                <circle cx={sim.middle.tipX} cy={sim.middle.tipY} r="5.5" fill={sim.middle.isOpen ? '#10b981' : '#f43f5e'} />

                <circle cx="135" cy="105" r="4" fill="#cbd5e1" />
                <circle cx="135" cy="75" r="4" fill="#cbd5e1" />
                <circle cx={sim.ring.tipX} cy={sim.ring.tipY} r="5.5" fill={sim.ring.isOpen ? '#10b981' : '#f43f5e'} />

                <circle cx="155" cy="120" r="4" fill="#cbd5e1" />
                <circle cx="155" cy="90" r="4" fill="#cbd5e1" />
                <circle cx={sim.pinky.tipX} cy={sim.pinky.tipY} r="5.5" fill={sim.pinky.isOpen ? '#10b981' : '#f43f5e'} />
              </svg>

              {/* Real-time Recognition Tag */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(8, 14, 28, 0.92)',
                  border: '1px solid var(--border-glass)',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  color: sim.statusColor,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{sim.emoji}</span>
                <span>{sim.match}</span>
              </div>
            </div>

            {/* Real-time telemetry readouts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div
                style={{
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  PALM SCALE
                </span>
                <span style={{ display: 'block', fontSize: '0.92rem', fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
                  {sim.palmScale}
                </span>
              </div>
              <div
                style={{
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  OPEN EXTENSIONS
                </span>
                <span style={{ display: 'block', fontSize: '0.92rem', fontFamily: 'var(--font-mono)', color: sim.statusColor }}>
                  {sim.extensions}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Bento 2.0 Architectural Feature Matrix (Anti-3-Card Cliché) */}
      <section className="container">
        <div style={{ marginBottom: '36px' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '10px' }}>
            CORE SPECIFICATION
          </span>
          <h2 style={{ letterSpacing: '-0.02em', color: '#ffffff' }}>
            Built for High-Precision Optical Classification
          </h2>
          <p style={{ marginTop: '8px' }}>
            Combining neural landmark prediction with scale-invariant Euclidean distance formulas.
          </p>
        </div>

        <div className="bento-grid">
          {/* Bento Card 1 (Span 8): 21 Landmarks Core */}
          <div className="bento-col-8 glass-panel" style={{ padding: '36px' }}>
            <span className="hud-corner hud-corner-tl" />
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'var(--accent-cyan-subtle)',
                border: '1px solid var(--accent-cyan-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)',
                marginBottom: '20px',
              }}
            >
              <TbDeviceVisionPro style={{ fontSize: '1.4rem' }} />
            </div>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: '#ffffff' }}>
              21-Joint 3D Anatomical Skeletal Mapping
            </h3>
            <p style={{ lineHeight: 1.6, color: 'var(--text-muted)' }}>
              MediaPipe Hands extracts precise (x, y, z) coordinates for 21 anatomical landmarks across the wrist,
              metacarpophalangeal (MCP) knuckles, interphalangeal (PIP/DIP) joints, and fingertips.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginTop: '24px',
              }}
            >
              {['Wrist #0', 'Thumb #1-4', 'Index #5-8', 'Middle #9-12', 'Ring #13-16', 'Pinky #17-20'].map((pt) => (
                <span
                  key={pt}
                  style={{
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-xs)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {pt}
                </span>
              ))}
            </div>
          </div>

          {/* Bento Card 2 (Span 4): Scale-Invariant Formula */}
          <div className="bento-col-4 glass-panel" style={{ padding: '36px' }}>
            <span className="hud-corner hud-corner-tr" />
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid var(--status-open-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--status-open)',
                marginBottom: '20px',
              }}
            >
              <TbMathSymbols style={{ fontSize: '1.4rem' }} />
            </div>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: '#ffffff' }}>
              Scale Normalization
            </h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.55 }}>
              Joint distances are normalized by the palm baseline length, ensuring flawless classification regardless
              of hand distance or camera focal length.
            </p>

            <div
              style={{
                marginTop: '20px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(4, 7, 14, 0.8)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.84rem',
                color: '#38bdf8',
              }}
            >
              S_palm = ||P_9 - P_0||
            </div>
          </div>

          {/* Bento Card 3 (Span 6): WebSocket Streaming */}
          <div className="bento-col-6 glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <FiZap style={{ color: 'var(--accent-cyan)', fontSize: '1.3rem' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>High-Frequency WebSocket Pipeline</h3>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
              Bi-directional JSON stream delivers sub-30ms round-trip responses. Downscaled 480px capture frames
              optimize payload size while preserving full-fidelity landmark accuracy.
            </p>
          </div>

          {/* Bento Card 4 (Span 6): Multi-Hand Tracking */}
          <div className="bento-col-6 glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <TbHandStop style={{ color: 'var(--status-open)', fontSize: '1.3rem' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Handedness & Dual-Hand Detection</h3>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
              Automatically detects Left vs Right hand orientation. Tracks up to two hands simultaneously with
              distinct coordinate spaces and independent gesture state machines.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Gesture Library Showcase */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>
              PRESET MODELS
            </span>
            <h2 style={{ letterSpacing: '-0.02em', color: '#ffffff' }}>
              Recognized Gesture Catalog
            </h2>
          </div>
          <Link to="/signs" className="btn btn-secondary btn-sm">
            View All 20 Signs <FiArrowRight />
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {showcaseGestures.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                    {item.category}
                  </span>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-cyan)',
                    }}
                  >
                    <IconComponent style={{ fontSize: '1.3rem' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '1.35rem', lineHeight: 1 }}>{item.emoji}</span>
                    <strong style={{ fontSize: '1.2rem', color: '#ffffff', letterSpacing: '-0.01em' }}>
                      {item.name}
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                    {item.desc}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: 'var(--text-dim)',
                  }}
                >
                  <span>Fingers: <strong style={{ color: '#ffffff' }}>{item.count}</strong></span>
                  <span style={{ color: 'var(--status-open)' }}>Live Supported</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Bottom Launch Banner */}
      <section className="container">
        <div
          className="glass-panel"
          style={{
            padding: '54px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            background: 'radial-gradient(ellipse at 80% 50%, rgba(14, 165, 233, 0.12) 0%, rgba(13, 20, 36, 0.85) 70%)',
          }}
        >
          <div>
            <h2 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Ready to Test with Your Webcam?
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '580px' }}>
              Launch the Vision Studio directly in your browser. All frame processing runs in local memory with zero recording.
            </p>
          </div>

          <Link to="/detection" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '1rem' }}>
            <FiVideo /> Enter Live CV Studio <FiArrowRight />
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 960px) {
          .hero-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
