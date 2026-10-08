# HandSense AI – Real-Time Finger & Hand Sign Recognition

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Hands-00c853.svg)](https://developers.google.com/mediapipe)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6+-646cff.svg)](https://vitejs.dev)

A modern, full-stack, webcam-based computer vision application that detects hand landmarks in real time, determines individual finger states (**OPEN / CLOSED**), calculates the total count of raised fingers, and recognizes **12+ predefined hand signs** with sub-30ms latency over WebSockets.

---

## 🌟 Key Features

1. **21-Landmark 3D Hand Tracking**: Uses Google's MediaPipe Hands model to locate 21 anatomical hand joints.
2. **Individual Finger Status**: Identifies the open/closed state of:
   - 👍 **Thumb**
   - ☝️ **Index Finger**
   - 🖕 **Middle Finger**
   - 💍 **Ring Finger**
   - 🤙 **Pinky Finger**
3. **Raised Finger Counter**: Dynamically sums open fingers (0 to 5) with instant visual indicators.
4. **12+ Supported Gestures**:
   - `FIST`, `OPEN PALM`, `ONE`, `TWO`, `THREE`, `FOUR`, `FIVE`
   - `THUMBS UP`, `THUMBS DOWN`, `PEACE`, `OK`, `I LOVE YOU` (ASL)
   - Bonus: `ROCK` (Horns) and `CALL ME` (Shaka)
5. **Orientation & Scale Invariance**: Pure anatomical geometric ratios relative to the palm scale ($S_{palm} = ||P_9 - P_0||$). Functions seamlessly whether close, far, tilted, or rotated.
6. **Handedness & Multi-Hand Support**: Distinguishes **LEFT** and **RIGHT** hands and tracks up to 2 hands simultaneously.
7. **Bi-Directional WebSocket Pipeline**: Ultra-low latency streaming (~20–40ms round-trip) with REST fallback.
8. **Modern Glassmorphic UI**: Built with React 19, Vite, HTML5 Canvas overlay, responsive grid, and React Icons.

---

## 🏗️ System Architecture

```text
[ Webcam Feed ]
       │
       ▼
[ React 19 / HTML5 Canvas ]
       │ (Base64 JPEG @ ~30 FPS)
       ▼
[ WebSocket: /ws/detect ]
       │
       ▼
[ FastAPI Backend ]
  ├── 1. MediaPipe Hands (21 Landmarks + Handedness)
  ├── 2. Palm Scaling Normalization (S_palm = ||P9 - P0||)
  ├── 3. Geometric Finger Extension Detector (Open / Closed)
  └── 4. Gesture Classifier (12+ Signs + Confidence Meter)
       │
       ▼ (JSON Stream)
[ React UI Updates ]
  ├── Real-time Skeleton & Joint Canvas Overlay
  ├── Glowing Fingertip Rings (Green = Open, Red = Closed)
  ├── Live Gesture Hero Badge & Confidence Progress Bar
  └── Individual 5-Finger Status Cards
```

---

## 📁 Project Structure

```text
hand-signs/
│
├── backend/
│   ├── .venv/                      # Python virtual environment
│   ├── main.py                     # FastAPI application & WebSocket router
│   ├── hand_detector.py            # MediaPipe Hands 21-landmark extraction
│   ├── finger_detector.py          # Scale-invariant geometric finger detector
│   ├── gesture_recognizer.py       # 12+ sign classifier & encyclopedia catalog
│   ├── test_cv.py                  # Automated unit test suite
│   ├── test_api.py                 # FastAPI endpoint integration tests
│   └── requirements.txt            # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CameraView.jsx             # Video container & canvas overlay
│   │   │   ├── DetectionResult.jsx        # Recognized gesture & metrics
│   │   │   ├── FingerStatus.jsx           # 5-finger open/closed status
│   │   │   ├── GestureCard.jsx            # Reusable sign library card
│   │   │   ├── HandLandmarkOverlay.js     # Canvas drawing engine
│   │   │   ├── StatusIndicator.jsx        # Live stream, FPS & latency badge
│   │   │   ├── LoadingSpinner.jsx         # Animated loading state
│   │   │   ├── Navbar.jsx                 # Glassmorphic header & health badge
│   │   │   └── Footer.jsx                 # Footer & tech stack specs
│   │   ├── pages/
│   │   │   ├── Home.jsx                   # Hero showcase & pipeline diagram
│   │   │   ├── Detection.jsx              # Main real-time CV workspace
│   │   │   ├── HandSigns.jsx              # Filterable sign encyclopedia
│   │   │   └── About.jsx                  # 21-landmark guide & math formulas
│   │   ├── services/
│   │   │   ├── api.js                     # Axios REST client
│   │   │   └── websocket.js               # Low-latency WebSocket streaming client
│   │   ├── App.jsx                        # Route configuration & layout
│   │   ├── main.jsx                       # Entry point
│   │   └── index.css                      # Design system & glassmorphism
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── .gitignore
└── README.md
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend Language** | Python 3.11+ | Native performance for CV calculations |
| **CV / AI Models** | MediaPipe Hands 0.10.14 | 21 3D hand landmark predictions |
| **Image Processing** | OpenCV (cv2) | BGR/RGB transformations and frame decodes |
| **API Framework** | FastAPI + Uvicorn | High-throughput async REST & WebSocket server |
| **Frontend UI** | React 19 + Vite | Fast component rendering and zero-latency state updates |
| **Icons & Style** | React Icons + Vanilla CSS | Modern glassmorphism with responsive typography |
| **Routing** | React Router DOM v7 | Client-side page navigation |

---

## 📐 Detection Algorithm & Mathematics

### 1. The 21 Hand Landmarks
MediaPipe predicts:
- **0**: Wrist
- **1–4**: Thumb (CMC, MCP, IP, Tip)
- **5–8**: Index Finger (MCP, PIP, DIP, Tip)
- **9–12**: Middle Finger (MCP, PIP, DIP, Tip)
- **13–16**: Ring Finger (MCP, PIP, DIP, Tip)
- **17–20**: Pinky Finger (MCP, PIP, DIP, Tip)

### 2. Scale Invariant Normalization
Naïve checks like `tip.y < pip.y` break when the hand tilts or turns upside down. HandSense AI calculates the palm baseline:

$$S_{palm} = \sqrt{(x_9 - x_0)^2 + (y_9 - y_0)^2}$$

### 3. Four Long Fingers (Index, Middle, Ring, Pinky)
For finger $i$:
- Tip-to-MCP distance: $D_{tm} = ||P_{tip} - P_{mcp}||$
- PIP-to-MCP distance: $D_{pm} = ||P_{pip} - P_{mcp}||$
- Tip-to-Wrist distance: $D_{tw} = ||P_{tip} - P_{wrist}||$
- PIP-to-Wrist distance: $D_{pw} = ||P_{pip} - P_{wrist}||$

A finger is defined as **OPEN** when:

$$\frac{D_{tm}}{D_{pm}} > 1.25 \quad \text{and} \quad \frac{D_{tw}}{D_{pw}} > 0.95 \quad \text{and} \quad D_{tm} > 0.35 \times S_{palm}$$

### 4. Thumb Opposition
The thumb moves laterally across the palm. We compare the distance of Thumb Tip (4) to Pinky MCP (17):

$$R_{thumb} = \frac{||P_4 - P_{17}||}{||P_3 - P_{17}||} > 1.08 \quad \text{and} \quad \frac{||P_4 - P_{17}||}{S_{palm}} > 0.65$$

This ensures rotation-invariance regardless of left or right hand.

---

## ✋ Supported Hand Signs (20 Gestures)

| Sign | Category | Raised Fingers | Finger Formula | Reference |
| :--- | :--- | :---: | :--- | :---: |
| **FIST** | Basic | 0 | All fingers CLOSED | Vector Model |
| **OPEN PALM** | Basic | 5 | All 5 fingers OPEN | Vector Model |
| **ONE** | Numbers | 1 | Index OPEN, others CLOSED | Vector Model |
| **TWO** | Numbers | 2 | Index + Middle OPEN together | Vector Model |
| **THREE** | Numbers | 3 | Index + Middle + Ring OPEN | Vector Model |
| **FOUR** | Numbers | 4 | Index + Middle + Ring + Pinky OPEN, Thumb CLOSED | Vector Model |
| **FIVE** | Numbers | 5 | All 5 fingers OPEN | Vector Model |
| **THUMBS UP** | Gestures | 1 | Thumb OPEN pointing UP ($y_{tip} < y_{mcp}$), others CLOSED | 3D AI Tracking Photo |
| **THUMBS DOWN** | Gestures | 1 | Thumb OPEN pointing DOWN ($y_{tip} > y_{mcp}$), others CLOSED | Vector Model |
| **PEACE** | Gestures | 2 | Index + Middle OPEN in V-formation ($||P_8 - P_{12}|| > 0.32 \times S_{palm}$) | 3D AI Tracking Photo |
| **OK** | Gestures | 3 | Thumb Tip touching Index Tip ($||P_4 - P_8|| < 0.40 \times S_{palm}$), Middle+Ring+Pinky OPEN | 3D AI Tracking Photo |
| **I LOVE YOU** | ASL Signs | 3 | Thumb + Index + Pinky OPEN; Middle + Ring CLOSED | 3D AI Tracking Photo |
| **ROCK** | Bonus | 2 | Index + Pinky OPEN; Middle + Ring + Thumb CLOSED | Vector Model |
| **CALL ME** | Bonus | 2 | Thumb + Pinky OPEN; Index + Middle + Ring CLOSED | Vector Model |
| **FINGER GUN** | Gestures | 2 | Thumb OPEN (upright) + Index OPEN (forward), others CLOSED | Vector Model |
| **PINCH** | Gestures | 0 | Thumb Tip touching Index Tip, other 3 fingers CLOSED | Vector Model |
| **PINKY UP** | Gestures | 1 | Pinky OPEN upright, other 4 fingers CLOSED (Promise / Tea) | Vector Model |
| **LOSER (L SIGN)** | Gestures | 2 | Thumb & Index at 90° angle forming an 'L', other 3 CLOSED | Vector Model |
| **SPOCK (VULCAN SALUTE)** | Bonus | 5 | Thumb open, Index+Middle paired, Ring+Pinky paired, V-split in center | Vector Model |
| **STOP / HALT** | Gestures | 5 | All 5 fingers OPEN held tightly together facing forward | Vector Model |

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js v18+ and npm

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run automated tests to verify CV algorithms
python test_cv.py
python test_api.py

# Start the FastAPI server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The backend server will run at `http://localhost:8000`.
- Swagger API Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/api/health`

### 2. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install npm packages
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your web browser (Google Chrome, Microsoft Edge, or Mozilla Firefox).

---

## 📡 API Documentation

### REST Endpoints

#### `GET /api/health`
Returns system status, OpenCV version, and supported gestures count.

#### `GET /api/signs`
Returns complete JSON catalog of all 14 supported gestures with finger matrices and performance tips.

#### `POST /api/detect`
Accepts single base64 image frame:
```json
{
  "image": "data:image/jpeg;base64,...",
  "timestamp": 1725550000.0
}
```

Response:
```json
{
  "hand_detected": true,
  "hands_count": 1,
  "handedness": "Right",
  "raised_fingers": 2,
  "fingers": {
    "thumb": false,
    "index": true,
    "middle": true,
    "ring": false,
    "pinky": false
  },
  "gesture": "PEACE",
  "confidence": 0.95,
  "category": "Gestures",
  "description": "Index and middle fingers spread in V-shape peace sign.",
  "hands": [...],
  "processing_time_ms": 14.8
}
```

### WebSocket Endpoint

#### `WS /ws/detect`
Connects real-time streaming channel.
- **Client Sends**: `{ "image": "<base64_jpeg>", "timestamp": 12345 }`
- **Server Returns**: Full detection JSON with processing latency and client roundtrip latency.

---

## 🛡️ Privacy & Security

- **Zero Frame Persistence**: Webcam frames are analyzed in volatile memory and immediately discarded.
- **Client-Side Permission**: Camera access requires explicit browser authorization and can be revoked at any time.
- **No Cloud Dependencies**: Computer vision models execute locally on CPU using TensorFlow Lite XNNPACK.

---

## 💡 Troubleshooting

1. **Camera access denied**:
   - Check your browser URL bar and ensure webcam permission is set to "Allow".
   - Ensure no other application (Zoom, Teams, Skype) is using your webcam.
2. **Backend offline badge**:
   - Verify FastAPI backend is running on `http://localhost:8000`.
3. **Low detection accuracy**:
   - Ensure adequate lighting.
   - Position hand 1 to 2.5 feet away from the lens.
   - Hold palm perpendicular to camera for open palm / number gestures.

---

## 📄 License
This project is open-source under the MIT License.
