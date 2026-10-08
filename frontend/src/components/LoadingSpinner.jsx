import React from 'react';

export function LoadingSpinner({ size = 32, message = 'Loading...' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          border: '3px solid rgba(6, 182, 212, 0.2)',
          borderTop: '3px solid var(--accent-cyan)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {message && (
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
          {message}
        </span>
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoadingSpinner;
