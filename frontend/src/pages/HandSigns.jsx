import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSearch,
  FiFilter,
  FiVideo,
  FiInfo,
  FiCheck,
  FiX,
  FiImage,
} from 'react-icons/fi';
import { TbHandStop, TbSparkles } from 'react-icons/tb';

import GestureCard from '../components/GestureCard';
import HandIllustration from '../components/HandIllustration';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../services/api';

const PHOTO_REFERENCE_SIGNS = {
  peace: '/signs/peace.jpg',
  ok: '/signs/ok.jpg',
  i_love_you: '/signs/i_love_you.jpg',
  thumbs_up: '/signs/thumbs_up.jpg',
};

export function HandSigns() {
  const [signs, setSigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSign, setSelectedSign] = useState(null);

  useEffect(() => {
    apiService.getSignCatalog().then((res) => {
      if (res.success && res.data) {
        setSigns(res.data);
      }
      setLoading(false);
    });
  }, []);

  const categories = ['All', 'Basic', 'Numbers', 'Gestures', 'ASL Signs', 'Bonus'];

  const filteredSigns = signs.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.tips && s.tips.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container" style={{ padding: '48px 32px 96px', maxWidth: '1540px' }}>
      {/* Header Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '14px',
          marginBottom: '44px',
        }}
      >
        <span className="badge badge-cyan">
          GESTURE SPECIFICATION ({signs.length || 20} SIGNS)
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
          Gesture Catalog & Geometric Reference
        </h1>
        <p style={{ maxWidth: '680px', color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Review all predefined hand sign models with scale-invariant Euclidean distance formulas,
          anatomical joint illustrations, and live performance guidance.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 22px',
          marginBottom: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-full)',
                border:
                  selectedCategory === cat
                    ? '1px solid var(--accent-cyan)'
                    : '1px solid var(--border-subtle)',
                background:
                  selectedCategory === cat
                    ? 'var(--accent-cyan-subtle)'
                    : 'rgba(255, 255, 255, 0.03)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            minWidth: '260px',
            flex: '1 1 260px',
            maxWidth: '380px',
          }}
        >
          <FiSearch
            style={{
              position: 'absolute',
              left: '14px',
              color: 'var(--text-dim)',
              fontSize: '1rem',
            }}
          />
          <input
            type="text"
            placeholder="Search signs, formulas, or tips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 16px 9px 40px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(4, 7, 14, 0.7)',
              border: '1px solid var(--border-glass)',
              color: '#ffffff',
              fontSize: '0.88rem',
              outline: 'none',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)',
            }}
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && <LoadingSpinner message="Calibrating gesture catalog from FastAPI backend..." />}

      {/* Cards Grid */}
      {!loading && (
        <div className="grid-3">
          {filteredSigns.map((sign) => (
            <GestureCard
              key={sign.id}
              sign={sign}
              onSelect={(s) => setSelectedSign(s)}
            />
          ))}
        </div>
      )}

      {/* Empty Search State */}
      {!loading && filteredSigns.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '70px 20px',
            color: 'var(--text-muted)',
          }}
        >
          <FiInfo style={{ fontSize: '2.4rem', marginBottom: '12px', color: 'var(--accent-cyan)' }} />
          <h3 style={{ fontSize: '1.3rem', color: '#ffffff' }}>No gestures match "{searchQuery}"</h3>
          <p style={{ marginTop: '6px', color: 'var(--text-secondary)' }}>
            Try searching for "peace", "fist", "ok", "gun", "pinch", "spock", or "thumb".
          </p>
        </div>
      )}

      {/* Sign Detail Modal */}
      {selectedSign && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(3, 5, 11, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setSelectedSign(null)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              position: 'relative',
              background: 'rgba(8, 13, 25, 0.95)',
              border: '1px solid var(--border-glass)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="hud-corner hud-corner-tl" />
            <span className="hud-corner hud-corner-tr" />
            <span className="hud-corner hud-corner-bl" />
            <span className="hud-corner hud-corner-br" />

            {/* Modal Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge badge-neutral" style={{ marginBottom: '8px' }}>
                  {selectedSign.category}
                </span>
                <h2 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                  {selectedSign.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedSign(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                ✕
              </button>
            </div>

            {/* Visual Reference Section */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: PHOTO_REFERENCE_SIGNS[selectedSign.id] ? '1fr 1fr' : '1fr',
                gap: '16px',
                margin: '22px 0',
                alignItems: 'center',
              }}
            >
              {/* Landmark Skeleton Reference */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(4, 7, 14, 0.7)',
                  padding: '18px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-glass)',
                }}
              >
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
                  LANDMARK SKELETON
                </span>
                <HandIllustration signId={selectedSign.id} fingers={selectedSign.fingers} width={135} height={155} />
              </div>

              {/* 3D Photorealistic AI CV Reference */}
              {PHOTO_REFERENCE_SIGNS[selectedSign.id] && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(4, 7, 14, 0.7)',
                    padding: '18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--accent-cyan-border)',
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
                    3D VISION TRACKING MODEL
                  </span>
                  <img
                    src={PHOTO_REFERENCE_SIGNS[selectedSign.id]}
                    alt={`${selectedSign.name} reference`}
                    style={{
                      width: '135px',
                      height: '155px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  />
                </div>
              )}
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '18px', fontSize: '0.94rem', lineHeight: 1.6 }}>
              {selectedSign.description}
            </p>

            {/* Formula Block */}
            <div
              style={{
                background: 'rgba(4, 7, 14, 0.75)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '18px',
                border: '1px solid var(--border-glass)',
              }}
            >
              <span
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-dim)',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.06em',
                }}
              >
                DETERMINATION FORMULA
              </span>
              <code style={{ fontSize: '0.86rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {selectedSign.formula}
              </code>
            </div>

            {/* Tips Block */}
            {selectedSign.tips && (
              <div style={{ marginBottom: '24px' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-dim)',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '6px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  CAMERA SENSOR TIP
                </span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  {selectedSign.tips}
                </p>
              </div>
            )}

            {/* CTA Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Link
                to="/detection"
                className="btn btn-primary"
                onClick={() => setSelectedSign(null)}
                style={{ borderRadius: 'var(--radius-full)', padding: '11px 26px' }}
              >
                <FiVideo /> Test Live in Studio
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HandSigns;
