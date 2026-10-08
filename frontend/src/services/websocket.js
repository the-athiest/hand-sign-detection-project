/**
 * websocket.js
 * High-performance WebSocket client for real-time video frame streaming.
 */

export class DetectionWebSocket {
  constructor({ onResult, onStatusChange, onError }) {
    this.ws = null;
    this.onResult = onResult;
    this.onStatusChange = onStatusChange;
    this.onError = onError;
    this.isConnected = false;
    this.isProcessing = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimer = null;
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    let wsUrl = `${protocol}//${window.location.host}/ws/detect`;

    // In dev mode when running on port 5173 without proxy or direct port
    if (window.location.port === '5173') {
      wsUrl = 'ws://127.0.0.1:8000/ws/detect';
    }

    this.onStatusChange?.('CONNECTING');

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.isProcessing = false;
        this.reconnectAttempts = 0;
        this.onStatusChange?.('CONNECTED');
      };

      this.ws.onmessage = (event) => {
        this.isProcessing = false;
        try {
          const data = JSON.parse(event.data);
          // Calculate roundtrip latency if timestamp was sent
          if (data.timestamp) {
            data.client_latency_ms = Math.round(performance.now() - data.timestamp);
          }
          this.onResult?.(data);
        } catch (err) {
          console.error('Failed to parse WebSocket message', err);
        }
      };

      this.ws.onerror = (error) => {
        console.warn('WebSocket error encountered:', error);
        this.onError?.(error);
        this.onStatusChange?.('ERROR');
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.isProcessing = false;
        this.onStatusChange?.('DISCONNECTED');
      };
    } catch (err) {
      this.onError?.(err);
      this.onStatusChange?.('ERROR');
    }
  }

  sendFrame(base64Image) {
    if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    // Drop frame if previous is still processing to avoid buffer bloat
    if (this.isProcessing) {
      return false;
    }

    this.isProcessing = true;
    try {
      this.ws.send(JSON.stringify({
        image: base64Image,
        timestamp: performance.now(),
      }));
      return true;
    } catch (err) {
      this.isProcessing = false;
      return false;
    }
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.isProcessing = false;
    this.onStatusChange?.('DISCONNECTED');
  }
}

export default DetectionWebSocket;
