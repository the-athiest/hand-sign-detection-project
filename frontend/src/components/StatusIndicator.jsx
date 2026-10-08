import React from 'react';
import { FiCamera, FiWifi, FiActivity, FiClock, FiAlertTriangle, FiZap } from 'react-icons/fi';

export function StatusIndicator({
  isCameraActive,
  wsStatus,
  fps = 0,
  latencyMs = 0,
  backendOnline = true,
}) {
  const getWsStatusConfig = () => {
    switch (wsStatus) {
      case 'CONNECTED':
        return { label: 'WebSocket Active', color: 'var(--status-open)', dotClass: 'active' };
      case 'CONNECTING':
        return { label: 'Connecting...', color: 'var(--status-amber)', dotClass: 'amber' };
      default:
        return { label: 'Stream Standby', color: 'var(--text-dim)', dotClass: 'inactive' };
    }
  };

  const wsConfig = getWsStatusConfig();

  // Color tier for latency
  const getLatencyColor = (ms) => {
    if (ms <= 35) return 'var(--status-open)';
    if (ms <= 70) return 'var(--status-amber)';
    return 'var(--status-closed)';
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        background: 'rgba(9, 14, 26, 0.72)',
        backdropFilter: 'blur(16px)',
        padding: '8px 18px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-glass)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        fontSize: '0.82rem',
      }}
    >
      {/* Camera Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FiCamera style={{ color: isCameraActive ? 'var(--accent-cyan)' : 'var(--text-dim)' }} />
        <span style={{ color: isCameraActive ? '#ffffff' : 'var(--text-muted)', fontWeight: 500 }}>
          {isCameraActive ? 'Camera Ingestion' : 'Camera Standby'}
        </span>
        <span className={`status-dot ${isCameraActive ? 'active' : 'inactive'}`} />
      </div>

      <div style={{ width: '1px', height: '16px', background: 'var(--border-subtle)' }} />

      {/* WebSocket Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FiWifi style={{ color: wsConfig.color }} />
        <span style={{ color: wsConfig.color, fontWeight: 600 }}>{wsConfig.label}</span>
        <span className={`status-dot ${wsConfig.dotClass}`} />
      </div>

      {/* Telemetry Metrics */}
      {isCameraActive && (
        <>
          <div style={{ width: '1px', height: '16px', background: 'var(--border-subtle)' }} />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <FiActivity style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ color: '#ffffff', fontWeight: 700 }}>{fps}</span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>FPS</span>
          </div>

          <div style={{ width: '1px', height: '16px', background: 'var(--border-subtle)' }} />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <FiClock style={{ color: getLatencyColor(latencyMs) }} />
            <span style={{ color: getLatencyColor(latencyMs), fontWeight: 700 }}>{latencyMs}</span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>ms RTT</span>
          </div>
        </>
      )}

      {/* Backend Offline Warning */}
      {!backendOnline && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--status-closed)',
            marginLeft: 'auto',
            background: 'var(--status-closed-subtle)',
            padding: '2px 10px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--status-closed-border)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <FiAlertTriangle />
          <span>BACKEND UNAVAILABLE</span>
        </div>
      )}
    </div>
  );
}

export default StatusIndicator;
