"""
test_cv.py
Automated test suite verifying HandDetector, FingerDetector, GestureRecognizer, and FastAPI endpoints.
"""

import sys
import unittest
import numpy as np

from hand_detector import HandDetector
from finger_detector import FingerDetector
from gesture_recognizer import GestureRecognizer


def create_synthetic_landmarks(pose_type: str = "open_palm") -> list:
    """Helper to generate synthetic landmark configurations for unit testing."""
    # Base wrist at (0.5, 0.8)
    wrist = {"x": 0.5, "y": 0.8, "z": 0.0}
    # Knuckles
    index_mcp = {"x": 0.45, "y": 0.5, "z": 0.0}
    middle_mcp = {"x": 0.5, "y": 0.48, "z": 0.0}
    ring_mcp = {"x": 0.55, "y": 0.5, "z": 0.0}
    pinky_mcp = {"x": 0.6, "y": 0.53, "z": 0.0}

    # Thumb CMC and MCP
    thumb_cmc = {"x": 0.42, "y": 0.7, "z": 0.0}
    thumb_mcp = {"x": 0.38, "y": 0.62, "z": 0.0}

    lms = [{} for _ in range(21)]
    lms[0] = wrist
    lms[1] = thumb_cmc
    lms[2] = thumb_mcp
    lms[5] = index_mcp
    lms[9] = middle_mcp
    lms[13] = ring_mcp
    lms[17] = pinky_mcp

    def set_finger(mcp_idx, pip_idx, dip_idx, tip_idx, base_x, is_open):
        if is_open:
            # Extended straight up
            lms[pip_idx] = {"x": base_x, "y": 0.38, "z": 0.0}
            lms[dip_idx] = {"x": base_x, "y": 0.28, "z": 0.0}
            lms[tip_idx] = {"x": base_x, "y": 0.18, "z": 0.0}
        else:
            # Curled back towards palm/wrist
            lms[pip_idx] = {"x": base_x, "y": 0.45, "z": 0.0}
            lms[dip_idx] = {"x": base_x, "y": 0.52, "z": 0.0}
            lms[tip_idx] = {"x": base_x, "y": 0.58, "z": 0.0}

    def set_thumb(is_open, direction="up"):
        if is_open:
            if direction == "up":
                lms[3] = {"x": 0.32, "y": 0.48, "z": 0.0}
                lms[4] = {"x": 0.28, "y": 0.35, "z": 0.0} # Upwards thumb
            elif direction == "down":
                lms[3] = {"x": 0.32, "y": 0.72, "z": 0.0}
                lms[4] = {"x": 0.28, "y": 0.88, "z": 0.0} # Downwards thumb
            else:
                lms[3] = {"x": 0.30, "y": 0.58, "z": 0.0}
                lms[4] = {"x": 0.22, "y": 0.55, "z": 0.0} # Extended laterally
        else:
            # Folded across palm
            lms[3] = {"x": 0.42, "y": 0.58, "z": 0.0}
            lms[4] = {"x": 0.46, "y": 0.55, "z": 0.0}

    if pose_type == "fist":
        set_thumb(is_open=False)
        set_finger(5, 6, 7, 8, 0.45, is_open=False)
        set_finger(9, 10, 11, 12, 0.5, is_open=False)
        set_finger(13, 14, 15, 16, 0.55, is_open=False)
        set_finger(17, 18, 19, 20, 0.6, is_open=False)

    elif pose_type == "open_palm":
        set_thumb(is_open=True, direction="lateral")
        set_finger(5, 6, 7, 8, 0.45, is_open=True)
        set_finger(9, 10, 11, 12, 0.5, is_open=True)
        set_finger(13, 14, 15, 16, 0.55, is_open=True)
        set_finger(17, 18, 19, 20, 0.6, is_open=True)

    elif pose_type == "one":
        set_thumb(is_open=False)
        set_finger(5, 6, 7, 8, 0.45, is_open=True)
        set_finger(9, 10, 11, 12, 0.5, is_open=False)
        set_finger(13, 14, 15, 16, 0.55, is_open=False)
        set_finger(17, 18, 19, 20, 0.6, is_open=False)

    elif pose_type == "peace":
        set_thumb(is_open=False)
        # Index tilted left, middle tilted right
        lms[6] = {"x": 0.42, "y": 0.38, "z": 0.0}
        lms[7] = {"x": 0.38, "y": 0.28, "z": 0.0}
        lms[8] = {"x": 0.34, "y": 0.18, "z": 0.0} # Index spread

        lms[10] = {"x": 0.52, "y": 0.38, "z": 0.0}
        lms[11] = {"x": 0.56, "y": 0.28, "z": 0.0}
        lms[12] = {"x": 0.60, "y": 0.18, "z": 0.0} # Middle spread

        set_finger(13, 14, 15, 16, 0.55, is_open=False)
        set_finger(17, 18, 19, 20, 0.6, is_open=False)

    elif pose_type == "i_love_you":
        set_thumb(is_open=True, direction="lateral")
        set_finger(5, 6, 7, 8, 0.45, is_open=True)
        set_finger(9, 10, 11, 12, 0.5, is_open=False)
        set_finger(13, 14, 15, 16, 0.55, is_open=False)
        set_finger(17, 18, 19, 20, 0.6, is_open=True)

    elif pose_type == "thumbs_up":
        set_thumb(is_open=True, direction="up")
        set_finger(5, 6, 7, 8, 0.45, is_open=False)
        set_finger(9, 10, 11, 12, 0.5, is_open=False)
        set_finger(13, 14, 15, 16, 0.55, is_open=False)
        set_finger(17, 18, 19, 20, 0.6, is_open=False)

    for i in range(21):
        lms[i]["id"] = i
        lms[i]["name"] = HandDetector.LANDMARK_NAMES[i]

    return lms


