import React from 'react';

/**
 * HandIllustration.jsx
 * Dynamic SVG reference illustration displaying anatomical hand pose,
 * extended/folded fingers, joint connections, and key landmarks for each gesture.
 */
export function HandIllustration({ signId, fingers = {}, width = 120, height = 140 }) {
  const thumbOpen = Boolean(fingers.thumb);
  const indexOpen = Boolean(fingers.index);
  const middleOpen = Boolean(fingers.middle);
  const ringOpen = Boolean(fingers.ring);
  const pinkyOpen = Boolean(fingers.pinky);

  // Custom styling per sign
  const isThumbsUp = signId === 'thumbs_up';
  const isThumbsDown = signId === 'thumbs_down';
  const isOk = signId === 'ok';
  const isPeace = signId === 'peace';
  const isFingerGun = signId === 'finger_gun';
  const isLSign = signId === 'l_sign';
  const isPinch = signId === 'pinch';
  const isSpock = signId === 'spock';
  const isPinkyUp = signId === 'pinky_up';

  // Base Palm Coordinates (Centered in SVG 100x120 viewBox)
  // Wrist: (50, 105)
  // Knuckles (MCP):
  // Thumb MCP: (28, 75)
  // Index MCP: (38, 55)
  // Middle MCP: (50, 52)
  // Ring MCP: (62, 55)
  // Pinky MCP: (73, 62)

  // Finger TIP Coordinates based on state & gesture
  const getFingerTip = (fingerName) => {
    switch (fingerName) {
      case 'thumb':
        if (isThumbsUp) return { x: 20, y: 35, open: true };
        if (isThumbsDown) return { x: 20, y: 105, open: true };
        if (isOk || isPinch) return { x: 38, y: 38, open: false }; // Touching index tip
        if (isLSign) return { x: 12, y: 72, open: true }; // Horizontal
        if (thumbOpen) return { x: 16, y: 55, open: true };
        return { x: 36, y: 68, open: false }; // Folded across

      case 'index':
        if (isOk || isPinch) return { x: 39, y: 37, open: false }; // Touching thumb tip
        if (isPeace) return { x: 30, y: 16, open: true }; // Spread left
        if (isFingerGun) return { x: 40, y: 18, open: true };
        if (indexOpen) return { x: 37, y: 18, open: true };
        return { x: 38, y: 58, open: false }; // Curled

      case 'middle':
        if (isPeace) return { x: 58, y: 16, open: true }; // Spread right
        if (isSpock) return { x: 46, y: 14, open: true }; // Paired with index
        if (middleOpen) return { x: 50, y: 12, open: true };
        return { x: 50, y: 56, open: false }; // Curled

      case 'ring':
        if (isSpock) return { x: 66, y: 18, open: true }; // Paired with pinky
        if (ringOpen) return { x: 63, y: 17, open: true };
        return { x: 62, y: 58, open: false }; // Curled

      case 'pinky':
        if (isSpock) return { x: 78, y: 26, open: true }; // Paired with ring
        if (isPinkyUp) return { x: 80, y: 22, open: true }; // High upright
        if (pinkyOpen) return { x: 78, y: 25, open: true };
        return { x: 72, y: 64, open: false }; // Curled

      default:
        return { x: 50, y: 50, open: false };
    }
  };

  const tips = {
    thumb: getFingerTip('thumb'),
    index: getFingerTip('index'),
    middle: getFingerTip('middle'),
    ring: getFingerTip('ring'),
    pinky: getFingerTip('pinky'),
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${width}px`,
        height: `${height}px`,
        background: 'rgba(6, 182, 212, 0.04)',
        border: '1px solid rgba(6, 182, 212, 0.2)',
        borderRadius: 'var(--radius-md)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <svg
        viewBox="0 0 100 125"
        width="100%"
        height="100%"
        style={{ filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.35))' }}
      >
        <defs>
          <radialGradient id="wristGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* Palm Contour Background */}
        <path
          d="M 40 105 C 32 90, 24 75, 30 65 C 34 56, 42 54, 50 52 C 58 54, 66 56, 72 65 C 76 74, 68 90, 60 105 Z"
          fill="rgba(15, 23, 42, 0.7)"
          stroke="rgba(56, 189, 248, 0.35)"
          strokeWidth="1.5"
        />

        {/* Skeleton Bones from Wrist to MCP Knuckles */}
        <line x1="50" y1="105" x2="28" y2="75" stroke="rgba(6, 182, 212, 0.5)" strokeWidth="2" />
        <line x1="50" y1="105" x2="38" y2="55" stroke="rgba(6, 182, 212, 0.5)" strokeWidth="2" />
        <line x1="50" y1="105" x2="50" y2="52" stroke="rgba(6, 182, 212, 0.5)" strokeWidth="2" />
        <line x1="50" y1="105" x2="62" y2="55" stroke="rgba(6, 182, 212, 0.5)" strokeWidth="2" />
        <line x1="50" y1="105" x2="73" y2="62" stroke="rgba(6, 182, 212, 0.5)" strokeWidth="2" />

        {/* Knuckle Arch Connection */}
        <path
          d="M 28 75 L 38 55 L 50 52 L 62 55 L 73 62"
          fill="none"
          stroke="rgba(6, 182, 212, 0.4)"
          strokeWidth="1.5"
        />

        {/* Finger Bones to Tips */}
        {/* Thumb */}
        <line
          x1="28"
          y1="75"
          x2={tips.thumb.x}
          y2={tips.thumb.y}
          stroke={thumbOpen ? '#06b6d4' : 'rgba(244, 63, 94, 0.6)'}
          strokeWidth={thumbOpen ? '2.5' : '1.8'}
          strokeDasharray={thumbOpen ? 'none' : '2,2'}
        />
        {/* Index */}
        <line
          x1="38"
          y1="55"
          x2={tips.index.x}
          y2={tips.index.y}
          stroke={indexOpen ? '#06b6d4' : 'rgba(244, 63, 94, 0.6)'}
          strokeWidth={indexOpen ? '2.5' : '1.8'}
          strokeDasharray={indexOpen ? 'none' : '2,2'}
        />
        {/* Middle */}
        <line
          x1="50"
          y1="52"
          x2={tips.middle.x}
          y2={tips.middle.y}
          stroke={middleOpen ? '#06b6d4' : 'rgba(244, 63, 94, 0.6)'}
          strokeWidth={middleOpen ? '2.5' : '1.8'}
          strokeDasharray={middleOpen ? 'none' : '2,2'}
        />
        {/* Ring */}
        <line
          x1="62"
          y1="55"
          x2={tips.ring.x}
          y2={tips.ring.y}
          stroke={ringOpen ? '#06b6d4' : 'rgba(244, 63, 94, 0.6)'}
          strokeWidth={ringOpen ? '2.5' : '1.8'}
          strokeDasharray={ringOpen ? 'none' : '2,2'}
        />
        {/* Pinky */}
        <line
          x1="73"
          y1="62"
          x2={tips.pinky.x}
          y2={tips.pinky.y}
          stroke={pinkyOpen ? '#06b6d4' : 'rgba(244, 63, 94, 0.6)'}
          strokeWidth={pinkyOpen ? '2.5' : '1.8'}
          strokeDasharray={pinkyOpen ? 'none' : '2,2'}
        />

        {/* OK / Pinch Contact Circle Indicator */}
        {(isOk || isPinch) && (
          <circle
            cx="38.5"
            cy="37.5"
            r="7"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="3,2"
          />
        )}

        {/* Wrist Base Node */}
        <circle cx="50" cy="105" r="4.5" fill="#38bdf8" />

        {/* Knuckle Nodes */}
        {[
          { x: 28, y: 75 },
          { x: 38, y: 55 },
          { x: 50, y: 52 },
          { x: 62, y: 55 },
          { x: 73, y: 62 },
        ].map((k, idx) => (
          <circle key={idx} cx={k.x} cy={k.y} r="2.8" fill="#e2e8f0" />
        ))}

        {/* Fingertip Highlight Nodes */}
        {Object.entries(tips).map(([fingerKey, tip]) => {
          const isOpen = Boolean(fingers[fingerKey]);
          return (
            <g key={fingerKey}>
              {isOpen && (
                <circle
                  cx={tip.x}
                  cy={tip.y}
                  r="5.5"
                  fill="none"
                  stroke="rgba(16, 185, 129, 0.6)"
                  strokeWidth="1.5"
                />
              )}
              <circle
                cx={tip.x}
                cy={tip.y}
                r="3.5"
                fill={isOpen ? '#10b981' : '#f43f5e'}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default HandIllustration;
