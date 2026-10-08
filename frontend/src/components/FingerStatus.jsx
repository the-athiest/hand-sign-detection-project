import React from 'react';
import {
  FiCheckCircle,
  FiXCircle,
  FiCircle,
} from 'react-icons/fi';
import {
  TbHandFinger,
  TbHandStop,
} from 'react-icons/tb';

const FINGERS = [
  { id: 'thumb', label: 'Thumb', shortcut: 'THB', landmark: 'Tip #4' },
  { id: 'index', label: 'Index Finger', shortcut: 'IDX', landmark: 'Tip #8' },
  { id: 'middle', label: 'Middle Finger', shortcut: 'MID', landmark: 'Tip #12' },
  { id: 'ring', label: 'Ring Finger', shortcut: 'RNG', landmark: 'Tip #16' },
  { id: 'pinky', label: 'Pinky Finger', shortcut: 'PNK', landmark: 'Tip #20' },
];

export function FingerStatus({ fingers = {}, raisedCount = 0, handDetected = false }) {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
      }}
    >
      {/* Header with Raised Count Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TbHandFinger style={{ color: 'var(--accent-cyan)', fontSize: '1.3rem' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.01em', color: '#ffffff' }}>
            Biometric Extension Matrix
          </h3>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: handDetected
              ? 'var(--status-open-subtle)'
              : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${
              handDetected ? 'var(--status-open-border)' : 'var(--border-subtle)'
            }`,
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            color: handDetected ? 'var(--status-open)' : 'var(--text-dim)',
          }}
        >
          <span style={{ fontSize: '0.74rem', textTransform: 'uppercase' }}>
            RAISED:
          </span>
          <strong style={{ fontSize: '1rem', color: handDetected ? '#ffffff' : 'inherit' }}>
            {handDetected ? raisedCount : '-'} / 5
          </strong>
        </div>
      </div>

      {/* 5-Finger Biometric List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {FINGERS.map((f) => {
          const isOpen = handDetected && Boolean(fingers[f.id]);

          return (
            <div
              key={f.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 15px',
                borderRadius: 'var(--radius-md)',
                background: !handDetected
                  ? 'rgba(6, 11, 22, 0.45)'
                  : isOpen
                  ? 'rgba(16, 185, 129, 0.08)'
                  : 'rgba(6, 11, 22, 0.45)',
                border: `1px solid ${
                  !handDetected
                    ? 'var(--border-subtle)'
                    : isOpen
                    ? 'var(--status-open-border)'
                    : 'var(--border-subtle)'
                }`,
                transition: 'all var(--transition-fast)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.74rem',
                    color: isOpen ? 'var(--status-open)' : 'var(--text-dim)',
                    background: isOpen ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-xs)',
                    fontWeight: 700,
                  }}
                >
                  {f.shortcut}
                </span>

                <div>
                  <span
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: !handDetected ? 'var(--text-muted)' : '#ffffff',
                    }}
                  >
                    {f.label}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.7rem',
                      color: 'var(--text-dim)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {f.landmark}
                  </span>
                </div>
              </div>

              {/* Status Pill Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {!handDetected ? (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>--</span>
                ) : isOpen ? (
                  <span
                    className="badge badge-open"
                    style={{ fontSize: '0.72rem', padding: '3px 9px' }}
                  >
                    <FiCheckCircle /> EXTENDED
                  </span>
                ) : (
                  <span
                    className="badge badge-closed"
                    style={{ fontSize: '0.72rem', padding: '3px 9px' }}
                  >
                    <FiCircle /> FOLDED
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FingerStatus;
