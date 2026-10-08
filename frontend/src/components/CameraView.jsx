import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  FiCamera,
  FiCameraOff,
  FiRefreshCw,
  FiVideo,
  FiVideoOff,
  FiAlertCircle,
  FiCpu,
  FiSliders,
} from 'react-icons/fi';
import { TbFocusCentered, TbHandStop } from 'react-icons/tb';
import { drawHandOverlay } from './HandLandmarkOverlay';

export function CameraView({
  isStreaming,
  onStartStream,
  onStopStream,
  onFrameCaptured,
  handsData = [],
  mirrored = true,
  onToggleMirror,
}) {
  const videoRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const captureCanvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastCaptureTimeRef = useRef(0);

  const [permissionError, setPermissionError] = useState(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 1280, height: 720 });

  /**
   * Start Webcam Feed (Prefer HD 1280x720)
   */
  const startCamera = async () => {
    setPermissionError(null);
    setCameraLoading(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam API is not supported in this browser. Please use Chrome, Edge, or Firefox.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setVideoDimensions({
            width: videoRef.current.videoWidth || 1280,
            height: videoRef.current.videoHeight || 720,
          });
          setCameraLoading(false);
          onStartStream?.();
        };
      }
    } catch (err) {
      console.error('Camera access error:', err);
      let errorMsg = 'Failed to access camera. Please allow camera permissions.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Camera permission denied. Allow camera access in your browser address bar.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No camera found on your system. Please plug in a webcam.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = 'Camera is already in use by another application (Zoom, Teams, etc.).';
      }
      setPermissionError(errorMsg);
      setCameraLoading(false);
      onStopStream?.();
    }
  };

  /**
   * Stop Webcam Feed
   */
  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (overlayCanvasRef.current) {
      const ctx = overlayCanvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
    }

    onStopStream?.();
  }, [onStopStream]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  /**
   * Frame Capture Loop (~30 FPS WebSocket Stream)
   */
  useEffect(() => {
    if (!isStreaming) return;

    let isSubscribed = true;

    const captureFrame = (currentTime) => {
      if (!isSubscribed) return;

      const video = videoRef.current;
      const captureCanvas = captureCanvasRef.current;

      // Throttle capture to max ~30 FPS (every ~33ms)
      if (
        video &&
        video.readyState === video.HAVE_ENOUGH_DATA &&
        captureCanvas &&
        currentTime - lastCaptureTimeRef.current >= 33
      ) {
        lastCaptureTimeRef.current = currentTime;

        // Downscale capture frame to 480w for rapid CV inference
        const targetW = 480;
        const targetH = Math.round((video.videoHeight / video.videoWidth) * targetW) || 360;

        if (captureCanvas.width !== targetW || captureCanvas.height !== targetH) {
          captureCanvas.width = targetW;
          captureCanvas.height = targetH;
        }

        const ctx = captureCanvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(video, 0, 0, targetW, targetH);
          const base64Data = captureCanvas.toDataURL('image/jpeg', 0.75);
          onFrameCaptured?.(base64Data);
        }
      }

      animationFrameRef.current = requestAnimationFrame(captureFrame);
    };

    animationFrameRef.current = requestAnimationFrame(captureFrame);

    return () => {
      isSubscribed = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isStreaming, onFrameCaptured]);

  /**
   * Render Landmarks on Overlay Canvas
   */
  useEffect(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawHandOverlay(ctx, canvas.width, canvas.height, handsData, mirrored);
    }
  }, [handsData, mirrored]);

  const calcAspectRatio =
    videoDimensions.width && videoDimensions.height
      ? `${videoDimensions.width} / ${videoDimensions.height}`
      : '16 / 9';

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Viewport Container with Increased Size & High-Precision Reticles */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: calcAspectRatio,
          minHeight: '500px',
          maxHeight: '640px',
          background: 'radial-gradient(ellipse at center, #0b1122 0%, #03060d 100%)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: 'inset 0 0 24px rgba(0,0,0,0.85), 0 12px 36px rgba(0,0,0,0.5)',
        }}
      >
        {/* Precision Targeting Corner Markers */}
        <span className="hud-corner hud-corner-tl" />
        <span className="hud-corner hud-corner-tr" />
        <span className="hud-corner hud-corner-bl" />
        <span className="hud-corner hud-corner-br" />

        {/* Hidden offscreen canvas for frame capture */}
        <canvas ref={captureCanvasRef} style={{ display: 'none' }} />

        {/* Video stream element */}
        <video
          ref={videoRef}
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transform: mirrored ? 'scaleX(-1)' : 'none',
            display: isStreaming ? 'block' : 'none',
          }}
        />

        {/* Real-time Hand Landmark Overlay Canvas */}
        <canvas
          ref={overlayCanvasRef}
          width={videoDimensions.width}
          height={videoDimensions.height}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
            display: isStreaming ? 'block' : 'none',
          }}
        />

        {/* Standby UI */}
        {!isStreaming && !cameraLoading && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              padding: '36px',
              textAlign: 'center',
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(14, 165, 233, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(14, 165, 233, 0.3)',
                boxShadow: '0 4px 24px rgba(14, 165, 233, 0.15)',
              }}
            >
              <FiCamera style={{ color: 'var(--accent-cyan)', fontSize: '2.4rem' }} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
                Optical Sensor Standby
              </h3>
              <p style={{ fontSize: '0.92rem', maxWidth: '380px', color: 'var(--text-muted)' }}>
                Click below to grant webcam access and start real-time MediaPipe joint tracking.
              </p>
            </div>

            <button
              onClick={startCamera}
              className="btn btn-primary"
              style={{ padding: '14px 32px', fontSize: '0.96rem' }}
            >
              <FiVideo /> Initialize Camera Stream
            </button>
          </div>
        )}

        {/* Camera Loading Spinner */}
        {cameraLoading && (
          <div style={{ textAlign: 'center', color: 'var(--accent-cyan)', zIndex: 2 }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Connecting Optical Hardware...
            </p>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              Configuring MediaStream API
            </span>
          </div>
        )}

        {/* Live Top HUD Tag */}
        {isStreaming && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(5, 9, 18, 0.82)',
              backdropFilter: 'blur(12px)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-glass)',
              fontSize: '0.78rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              zIndex: 3,
            }}
          >
            <span className="status-dot active" />
            <span style={{ color: '#ffffff' }}>OPTICAL INGESTION</span>
            <span style={{ color: 'var(--accent-cyan)' }}>
              {videoDimensions.width}×{videoDimensions.height}
            </span>
          </div>
        )}

        {/* Live Hand Count Badge */}
        {isStreaming && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(5, 9, 18, 0.82)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${
                handsData.length > 0 ? 'var(--status-open-border)' : 'var(--border-glass)'
              }`,
              color: handsData.length > 0 ? 'var(--status-open)' : 'var(--text-muted)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              zIndex: 3,
            }}
          >
            {handsData.length === 0
              ? 'TARGETING HAND...'
              : `${handsData.length} ${handsData.length === 1 ? 'HAND DETECTED' : 'HANDS DETECTED'}`}
          </div>
        )}
      </div>

      {/* Permission Error Banner */}
      {permissionError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'var(--status-closed-subtle)',
            border: '1px solid var(--status-closed-border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 18px',
            color: '#fca5a5',
            fontSize: '0.88rem',
          }}
        >
          <FiAlertCircle style={{ fontSize: '1.25rem', flexShrink: 0, color: 'var(--status-closed)' }} />
          <span>{permissionError}</span>
        </div>
      )}

      {/* Control Actions Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {!isStreaming ? (
            <button
              onClick={startCamera}
              className="btn btn-primary btn-sm"
              disabled={cameraLoading}
            >
              <FiVideo /> Start Camera
            </button>
          ) : (
            <button onClick={stopCamera} className="btn btn-danger btn-sm">
              <FiVideoOff /> Terminate Stream
            </button>
          )}

          <button
            onClick={onToggleMirror}
            className="btn btn-secondary btn-sm"
            title="Toggle video feed orientation"
          >
            <FiRefreshCw />
            <span>{mirrored ? 'Mirrored (Selfie)' : 'Standard View'}</span>
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.78rem',
            color: 'var(--text-dim)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <FiCpu style={{ color: 'var(--accent-cyan)' }} />
          <span>Hardware Accelerated MediaPipe</span>
        </div>
      </div>
    </div>
  );
}

export default CameraView;
