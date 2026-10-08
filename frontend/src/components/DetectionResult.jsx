import React from 'react';
import {
  FiCheckCircle,
  FiCompass,
  FiInfo,
  FiLayers,
  FiActivity,
} from 'react-icons/fi';
import {
  TbHandMiddleFinger,
  TbHandMove,
  TbSparkles,
  TbCpu,
  TbLayersLinked,
} from 'react-icons/tb';

export function DetectionResult({
  handDetected = false,
  handedness = 'Right',
  gesture = 'WAITING...',
  confidence = 0,
  category = 'None',
  description = '',
  raisedFingers = 0,
  allHands = [],
  selectedHandIndex = 0,
  onSelectHand,
}) {
  const currentHand = allHands[selectedHandIndex] || (handDetected ? {
    handedness,
    gesture,
    confidence,
    category,
    description,
    raised_fingers: raisedFingers,
  } : null);

  const displayGesture = currentHand?.gesture || (handDetected ? gesture : 'NO HAND DETECTED');
  const displayHandedness = currentHand?.handedness || (handDetected ? handedness : 'UNKNOWN');
  const displayConfidence = currentHand?.confidence ? Math.round(currentHand.confidence * 100) : 0;
  const displayFingers = currentHand?.raised_fingers ?? raisedFingers;
  const displayCategory = currentHand?.category || category;
  const displayDesc = currentHand?.description || description;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '26px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Top Header: Neural Classifier & Multi-Hand Segmented Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TbSparkles style={{ color: 'var(--accent-cyan)', fontSize: '1.25rem' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.01em', color: '#ffffff' }}>
            Optical Classification
          </h3>
        </div>

        {/* Dual Hand Segmented Switcher */}
        {allHands.length > 1 && (
          <div
            style={{
              display: 'flex',
              gap: '4px',
              background: 'rgba(5, 8, 17, 0.7)',
              padding: '3px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-glass)',
            }}
          >
            {allHands.map((h, i) => (
              <button
                key={i}
                onClick={() => onSelectHand?.(i)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: selectedHandIndex === i ? 'var(--accent-cyan)' : 'transparent',
                  color: selectedHandIndex === i ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                Hand {i + 1} ({h.handedness})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Primary Hero Gesture Card */}
      <div
        style={{
          background: handDetected
            ? 'radial-gradient(ellipse at 50% 0%, rgba(14, 165, 233, 0.12) 0%, rgba(10, 16, 30, 0.75) 100%)'
            : 'rgba(255, 255, 255, 0.02)',
          border: `1px solid ${
            handDetected ? 'var(--border-focus)' : 'var(--border-subtle)'
          }`,
          borderRadius: 'var(--radius-lg)',
          padding: '28px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: handDetected ? 'var(--shadow-card-hover)' : 'none',
          transition: 'all var(--transition-normal)',
        }}
      >
        <span className="hud-corner hud-corner-tl" />
        <span className="hud-corner hud-corner-tr" />
        <span className="hud-corner hud-corner-bl" />
        <span className="hud-corner hud-corner-br" />

        {/* Category Pill */}
        <span className="badge badge-cyan" style={{ fontSize: '0.72rem', padding: '3px 12px' }}>
          {handDetected ? displayCategory : 'Optical Radar Standby'}
        </span>

        {/* Gesture Title */}
        <div style={{ margin: '4px 0' }}>
          <span
            style={{
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-dim)',
              display: 'block',
              marginBottom: '6px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            IDENTIFIED GESTURE
          </span>
          <h2
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              color: handDetected ? '#ffffff' : 'var(--text-dim)',
              letterSpacing: '-0.02em',
            }}
          >
            {displayGesture}
          </h2>
        </div>

        {/* Description */}
        {handDetected && displayDesc && (
          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              maxWidth: '420px',
              lineHeight: 1.5,
            }}
          >
            {displayDesc}
          </p>
        )}

        {/* Match Confidence Progress Bar */}
        {handDetected && (
          <div style={{ width: '100%', maxWidth: '340px', marginTop: '6px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.76rem',
                marginBottom: '8px',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span style={{ textTransform: 'uppercase' }}>Classification Confidence</span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>
                {displayConfidence}%
              </span>
            </div>
            <div
              style={{
                height: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6)',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${displayConfidence}%`,
                  background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Meta Telemetry Grid: Handedness & Raised Count */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {/* Handedness Box */}
        <div
          style={{
            background: 'rgba(6, 11, 22, 0.65)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
          }}
        >
          <span
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontFamily: 'var(--font-mono)',
            }}
          >
            HAND ORIENTATION
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-cyan-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)',
              }}
            >
              <TbHandMove style={{ fontSize: '1.2rem' }} />
            </div>
            <strong
              style={{
                fontSize: '1.15rem',
                color: handDetected ? '#ffffff' : 'var(--text-dim)',
                letterSpacing: '-0.01em',
              }}
            >
              {handDetected ? `${displayHandedness.toUpperCase()}` : 'NONE'}
            </strong>
          </div>
        </div>

        {/* Raised Fingers Count Box */}
        <div
          style={{
            background: 'rgba(6, 11, 22, 0.65)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
          }}
        >
          <span
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontFamily: 'var(--font-mono)',
            }}
          >
            RAISED EXTENSIONS
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: handDetected ? 'var(--status-open)' : 'var(--text-dim)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {handDetected ? displayFingers : 0}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>of 5 open</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetectionResult;
