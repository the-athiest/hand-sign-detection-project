import React from 'react';
import {
  FiCpu,
  FiShield,
  FiCode,
  FiCheckCircle,
  FiLayers,
  FiCompass,
} from 'react-icons/fi';
import { TbHandFinger, TbGeometry, TbSparkles, TbMathSymbols } from 'react-icons/tb';

export function About() {
  const landmarkGroups = [
    { name: 'Wrist Anchor', range: 'Point 0', desc: 'Root origin of the 3D anatomical coordinate space.' },
    { name: 'Thumb', range: 'Points 1 - 4', desc: 'CMC (1), MCP (2), IP (3), TIP (4) opposition chain' },
    { name: 'Index Finger', range: 'Points 5 - 8', desc: 'MCP (5), PIP (6), DIP (7), TIP (8) tracking' },
    { name: 'Middle Finger', range: 'Points 9 - 12', desc: 'MCP (9), PIP (10), DIP (11), TIP (12) tracking' },
    { name: 'Ring Finger', range: 'Points 13 - 16', desc: 'MCP (13), PIP (14), DIP (15), TIP (16) tracking' },
    { name: 'Pinky Finger', range: 'Points 17 - 20', desc: 'MCP (17), PIP (18), DIP (19), TIP (20) tracking' },
  ];

  return (
    <div
      className="container"
      style={{
        padding: '48px 32px 96px',
        display: 'flex',
        flexDirection: 'column',
        gap: '64px',
        maxWidth: '1540px',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>
          MATHEMATICAL FOUNDATION
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '12px' }}>
          Anatomical Geometry & Algorithms
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.65 }}>
          HandSense AI replaces brittle screen-coordinate heuristic checks with scale-invariant Euclidean ratios,
          enabling orientation-independent finger extension classification across variable distances.
        </p>
      </div>

      {/* 1. MediaPipe 21 Landmarks Section */}
      <section className="glass-panel" style={{ padding: '38px' }}>
        <span className="hud-corner hud-corner-tl" />
        <span className="hud-corner hud-corner-tr" />

        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <TbHandFinger style={{ color: 'var(--accent-cyan)', fontSize: '1.5rem' }} />
            <h2 style={{ fontSize: '1.7rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
              The 21 Anatomical Joint Landmarks
            </h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem' }}>
            MediaPipe Hands predicts 21 3D coordinate vectors (x, y, z) per hand in real-time. The system maps these
            points to identify skeletal knuckles, interphalangeal joints, and fingertip endpoints.
          </p>
        </div>

        <div className="grid-3">
          {landmarkGroups.map((grp, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(6, 11, 22, 0.55)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#ffffff', fontSize: '1rem' }}>{grp.name}</strong>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--accent-cyan)',
                    background: 'var(--accent-cyan-subtle)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--accent-cyan-border)',
                    fontWeight: 700,
                  }}
                >
                  {grp.range}
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>{grp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Mathematical Geometry & Scale Invariance */}
      <section className="glass-panel" style={{ padding: '38px' }}>
        <span className="hud-corner hud-corner-bl" />
        <span className="hud-corner hud-corner-br" />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <TbGeometry style={{ color: 'var(--accent-cyan)', fontSize: '1.6rem' }} />
          <h2 style={{ fontSize: '1.7rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Scale & Tilt Invariant Geometry
          </h2>
        </div>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.65, fontSize: '0.96rem' }}>
          Naïve tutorials rely on brittle comparisons like <code style={{ color: 'var(--status-closed)', fontFamily: 'var(--font-mono)' }}>tip.y &lt; pip.y</code>,
          which breaks whenever the hand tilts sideways or inverts. HandSense AI resolves this through four mathematical invariants:
        </p>

        <div className="grid-2">
          {/* Palm Scaling */}
          <div
            style={{
              background: 'rgba(6, 11, 22, 0.55)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
            }}
          >
            <strong style={{ color: 'var(--accent-cyan)', fontSize: '1.1rem' }}>
              1. Dynamic Palm Scale Normalization
            </strong>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Computes the base Euclidean distance between Wrist (0) and Middle MCP (9):
            </p>
            <div
              style={{
                background: 'rgba(4, 7, 14, 0.8)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.86rem',
                color: '#38bdf8',
                border: '1px solid var(--border-subtle)',
              }}
            >
              S_palm = ||P_9 - P_0|| = sqrt((x_9 - x_0)^2 + (y_9 - y_0)^2)
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-dim)' }}>
              All joint distances are divided by S_palm, guaranteeing identical finger detection ratios whether your hand
              is 1 foot or 6 feet from the camera lens.
            </p>
          </div>

          {/* Finger Extension Ratios */}
          <div
            style={{
              background: 'rgba(6, 11, 22, 0.55)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
            }}
          >
            <strong style={{ color: '#ffffff', fontSize: '1.1rem' }}>
              2. Vector Alignment & Anatomical Ratios
            </strong>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Evaluates fingertip distance relative to MCP and PIP joints:
            </p>
            <div
              style={{
                background: 'rgba(4, 7, 14, 0.8)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.86rem',
                color: '#38bdf8',
                border: '1px solid var(--border-subtle)',
              }}
            >
              Ratio = ||P_tip - P_mcp|| / ||P_pip - P_mcp|| &gt; 1.25
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-dim)' }}>
              When curled into a fist, the tip folds towards the MCP base, causing the ratio to sharply decrease below 1.0.
            </p>
          </div>

          {/* Thumb Opposition */}
          <div
            style={{
              background: 'rgba(6, 11, 22, 0.55)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
            }}
          >
            <strong style={{ color: 'var(--status-open)', fontSize: '1.1rem' }}>
              3. Thumb Opposition to Pinky Base
            </strong>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              The thumb moves across a distinct opposing axis. Distance is measured from Thumb Tip (4) to Pinky MCP (17):
            </p>
            <div
              style={{
                background: 'rgba(4, 7, 14, 0.8)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.86rem',
                color: '#34d399',
                border: '1px solid var(--border-subtle)',
              }}
            >
              R_thumb = ||P_4 - P_17|| / ||P_3 - P_17|| &gt; 1.08
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-dim)' }}>
              Because Pinky MCP resides on the opposite perimeter of the hand, this vector provides a rotation-invariant baseline.
            </p>
          </div>

          {/* Multi-Hand Processing */}
          <div
            style={{
              background: 'rgba(6, 11, 22, 0.55)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
            }}
          >
            <strong style={{ color: 'var(--accent-cyan)', fontSize: '1.1rem' }}>
              4. Handedness Classification & Dual Tracking
            </strong>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              MediaPipe's classification head detects left vs right hand orientation. The pipeline automatically
              adapts coordinates for up to two hands simultaneously.
            </p>
            <div
              style={{
                background: 'rgba(4, 7, 14, 0.8)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.84rem',
                color: '#38bdf8',
                border: '1px solid var(--border-subtle)',
              }}
            >
              Hands_Count: 2 | Latency: ~25ms | WebSocket FPS: 30
            </div>
          </div>
        </div>
      </section>

      {/* 3. Tech Specs & Privacy */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        <div className="glass-panel" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <FiCpu style={{ color: 'var(--accent-cyan)', fontSize: '1.4rem' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>Core Engine Specifications</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
            <li>• <strong>Python 3.11+</strong>: High-speed native backend execution</li>
            <li>• <strong>MediaPipe Hands 0.10+</strong>: 21-joint 3D neural landmark extraction</li>
            <li>• <strong>OpenCV Headless</strong>: Real-time image processing and matrix transformations</li>
            <li>• <strong>FastAPI & WebSockets</strong>: 30 FPS bi-directional frame streaming</li>
            <li>• <strong>React 19 & Vite</strong>: Reactive glassmorphism dashboard with HTML5 Canvas</li>
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <FiShield style={{ color: 'var(--status-open)', fontSize: '1.4rem' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>Privacy & Hardware Safety</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            HandSense AI runs all computer vision operations strictly in volatile memory. No images, video frames,
            or biometric templates are stored to persistent disk or transmitted across external cloud servers.
            The camera stream exists solely within the active local pair of FastAPI and React.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
