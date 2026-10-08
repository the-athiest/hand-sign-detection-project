import React from 'react';
import { FiCheck, FiX, FiInfo, FiImage } from 'react-icons/fi';
import { HandIllustration } from './HandIllustration';

const FINGER_KEYS = ['thumb', 'index', 'middle', 'ring', 'pinky'];
const PHOTO_REFERENCE_SIGNS = ['peace', 'ok', 'i_love_you', 'thumbs_up'];

export function GestureCard({ sign, onSelect }) {
  if (!sign) return null;

  const fingers = sign.fingers || {};
  const hasPhoto = PHOTO_REFERENCE_SIGNS.includes(sign.id);

  return (
    <div
      className="glass-panel"
      onClick={() => onSelect?.(sign)}
      style={{
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'all var(--transition-normal)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <span className="hud-corner hud-corner-tl" />
      <span className="hud-corner hud-corner-tr" />

      {/* Top Header: Category & Raised Count */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          className="badge badge-neutral"
          style={{ fontSize: '0.7rem', padding: '3px 9px' }}
        >
          {sign.category || 'Standard'}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {hasPhoto && (
            <span
              className="badge"
              style={{
                fontSize: '0.68rem',
                padding: '2px 8px',
                background: 'rgba(14, 165, 233, 0.1)',
                color: 'var(--accent-cyan)',
                border: '1px solid var(--accent-cyan-border)',
              }}
              title="3D AI Tracking Reference Available"
            >
              <FiImage style={{ marginRight: '3px' }} /> 3D Model
            </span>
          )}
          <span
            className="badge badge-cyan"
            style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}
          >
            {sign.raised_fingers} Raised
          </span>
        </div>
      </div>

      {/* Visual Reference Hand Illustration & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div
          style={{
            background: 'rgba(4, 7, 14, 0.7)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <HandIllustration signId={sign.id} fingers={fingers} width={82} height={96} />
        </div>

        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '4px',
              color: '#ffffff',
            }}
          >
            {sign.name}
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
            {sign.description}
          </p>
        </div>
      </div>

      {/* 5-Finger Matrix Mini-Badges */}
      <div>
        <span
          style={{
            fontSize: '0.68rem',
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: '8px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          ANATOMICAL FORMULA
        </span>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {FINGER_KEYS.map((fKey) => {
            const isOpen = Boolean(fingers[fKey]);
            return (
              <span
                key={fKey}
                style={{
                  fontSize: '0.7rem',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-xs)',
                  fontFamily: 'var(--font-mono)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: isOpen
                    ? 'var(--status-open-subtle)'
                    : 'rgba(255, 255, 255, 0.03)',
                  color: isOpen ? 'var(--status-open)' : 'var(--text-dim)',
                  border: `1px solid ${
                    isOpen ? 'var(--status-open-border)' : 'var(--border-subtle)'
                  }`,
                }}
              >
                {isOpen ? <FiCheck style={{ fontSize: '0.65rem' }} /> : <FiX style={{ fontSize: '0.65rem' }} />}
                {fKey.toUpperCase()}
              </span>
            );
          })}
        </div>
      </div>

      {/* Tips / Instructions */}
      {sign.tips && (
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '10px',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          <FiInfo style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent-cyan)' }} />
          <span>{sign.tips}</span>
        </div>
      )}
    </div>
  );
}

export default GestureCard;
