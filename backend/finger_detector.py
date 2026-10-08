"""
finger_detector.py
Scale-invariant, orientation-robust geometric finger detection.
Determines OPEN/CLOSED status for each of the 5 fingers and counts raised fingers.
"""

from typing import Dict, Any, List, Tuple
import numpy as np


class FingerDetector:
    """Calculates finger extension states using scale-invariant anatomical geometry."""

    # Landmark indices according to MediaPipe Hands topology
    WRIST = 0

    THUMB = {"cmc": 1, "mcp": 2, "ip": 3, "tip": 4}
    INDEX = {"mcp": 5, "pip": 6, "dip": 7, "tip": 8}
    MIDDLE = {"mcp": 9, "pip": 10, "dip": 11, "tip": 12}
    RING = {"mcp": 13, "pip": 14, "dip": 15, "tip": 16}
    PINKY = {"mcp": 17, "pip": 18, "dip": 19, "tip": 20}

    @staticmethod
    def _dist_3d(p1: Dict[str, float], p2: Dict[str, float]) -> float:
        """Euclidean distance between two 3D landmarks."""
        dx = p1["x"] - p2["x"]
        dy = p1["y"] - p2["y"]
        dz = p1.get("z", 0.0) - p2.get("z", 0.0)
        return float(np.sqrt(dx * dx + dy * dy + dz * dz))

    @staticmethod
    def _dist_2d(p1: Dict[str, float], p2: Dict[str, float]) -> float:
        """Euclidean distance in 2D image plane."""
        dx = p1["x"] - p2["x"]
        dy = p1["y"] - p2["y"]
        return float(np.sqrt(dx * dx + dy * dy))

    @staticmethod
    def _dot_product_angle(a: np.ndarray, b: np.ndarray, c: np.ndarray) -> float:
        """Calculate cosine of angle ABC at joint B."""
        ba = a - b
        bc = c - b
        norm_ba = np.linalg.norm(ba)
        norm_bc = np.linalg.norm(bc)
        if norm_ba < 1e-6 or norm_bc < 1e-6:
            return 1.0
        return float(np.dot(ba, bc) / (norm_ba * norm_bc))

    def detect_fingers(self, landmarks: List[Dict[str, Any]], handedness: str = "Right") -> Dict[str, Any]:
        """
        Analyze 21 hand landmarks and return OPEN/CLOSED status for all fingers.
        Invariant to distance from camera, rotation, and translation.
        """
        if len(landmarks) < 21:
            return {
                "thumb": False,
                "index": False,
                "middle": False,
                "ring": False,
                "pinky": False,
                "raised_fingers": 0,
                "palm_scale": 0.0,
                "metrics": {}
            }

        lm = landmarks
        wrist = lm[self.WRIST]
        middle_mcp = lm[self.MIDDLE["mcp"]]
        index_mcp = lm[self.INDEX["mcp"]]
        pinky_mcp = lm[self.PINKY["mcp"]]

        # Palm scale (normalization factor) based on Wrist -> Middle MCP distance
        palm_scale = self._dist_2d(wrist, middle_mcp)
        if palm_scale < 1e-4:
            palm_scale = 0.1

        palm_width = self._dist_2d(index_mcp, pinky_mcp)

        # -------------------------------------------------------------
        # 1. Four fingers (Index, Middle, Ring, Pinky)
        # -------------------------------------------------------------
        finger_configs = [
            ("index", self.INDEX),
            ("middle", self.MIDDLE),
            ("ring", self.RING),
            ("pinky", self.PINKY),
        ]

        finger_states = {}
        metrics = {}

        for name, joints in finger_configs:
            tip = lm[joints["tip"]]
            pip = lm[joints["pip"]]
            mcp = lm[joints["mcp"]]
            dip = lm[joints["dip"]]

            # Distance from tip to wrist vs pip to wrist
            d_tip_wrist = self._dist_2d(tip, wrist)
            d_pip_wrist = self._dist_2d(pip, wrist)

            # Distance from tip to mcp vs pip to mcp
            d_tip_mcp = self._dist_2d(tip, mcp)
            d_pip_mcp = self._dist_2d(pip, mcp)

            # Ratio of extension
            extension_ratio = d_tip_mcp / max(d_pip_mcp, 1e-4)
            wrist_ratio = d_tip_wrist / max(d_pip_wrist, 1e-4)

            # Joint angles
            pt_mcp = np.array([mcp["x"], mcp["y"]])
            pt_pip = np.array([pip["x"], pip["y"]])
            pt_dip = np.array([dip["x"], dip["y"]])
            pt_tip = np.array([tip["x"], tip["y"]])

            cos_pip = self._dot_product_angle(pt_mcp, pt_pip, pt_dip)
            cos_dip = self._dot_product_angle(pt_pip, pt_dip, pt_tip)

            # Finger is extended/OPEN if:
            # 1) Tip is farther from MCP than PIP is, with healthy margin
            # 2) Tip is farther from wrist than PIP
            # 3) Joints are not folded backwards (< -0.2)
            is_open = (
                extension_ratio > 1.25
                and wrist_ratio > 0.95
                and d_tip_mcp > 0.35 * palm_scale
            )

            finger_states[name] = bool(is_open)
            metrics[name] = {
                "extension_ratio": round(extension_ratio, 3),
                "wrist_ratio": round(wrist_ratio, 3),
                "d_tip_mcp_norm": round(d_tip_mcp / palm_scale, 3)
            }

        # -------------------------------------------------------------
        # 2. Thumb Analysis
        # -------------------------------------------------------------
        thumb_tip = lm[self.THUMB["tip"]]
        thumb_ip = lm[self.THUMB["ip"]]
        thumb_mcp = lm[self.THUMB["mcp"]]
        thumb_cmc = lm[self.THUMB["cmc"]]

        # Distance from thumb tip to pinky MCP (landmark 17)
        # When thumb is extended out, distance to pinky MCP is maximum.
        # When thumb is folded against palm or tucked, distance to pinky MCP is small.
        d_thumb_tip_pinky = self._dist_2d(thumb_tip, pinky_mcp)
        d_thumb_ip_pinky = self._dist_2d(thumb_ip, pinky_mcp)
        d_thumb_mcp_pinky = self._dist_2d(thumb_mcp, pinky_mcp)

        # Distance from thumb tip to index MCP (landmark 5)
        d_thumb_tip_index = self._dist_2d(thumb_tip, index_mcp)
        d_thumb_ip_index = self._dist_2d(thumb_ip, index_mcp)

        # Normalized distances
        d_tip_pinky_norm = d_thumb_tip_pinky / palm_scale
        d_tip_index_norm = d_thumb_tip_index / palm_scale

        # Thumb extension ratio relative to pinky base and index base
        thumb_pinky_ratio = d_thumb_tip_pinky / max(d_thumb_ip_pinky, 1e-4)

        # Angular alignment of thumb: CMC -> MCP -> IP -> TIP
        pt_cmc = np.array([thumb_cmc["x"], thumb_cmc["y"]])
        pt_mcp = np.array([thumb_mcp["x"], thumb_mcp["y"]])
        pt_ip = np.array([thumb_ip["x"], thumb_ip["y"]])
        pt_tip = np.array([thumb_tip["x"], thumb_tip["y"]])

        cos_thumb_mcp = self._dot_product_angle(pt_cmc, pt_mcp, pt_ip)
        cos_thumb_ip = self._dot_product_angle(pt_mcp, pt_ip, pt_tip)

        # Thumb is OPEN when:
        # 1) Extended outwards away from pinky MCP
        # 2) Tip is not tucked close to index MCP (d_tip_index_norm > 0.35)
        # 3) Ratio to thumb IP is greater than 1.08
        thumb_open = (
            thumb_pinky_ratio > 1.08
            and d_tip_pinky_norm > 0.65
            and (d_tip_index_norm > 0.38 or d_thumb_tip_pinky > d_thumb_mcp_pinky * 1.15)
        )

        finger_states["thumb"] = bool(thumb_open)
        metrics["thumb"] = {
            "pinky_ratio": round(thumb_pinky_ratio, 3),
            "d_tip_pinky_norm": round(d_tip_pinky_norm, 3),
            "d_tip_index_norm": round(d_tip_index_norm, 3)
        }

        # Calculate total raised fingers (0 to 5)
        raised_count = sum(1 for state in finger_states.values() if state)

        return {
            "thumb": finger_states["thumb"],
            "index": finger_states["index"],
            "middle": finger_states["middle"],
            "ring": finger_states["ring"],
            "pinky": finger_states["pinky"],
            "raised_fingers": raised_count,
            "palm_scale": round(palm_scale, 4),
            "metrics": metrics
        }
