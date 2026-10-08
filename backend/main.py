"""
main.py
FastAPI application for HandSense AI - Real-Time Finger & Hand Sign Recognition.
Provides REST and WebSocket endpoints for low-latency computer vision processing.
"""

import base64
import io
import time
from typing import Dict, Any, List, Optional
import cv2
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from hand_detector import HandDetector
from finger_detector import FingerDetector
from gesture_recognizer import GestureRecognizer

app = FastAPI(
    title="HandSense AI API",
    description="Real-time finger detection and hand sign recognition backend powered by MediaPipe and OpenCV.",
    version="1.0.0"
)

# Enable CORS for local Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize CV components
detector = HandDetector(max_num_hands=2, min_detection_confidence=0.6, min_tracking_confidence=0.5)
finger_detector = FingerDetector()
gesture_recognizer = GestureRecognizer()


class FramePayload(BaseModel):
    image: str
    timestamp: Optional[float] = None


def decode_base64_image(base64_str: str) -> Optional[np.ndarray]:
    """Decode a base64-encoded image string into an OpenCV BGR numpy array."""
    try:
        if "," in base64_str:
            base64_str = base64_str.split(",", 1)[1]
        image_bytes = base64.b64decode(base64_str)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        print(f"Error decoding image: {e}")
        return None


def process_image_frame(img: np.ndarray) -> Dict[str, Any]:
    """Runs hand detection, finger state classification, and gesture recognition on an OpenCV frame."""
    start_time = time.perf_counter()

    if img is None or img.size == 0:
        return {
            "hand_detected": False,
            "hands_count": 0,
            "hands": [],
            "error": "Invalid or empty image frame",
            "processing_time_ms": round((time.perf_counter() - start_time) * 1000, 2)
        }

    raw_hands = detector.process_frame(img)
    processing_time = round((time.perf_counter() - start_time) * 1000, 2)

    if not raw_hands:
        return {
            "hand_detected": False,
            "hands_count": 0,
            "hands": [],
            "message": "No hand detected. Place your hand clearly in front of the camera.",
            "processing_time_ms": processing_time
        }

    processed_hands = []

    for hand in raw_hands:
        landmarks = hand["landmarks"]
        handedness = hand["handedness"]

        # 1. Compute finger states
        finger_res = finger_detector.detect_fingers(landmarks, handedness=handedness)

        # 2. Recognize gesture
        gesture_res = gesture_recognizer.recognize(finger_res, landmarks, handedness=handedness)

        processed_hands.append({
            "hand_index": hand["hand_index"],
            "handedness": handedness,
            "handedness_confidence": hand["handedness_confidence"],
            "raised_fingers": finger_res["raised_fingers"],
            "fingers": {
                "thumb": finger_res["thumb"],
                "index": finger_res["index"],
                "middle": finger_res["middle"],
                "ring": finger_res["ring"],
                "pinky": finger_res["pinky"]
            },
            "gesture": gesture_res["gesture"],
            "confidence": gesture_res["confidence"],
            "category": gesture_res["category"],
            "description": gesture_res["description"],
            "landmarks": landmarks,
            "bbox": hand["bbox"]
        })

    # For backward compatibility with single-hand consumer
    primary_hand = processed_hands[0]

    return {
        "hand_detected": True,
        "hands_count": len(processed_hands),
        "handedness": primary_hand["handedness"],
        "raised_fingers": primary_hand["raised_fingers"],
        "fingers": primary_hand["fingers"],
        "gesture": primary_hand["gesture"],
        "confidence": primary_hand["confidence"],
        "category": primary_hand["category"],
        "description": primary_hand["description"],
        "hands": processed_hands,
        "processing_time_ms": processing_time
    }


@app.get("/")
@app.get("/api")
async def root():
    """Root info endpoint for service verification."""
    return {
        "status": "healthy",
        "service": "HandSense AI Backend",
        "version": "1.0.0",
        "endpoints": {
            "health": "/api/health",
            "signs": "/api/signs",
            "detect": "/api/detect",
            "detect_file": "/api/detect-file",
            "websocket": "/ws/detect"
        }
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint providing runtime and version info."""
    return {
        "status": "healthy",
        "service": "HandSense AI",
        "version": "1.0.0",
        "opencv_version": cv2.__version__,
        "supported_gestures_count": len(GestureRecognizer.SIGN_CATALOG)
    }


@app.get("/api/signs")
async def get_signs():
    """Returns catalog of all supported hand signs with formulas and instructions."""
    return {
        "total": len(GestureRecognizer.SIGN_CATALOG),
        "signs": GestureRecognizer.SIGN_CATALOG
    }


@app.post("/api/detect")
async def detect_frame(payload: FramePayload):
    """REST endpoint for single-frame detection."""
    img = decode_base64_image(payload.image)
    if img is None:
        raise HTTPException(status_code=400, detail="Could not decode base64 image")
    
    result = process_image_frame(img)
    if payload.timestamp is not None:
        result["timestamp"] = payload.timestamp
    return result


@app.post("/api/detect-file")
async def detect_file(file: UploadFile = File(...)):
    """Upload an image file directly for detection."""
    contents = await file.read()
    np_arr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image file")
    return process_image_frame(img)


@app.websocket("/ws/detect")
async def websocket_detect(websocket: WebSocket):
    """
    High-frequency WebSocket endpoint for real-time video frame streaming.
    Streams base64 JPEG/WebP frames and receives detection results with minimal latency.
    """
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            image_data = data.get("image", "")
            client_ts = data.get("timestamp", time.time())

            if not image_data:
                await websocket.send_json({
                    "hand_detected": False,
                    "error": "No image data provided",
                    "timestamp": client_ts
                })
                continue

            img = decode_base64_image(image_data)
            result = process_image_frame(img)
            result["timestamp"] = client_ts

            await websocket.send_json(result)

    except WebSocketDisconnect:
        # Client closed connection cleanly
        pass
    except Exception as e:
        print(f"WebSocket session error: {e}")
        try:
            await websocket.close()
        except Exception:
            pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
