import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FiVideo,
  FiVideoOff,
  FiAlertCircle,
  FiClock,
  FiActivity,
  FiHelpCircle,
  FiCheckCircle,
  FiLayers,
} from 'react-icons/fi';
import { TbHandStop, TbSparkles, TbWaveSine } from 'react-icons/tb';

import CameraView from '../components/CameraView';
import DetectionResult from '../components/DetectionResult';
import FingerStatus from '../components/FingerStatus';
import StatusIndicator from '../components/StatusIndicator';
import { DetectionWebSocket } from '../services/websocket';
import { apiService } from '../services/api';

export function Detection() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [wsStatus, setWsStatus] = useState('DISCONNECTED');
  const [fps, setFps] = useState(0);
  const [latencyMs, setLatencyMs] = useState(0);
  const [backendOnline, setBackendOnline] = useState(true);
  const [mirrored, setMirrored] = useState(true);

  // Latest CV detection payload
  const [detectionData, setDetectionData] = useState({
    hand_detected: false,
    hands_count: 0,
    handedness: 'Right',
    raised_fingers: 0,
    fingers: { thumb: false, index: false, middle: false, ring: false, pinky: false },
    gesture: 'WAITING...',
    confidence: 0,
    category: 'Basic',
    description: '',
    hands: [],
  });

  const [selectedHandIndex, setSelectedHandIndex] = useState(0);
  const [recentGestures, setRecentGestures] = useState([]);

  // FPS Calculation refs
  const frameCountRef = useRef(0);
  const lastFpsCalcRef = useRef(performance.now());
  const wsClientRef = useRef(null);

  /**
   * Handle incoming WebSocket message
   */
  const handleDetectionResult = useCallback((data) => {
    frameCountRef.current += 1;
    const now = performance.now();
    if (now - lastFpsCalcRef.current >= 1000) {
      setFps(Math.round((frameCountRef.current * 1000) / (now - lastFpsCalcRef.current)));
      frameCountRef.current = 0;
      lastFpsCalcRef.current = now;
    }

    if (data.client_latency_ms !== undefined) {
      setLatencyMs(data.client_latency_ms);
    } else if (data.processing_time_ms !== undefined) {
      setLatencyMs(Math.round(data.processing_time_ms));
    }

    if (data.hand_detected) {
      setDetectionData({
        hand_detected: true,
        hands_count: data.hands_count || 1,
        handedness: data.handedness || 'Right',
        raised_fingers: data.raised_fingers || 0,
        fingers: data.fingers || {},
        gesture: data.gesture || 'UNKNOWN',
        confidence: data.confidence || 0,
        category: data.category || 'Gestures',
        description: data.description || '',
        hands: data.hands || [],
      });

      if (data.gesture && data.gesture !== 'UNKNOWN') {
        setRecentGestures((prev) => {
          if (prev.length > 0 && prev[0].gesture === data.gesture) {
            return prev;
          }
          return [{ gesture: data.gesture, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)];
        });
      }
    } else {
      setDetectionData((prev) => ({
        ...prev,
        hand_detected: false,
        hands_count: 0,
        hands: [],
        gesture: 'NO HAND DETECTED',
        description: data.message || 'Position your hand clearly in front of the camera.',
      }));
    }
  }, []);

  /**
   * Initialize and manage WebSocket connection
   */
  const startStreaming = useCallback(() => {
    setIsStreaming(true);

    if (!wsClientRef.current) {
      wsClientRef.current = new DetectionWebSocket({
        onResult: handleDetectionResult,
        onStatusChange: (status) => setWsStatus(status),
        onError: () => setBackendOnline(false),
      });
    }

    wsClientRef.current.connect();
  }, [handleDetectionResult]);

  const stopStreaming = useCallback(() => {
    setIsStreaming(false);
    if (wsClientRef.current) {
      wsClientRef.current.disconnect();
      wsClientRef.current = null;
    }
    setWsStatus('DISCONNECTED');
    setFps(0);
    setLatencyMs(0);
    setDetectionData((prev) => ({
      ...prev,
      hand_detected: false,
      hands_count: 0,
      hands: [],
      gesture: 'CAMERA STANDBY',
    }));
  }, []);

  /**
   * Called on every video frame from CameraView
   */
  const handleFrameCaptured = useCallback((base64Data) => {
    if (wsClientRef.current && wsClientRef.current.isConnected) {
      wsClientRef.current.sendFrame(base64Data);
    } else {
      apiService.detectFrame(base64Data).then((res) => {
        if (res.success) {
          handleDetectionResult(res.data);
        }
      });
    }
  }, [handleDetectionResult]);

  // Check health on mount
  useEffect(() => {
    apiService.checkHealth().then((res) => {
      setBackendOnline(res.success);
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, [stopStreaming]);

  const activeHand = detectionData.hands[selectedHandIndex] || {
    fingers: detectionData.fingers,
    raised_fingers: detectionData.raised_fingers,
    handedness: detectionData.handedness,
  };

  return (
    <div className="container" style={{ padding: '36px 32px 72px', maxWidth: '1560px' }}>
      {/* Top Header & Telemetry Status Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '28px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-cyan-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--accent-cyan-border)',
              }}
            >
              <TbHandStop style={{ color: 'var(--accent-cyan)', fontSize: '1.35rem' }} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Optical Vision Studio
            </h1>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            High-throughput 21-joint skeleton tracking, rotation-invariant finger extensions, and gesture classification.
          </p>
        </div>

        <StatusIndicator
          isCameraActive={isStreaming}
          wsStatus={wsStatus}
          fps={fps}
          latencyMs={latencyMs}
          backendOnline={backendOnline}
        />
      </div>

      {/* Main Studio Grid: Left (Expanded Camera) vs Right (Detection Data & Biometrics) */}
      <div className="detection-grid">
        {/* Left Column: Expanded Camera View */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <CameraView
            isStreaming={isStreaming}
            onStartStream={startStreaming}
            onStopStream={stopStreaming}
            onFrameCaptured={handleFrameCaptured}
            handsData={detectionData.hands}
            mirrored={mirrored}
            onToggleMirror={() => setMirrored((prev) => !prev)}
          />

          {/* Quick Guidance & Recent Gesture Ticker */}
          <div
            className="glass-panel"
            style={{
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiHelpCircle style={{ color: 'var(--accent-cyan)', fontSize: '1.05rem', flexShrink: 0 }} />
              <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                Position your hand 1.5–2.5 feet from the camera facing forward for optimal landmark confidence.
              </span>
            </div>

            {/* Recent Gestures History */}
            {recentGestures.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-dim)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  RECENT:
                </span>
                {recentGestures.map((g, idx) => (
                  <span
                    key={idx}
                    className="badge badge-cyan"
                    style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                  >
                    {g.gesture}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Neural Detection Result & Biometric Finger Matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Main Recognition Result */}
          <DetectionResult
            handDetected={detectionData.hand_detected}
            handedness={detectionData.handedness}
            gesture={detectionData.gesture}
            confidence={detectionData.confidence}
            category={detectionData.category}
            description={detectionData.description}
            raisedFingers={detectionData.raised_fingers}
            allHands={detectionData.hands}
            selectedHandIndex={selectedHandIndex}
            onSelectHand={(i) => setSelectedHandIndex(i)}
          />

          {/* 5-Finger Biometric Status Dashboard */}
          <FingerStatus
            fingers={activeHand.fingers}
            raisedCount={activeHand.raised_fingers}
            handDetected={detectionData.hand_detected}
          />
        </div>
      </div>
    </div>
  );
}

export default Detection;
