"""
hand_detector.py
Real-time hand detection and 21-landmark extraction using MediaPipe Hands.
"""

from typing import List, Dict, Any, Tuple, Optional
import cv2
import numpy as np
import mediapipe as mp


class HandDetector:
    """Wrapper for MediaPipe Hands with support for multi-hand tracking."""

    # Landmark name mapping according to MediaPipe Hands topology
    LANDMARK_NAMES = [
        "WRIST",
        "THUMB_CMC", "THUMB_MCP", "THUMB_IP", "THUMB_TIP",
        "INDEX_FINGER_MCP", "INDEX_FINGER_PIP", "INDEX_FINGER_DIP", "INDEX_FINGER_TIP",
        "MIDDLE_FINGER_MCP", "MIDDLE_FINGER_PIP", "MIDDLE_FINGER_DIP", "MIDDLE_FINGER_TIP",
        "RING_FINGER_MCP", "RING_FINGER_PIP", "RING_FINGER_DIP", "RING_FINGER_TIP",
        "PINKY_MCP", "PINKY_PIP", "PINKY_DIP", "PINKY_TIP"
    ]

    # Connections between landmarks for skeleton rendering
    HAND_CONNECTIONS = [
        # Palm base
        (0, 1), (1, 2), (2, 3), (3, 4),        # Thumb
        (0, 5), (5, 6), (6, 7), (7, 8),        # Index
        (5, 9), (9, 10), (10, 11), (11, 12),   # Middle
        (9, 13), (13, 14), (14, 15), (15, 16), # Ring
        (13, 17), (17, 18), (18, 19), (19, 20),# Pinky
        (0, 17)                                # Palm base to Pinky MCP
    ]

    def __init__(
        self,
        static_image_mode: bool = False,
        max_num_hands: int = 2,
        min_detection_confidence: float = 0.6,
        min_tracking_confidence: float = 0.5
    ):
        self.max_num_hands = max_num_hands
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=static_image_mode,
            max_num_hands=max_num_hands,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )

    def process_frame(self, image_bgr: np.ndarray) -> List[Dict[str, Any]]:
        """
        Process a single BGR OpenCV frame and extract all detected hands.
        Returns a list of detected hand objects.
        """
        if image_bgr is None or image_bgr.size == 0:
            return []

        h, w, _ = image_bgr.shape
        # MediaPipe requires RGB
        image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
        image_rgb.flags.writeable = False
        results = self.hands.process(image_rgb)

        detected_hands = []

        if not results.multi_hand_landmarks:
            return detected_hands

        # Extract handedness and landmarks
        handedness_list = results.multi_handedness or []

        for idx, hand_landmarks in enumerate(results.multi_hand_landmarks):
            # Determine handedness label
            handedness_label = "Unknown"
            handedness_score = 0.95
            if idx < len(handedness_list):
                classification = handedness_list[idx].classification[0]
                handedness_label = classification.label  # "Left" or "Right"
                handedness_score = round(float(classification.score), 3)

            # Extract 21 points
            landmarks_normalized = []
            landmarks_pixel = []
            xs = []
            ys = []

            for lm_idx, lm in enumerate(hand_landmarks.landmark):
                norm_pt = {
                    "id": lm_idx,
                    "name": self.LANDMARK_NAMES[lm_idx],
                    "x": round(float(lm.x), 4),
                    "y": round(float(lm.y), 4),
                    "z": round(float(lm.z), 4)
                }
                landmarks_normalized.append(norm_pt)

                px = int(lm.x * w)
                py = int(lm.y * h)
                landmarks_pixel.append((px, py, lm.z))
                xs.append(px)
                ys.append(py)

            # Bounding box
            x_min = max(0, min(xs) - 15)
            y_min = max(0, min(ys) - 15)
            x_max = min(w, max(xs) + 15)
            y_max = min(h, max(ys) + 15)

            bbox = {
                "x": x_min,
                "y": y_min,
                "width": max(1, x_max - x_min),
                "height": max(1, y_max - y_min),
                "normalized": {
                    "x": round(x_min / w, 4),
                    "y": round(y_min / h, 4),
                    "width": round((x_max - x_min) / w, 4),
                    "height": round((y_max - y_min) / h, 4)
                }
            }

            detected_hands.append({
                "hand_index": idx,
                "handedness": handedness_label,
                "handedness_confidence": handedness_score,
                "landmarks": landmarks_normalized,
                "landmarks_pixel": landmarks_pixel,
                "bbox": bbox
            })

        return detected_hands

    def close(self):
        """Release MediaPipe resources."""
        if hasattr(self, 'hands') and self.hands:
            self.hands.close()