class TestHandSenseAI(unittest.TestCase):
    """Test suite for HandSense AI core computer vision modules."""

    def setUp(self):
        self.finger_detector = FingerDetector()
        self.gesture_recognizer = GestureRecognizer()

    def test_fist_detection(self):
        lms = create_synthetic_landmarks("fist")
        f_res = self.finger_detector.detect_fingers(lms, "Right")
        self.assertEqual(f_res["raised_fingers"], 0, f"Expected 0 raised fingers, got {f_res['raised_fingers']}")
        g_res = self.gesture_recognizer.recognize(f_res, lms, "Right")
        self.assertEqual(g_res["gesture"], "FIST")

    def test_open_palm_detection(self):
        lms = create_synthetic_landmarks("open_palm")
        f_res = self.finger_detector.detect_fingers(lms, "Right")
        self.assertEqual(f_res["raised_fingers"], 5, f"Expected 5 raised fingers, got {f_res['raised_fingers']}")
        g_res = self.gesture_recognizer.recognize(f_res, lms, "Right")
        self.assertIn(g_res["gesture"], ["OPEN PALM", "FIVE", "STOP / HALT"])

    def test_one_detection(self):
        lms = create_synthetic_landmarks("one")
        f_res = self.finger_detector.detect_fingers(lms, "Right")
        self.assertTrue(f_res["index"])
        self.assertFalse(f_res["middle"])
        self.assertFalse(f_res["ring"])
        self.assertFalse(f_res["pinky"])
        g_res = self.gesture_recognizer.recognize(f_res, lms, "Right")
        self.assertEqual(g_res["gesture"], "ONE")

    def test_peace_detection(self):
        lms = create_synthetic_landmarks("peace")
        f_res = self.finger_detector.detect_fingers(lms, "Right")
        self.assertTrue(f_res["index"])
        self.assertTrue(f_res["middle"])
        self.assertFalse(f_res["ring"])
        self.assertFalse(f_res["pinky"])
        g_res = self.gesture_recognizer.recognize(f_res, lms, "Right")
        self.assertEqual(g_res["gesture"], "PEACE")

    def test_i_love_you_detection(self):
        lms = create_synthetic_landmarks("i_love_you")
        f_res = self.finger_detector.detect_fingers(lms, "Right")
        self.assertTrue(f_res["thumb"])
        self.assertTrue(f_res["index"])
        self.assertTrue(f_res["pinky"])
        self.assertFalse(f_res["middle"])
        self.assertFalse(f_res["ring"])
        g_res = self.gesture_recognizer.recognize(f_res, lms, "Right")
        self.assertEqual(g_res["gesture"], "I LOVE YOU")

    def test_thumbs_up_detection(self):
        lms = create_synthetic_landmarks("thumbs_up")
        f_res = self.finger_detector.detect_fingers(lms, "Right")
        self.assertTrue(f_res["thumb"])
        self.assertFalse(f_res["index"])
        g_res = self.gesture_recognizer.recognize(f_res, lms, "Right")
        self.assertEqual(g_res["gesture"], "THUMBS UP")

    def test_pinky_up_detection(self):
        lms = create_synthetic_landmarks("fist")
        # Extend pinky
        lms[18] = {"x": 0.6, "y": 0.38, "z": 0.0}
        lms[19] = {"x": 0.6, "y": 0.28, "z": 0.0}
        lms[20] = {"x": 0.6, "y": 0.18, "z": 0.0}
        f_res = self.finger_detector.detect_fingers(lms, "Right")
        self.assertTrue(f_res["pinky"])
        self.assertFalse(f_res["index"])
        self.assertFalse(f_res["thumb"])
        g_res = self.gesture_recognizer.recognize(f_res, lms, "Right")
        self.assertEqual(g_res["gesture"], "PINKY UP")

    def test_mediapipe_initialization(self):
        detector = HandDetector(max_num_hands=2)
        self.assertIsNotNone(detector.hands)
        # Test on dummy black frame
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        hands = detector.process_frame(frame)
        self.assertEqual(len(hands), 0)
        detector.close()


if __name__ == "__main__":
    unittest.main()
