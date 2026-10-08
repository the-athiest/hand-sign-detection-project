/**
 * HandLandmarkOverlay.js
 * High-performance HTML5 Canvas renderer for 21 MediaPipe hand landmarks,
 * skeleton connections, fingertip indicators (Open/Closed), and bounding boxes.
 */

export const HAND_CONNECTIONS = [
  // Palm Base & Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index Finger
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle Finger
  [5, 9], [9, 10], [10, 11], [11, 12],
  // Ring Finger
  [9, 13], [13, 14], [14, 15], [15, 16],
  // Pinky Finger
  [13, 17], [17, 18], [18, 19], [19, 20],
  // Palm Bottom Connection
  [0, 17]
];

export const FINGERTIP_INDICES = {
  thumb: 4,
  index: 8,
  middle: 12,
  ring: 16,
  pinky: 20
};

/**
 * Renders hand landmarks, connections, and status badges onto a canvas.
 */
export function drawHandOverlay(ctx, canvasWidth, canvasHeight, handsData, mirrored = true) {
  if (!ctx || !canvasWidth || !canvasHeight) return;

  // Clear previous frame
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  if (!handsData || handsData.length === 0) return;

  handsData.forEach((hand, handIdx) => {
    const landmarks = hand.landmarks;
    if (!landmarks || landmarks.length < 21) return;

    const fingers = hand.fingers || {};
    const handedness = hand.handedness || 'Right';
    const gesture = hand.gesture || '';
    const bbox = hand.bbox;

    // Helper to transform normalized coordinate to canvas space
    const getPoint = (lm) => {
      let x = lm.x * canvasWidth;
      if (mirrored) {
        x = canvasWidth - x;
      }
      const y = lm.y * canvasHeight;
      return { x, y };
    };

    // 1. Draw Skeleton Bones
    ctx.save();
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = handIdx === 0 ? 'rgba(6, 182, 212, 0.75)' : 'rgba(168, 85, 247, 0.75)';
    ctx.shadowColor = handIdx === 0 ? '#06b6d4' : '#a855f7';
    ctx.shadowBlur = 8;

    HAND_CONNECTIONS.forEach(([startIdx, endIdx]) => {
      const p1 = getPoint(landmarks[startIdx]);
      const p2 = getPoint(landmarks[endIdx]);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });
    ctx.restore();

    // 2. Draw Intermediate Landmark Joints
    landmarks.forEach((lm, idx) => {
      // Skip fingertips (drawn with special open/closed styling below)
      if (Object.values(FINGERTIP_INDICES).includes(idx)) return;

      const p = getPoint(lm);
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, idx === 0 ? 6 : 4, 0, 2 * Math.PI);
      ctx.fillStyle = idx === 0 ? '#38bdf8' : '#e2e8f0';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.restore();
    });

    // 3. Draw Fingertips with OPEN/CLOSED status
    Object.entries(FINGERTIP_INDICES).forEach(([fingerName, tipIdx]) => {
      const tipLm = landmarks[tipIdx];
      const p = getPoint(tipLm);
      const isOpen = Boolean(fingers[fingerName]);

      ctx.save();
      if (isOpen) {
        // OPEN FINGER: Vibrant Emerald Green + Glow Ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#10b981';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 12;
        ctx.fill();

        // Outer halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, 13, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        // CLOSED FINGER: Coral / Crimson Red Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      ctx.restore();
    });

    // 4. Draw Hand Bounding Box & Floating Tag
    if (bbox && bbox.normalized) {
      let bx = bbox.normalized.x * canvasWidth;
      const by = bbox.normalized.y * canvasHeight;
      const bw = bbox.normalized.width * canvasWidth;
      const bh = bbox.normalized.height * canvasHeight;

      if (mirrored) {
        bx = canvasWidth - (bx + bw);
      }

      ctx.save();
      // Sleek Corner Brackets
      ctx.strokeStyle = handIdx === 0 ? 'rgba(6, 182, 212, 0.6)' : 'rgba(168, 85, 247, 0.6)';
      ctx.lineWidth = 2;
      const cornerLen = Math.min(20, bw * 0.25);

      // Top-left
      ctx.beginPath();
      ctx.moveTo(bx, by + cornerLen);
      ctx.lineTo(bx, by);
      ctx.lineTo(bx + cornerLen, by);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(bx + bw - cornerLen, by);
      ctx.lineTo(bx + bw, by);
      ctx.lineTo(bx + bw, by + cornerLen);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(bx, by + bh - cornerLen);
      ctx.lineTo(bx, by + bh);
      ctx.lineTo(bx + cornerLen, by + bh);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(bx + bw - cornerLen, by + bh);
      ctx.lineTo(bx + bw, by + bh);
      ctx.lineTo(bx + bw, by + bh - cornerLen);
      ctx.stroke();

      // Floating Badge above box
      const tagText = `${handedness.toUpperCase()} • ${gesture || 'DETECTING'}`;
      ctx.font = '600 12px "Inter", sans-serif';
      const textMetrics = ctx.measureText(tagText);
      const tagW = textMetrics.width + 16;
      const tagH = 24;
      const tagX = Math.max(8, Math.min(canvasWidth - tagW - 8, bx));
      const tagY = Math.max(tagH + 4, by - 8);

      ctx.fillStyle = handIdx === 0 ? 'rgba(6, 182, 212, 0.85)' : 'rgba(168, 85, 247, 0.85)';
      ctx.beginPath();
      ctx.roundRect(tagX, tagY - tagH, tagW, tagH, 6);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillText(tagText, tagX + 8, tagY - 7);
      ctx.restore();
    }
  });
}
