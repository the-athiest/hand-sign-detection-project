"""
gesture_recognizer.py
Recognizes predefined hand gestures using finger states and landmark geometry.
Supports 12+ gestures including FIST, OPEN PALM, ONE, TWO, THREE, FOUR, FIVE,
THUMBS UP, THUMBS DOWN, PEACE, OK, I LOVE YOU, ROCK, and CALL ME.
"""

from typing import Dict, Any, List, Optional
import numpy as np


class GestureRecognizer:
    """Classifies hand gestures using finger open/closed states and landmark spatial geometry."""

    # Static catalog of all recognized gestures with descriptions and formulas
    SIGN_CATALOG = [
        {
            "id": "fist",
            "name": "FIST",
            "category": "Basic",
            "raised_fingers": 0,
            "description": "All five fingers tightly curled into the palm.",
            "formula": "Thumb: CLOSED, Index: CLOSED, Middle: CLOSED, Ring: CLOSED, Pinky: CLOSED",
            "fingers": {"thumb": False, "index": False, "middle": False, "ring": False, "pinky": False},
            "tips": "Curl all fingers towards the palm and tuck your thumb across."
        },
        {
            "id": "open_palm",
            "name": "OPEN PALM",
            "category": "Basic",
            "raised_fingers": 5,
            "description": "All five fingers fully extended and spread outwards.",
            "formula": "Thumb: OPEN, Index: OPEN, Middle: OPEN, Ring: OPEN, Pinky: OPEN",
            "fingers": {"thumb": True, "index": True, "middle": True, "ring": True, "pinky": True},
            "tips": "Face your open palm toward the camera with all fingers stretched."
        },
        {
            "id": "one",
            "name": "ONE",
            "category": "Numbers",
            "raised_fingers": 1,
            "description": "Only the index finger extended upward; all other fingers closed.",
            "formula": "Thumb: CLOSED, Index: OPEN, Middle: CLOSED, Ring: CLOSED, Pinky: CLOSED",
            "fingers": {"thumb": False, "index": True, "middle": False, "ring": False, "pinky": False},
            "tips": "Point your index finger up while curling middle, ring, pinky, and thumb."
        },
        {
            "id": "two",
            "name": "TWO",
            "category": "Numbers",
            "raised_fingers": 2,
            "description": "Index and middle fingers extended together; ring, pinky, and thumb closed.",
            "formula": "Thumb: CLOSED, Index: OPEN, Middle: OPEN, Ring: CLOSED, Pinky: CLOSED",
            "fingers": {"thumb": False, "index": True, "middle": True, "ring": False, "pinky": False},
            "tips": "Keep index and middle fingers straight up and held close together."
        },
        {
            "id": "three",
            "name": "THREE",
            "category": "Numbers",
            "raised_fingers": 3,
            "description": "Index, middle, and ring fingers extended; pinky and thumb closed.",
            "formula": "Thumb: CLOSED, Index: OPEN, Middle: OPEN, Ring: OPEN, Pinky: CLOSED",
            "fingers": {"thumb": False, "index": True, "middle": True, "ring": True, "pinky": False},
            "tips": "Raise index, middle, and ring fingers while keeping thumb and pinky folded."
        },
        {
            "id": "four",
            "name": "FOUR",
            "category": "Numbers",
            "raised_fingers": 4,
            "description": "Four fingers (index, middle, ring, pinky) extended; thumb folded across palm.",
            "formula": "Thumb: CLOSED, Index: OPEN, Middle: OPEN, Ring: OPEN, Pinky: OPEN",
            "fingers": {"thumb": False, "index": True, "middle": True, "ring": True, "pinky": True},
            "tips": "Extend all four fingers up while folding your thumb inward."
        },
        {
            "id": "five",
            "name": "FIVE",
            "category": "Numbers",
            "raised_fingers": 5,
            "description": "All five fingers open representing the numeral 5.",
            "formula": "Thumb: OPEN, Index: OPEN, Middle: OPEN, Ring: OPEN, Pinky: OPEN",
            "fingers": {"thumb": True, "index": True, "middle": True, "ring": True, "pinky": True},
            "tips": "Display five fingers open facing the webcam."
        },
        {
            "id": "thumbs_up",
            "name": "THUMBS UP",
            "category": "Gestures",
            "raised_fingers": 1,
            "description": "Thumb pointing upright with the four fingers curled into a fist (approval / like).",
            "formula": "Thumb: OPEN (pointing UP), Index: CLOSED, Middle: CLOSED, Ring: CLOSED, Pinky: CLOSED",
            "fingers": {"thumb": True, "index": False, "middle": False, "ring": False, "pinky": False},
            "tips": "Make a fist and extend your thumb straight upward towards the ceiling."
        },
        {
            "id": "thumbs_down",
            "name": "THUMBS DOWN",
            "category": "Gestures",
            "raised_fingers": 1,
            "description": "Thumb pointing downward with four fingers curled into a fist (disapproval / dislike).",
            "formula": "Thumb: OPEN (pointing DOWN), Index: CLOSED, Middle: CLOSED, Ring: CLOSED, Pinky: CLOSED",
            "fingers": {"thumb": True, "index": False, "middle": False, "ring": False, "pinky": False},
            "tips": "Make a fist and rotate your wrist so your thumb points down to the floor."
        },
        {
            "id": "peace",
            "name": "PEACE",
            "category": "Gestures",
            "raised_fingers": 2,
            "description": "Index and middle fingers extended apart in a V shape; victory / peace sign.",
            "formula": "Thumb: CLOSED, Index: OPEN, Middle: OPEN (separated V-shape), Ring: CLOSED, Pinky: CLOSED",
            "fingers": {"thumb": False, "index": True, "middle": True, "ring": False, "pinky": False},
            "tips": "Form a V shape by spreading your index and middle fingers apart."
        },
        {
            "id": "ok",
            "name": "OK",
            "category": "Gestures",
            "raised_fingers": 3,
            "description": "Thumb tip touches index tip forming a circle, with middle, ring, and pinky upright.",
            "formula": "Thumb Tip touches Index Tip, Middle: OPEN, Ring: OPEN, Pinky: OPEN",
            "fingers": {"thumb": False, "index": False, "middle": True, "ring": True, "pinky": True},
            "tips": "Touch your thumb tip and index tip together while keeping the remaining 3 fingers upright."
        },
        {
            "id": "i_love_you",
            "name": "I LOVE YOU",
            "category": "ASL Signs",
            "raised_fingers": 3,
            "description": "American Sign Language (ASL) 'I Love You': Thumb, Index, and Pinky open.",
            "formula": "Thumb: OPEN, Index: OPEN, Middle: CLOSED, Ring: CLOSED, Pinky: OPEN",
            "fingers": {"thumb": True, "index": True, "middle": False, "ring": False, "pinky": True},
            "tips": "Extend your thumb, index finger, and pinky while keeping middle and ring curled down."
        },
        {
            "id": "rock",
            "name": "ROCK",
            "category": "Bonus",
            "raised_fingers": 2,
            "description": "Rock on / Sign of the horns: Index and Pinky extended, middle and ring curled.",
            "formula": "Thumb: CLOSED, Index: OPEN, Middle: CLOSED, Ring: CLOSED, Pinky: OPEN",
            "fingers": {"thumb": False, "index": True, "middle": False, "ring": False, "pinky": True},
            "tips": "Extend index and pinky fingers while holding down middle and ring fingers."
        },
        {
            "id": "call_me",
            "name": "CALL ME",
            "category": "Bonus",
            "raised_fingers": 2,
            "description": "Shaka / Call me sign: Thumb and Pinky extended outward, other three fingers closed.",
            "formula": "Thumb: OPEN, Index: CLOSED, Middle: CLOSED, Ring: CLOSED, Pinky: OPEN",
            "fingers": {"thumb": True, "index": False, "middle": False, "ring": False, "pinky": True},
            "tips": "Extend thumb and pinky outwards like a phone handset, curling the three middle fingers."
        },
        {
            "id": "finger_gun",
            "name": "FINGER GUN",
            "category": "Gestures",
            "raised_fingers": 2,
            "description": "Thumb upright and index finger pointing forward like a gun; other three fingers closed.",
            "formula": "Thumb: OPEN, Index: OPEN, Middle: CLOSED, Ring: CLOSED, Pinky: CLOSED",
            "fingers": {"thumb": True, "index": True, "middle": False, "ring": False, "pinky": False},
            "tips": "Point your index finger forward and hold your thumb straight up."
        },
        {
            "id": "pinch",
            "name": "PINCH",
            "category": "Gestures",
            "raised_fingers": 0,
            "description": "Thumb tip and index tip held close together with other fingers curled into the palm.",
            "formula": "Thumb Tip close to Index Tip, Middle: CLOSED, Ring: CLOSED, Pinky: CLOSED",
            "fingers": {"thumb": False, "index": False, "middle": False, "ring": False, "pinky": False},
            "tips": "Bring your thumb and index tips together as if pinching a small object, keeping other fingers closed."
        },
        {
            "id": "pinky_up",
            "name": "PINKY UP",
            "category": "Gestures",
            "raised_fingers": 1,
            "description": "Only the pinky finger extended upward; thumb, index, middle, and ring closed (Pinky Promise / Tea time).",
            "formula": "Thumb: CLOSED, Index: CLOSED, Middle: CLOSED, Ring: CLOSED, Pinky: OPEN",
            "fingers": {"thumb": False, "index": False, "middle": False, "ring": False, "pinky": True},
            "tips": "Make a fist and raise only your pinky finger."
        },
        {
            "id": "l_sign",
            "name": "LOSER (L SIGN)",
            "category": "Gestures",
            "raised_fingers": 2,
            "description": "Thumb and index finger extended at a 90-degree angle forming the letter 'L'.",
            "formula": "Thumb: OPEN (horizontal), Index: OPEN (vertical), Middle: CLOSED, Ring: CLOSED, Pinky: CLOSED",
            "fingers": {"thumb": True, "index": True, "middle": False, "ring": False, "pinky": False},
            "tips": "Extend index up and thumb out to the side forming an 'L' shape."
        },
        {
            "id": "spock",
            "name": "SPOCK (VULCAN SALUTE)",
            "category": "Bonus",
            "raised_fingers": 5,
            "description": "Live long and prosper: Index & middle paired together, ring & pinky paired together with a central V split.",
            "formula": "Thumb: OPEN, Index & Middle paired, Ring & Pinky paired, split in middle",
            "fingers": {"thumb": True, "index": True, "middle": True, "ring": True, "pinky": True},
            "tips": "Open your hand and separate middle and ring fingers into two pairs."
        },
        {
            "id": "stop",
            "name": "STOP / HALT",
            "category": "Gestures",
            "raised_fingers": 5,
            "description": "All five fingers open, held tightly together facing directly toward the camera.",
            "formula": "All 5 fingers OPEN and held close together (palm flat facing camera)",
            "fingers": {"thumb": True, "index": True, "middle": True, "ring": True, "pinky": True},
            "tips": "Hold your palm flat towards the camera with all fingers straight and pressed together."
        }
    ]

    @staticmethod
    def _dist_2d(p1: Dict[str, float], p2: Dict[str, float]) -> float:
        dx = p1["x"] - p2["x"]
        dy = p1["y"] - p2["y"]
        return float(np.sqrt(dx * dx + dy * dy))

    def recognize(
        self,
        finger_data: Dict[str, Any],
        landmarks: List[Dict[str, Any]],
        handedness: str = "Right"
    ) -> Dict[str, Any]:
        """
        Recognize gesture given finger states, 21 landmarks, and handedness.
        Returns gesture name, confidence score, and matching details.
        """
        if not landmarks or len(landmarks) < 21:
            return {
                "gesture": "UNKNOWN",
                "confidence": 0.0,
                "category": "Unknown",
                "description": "Hand landmarks incomplete."
            }

        thumb = finger_data.get("thumb", False)
        index = finger_data.get("index", False)
        middle = finger_data.get("middle", False)
        ring = finger_data.get("ring", False)
        pinky = finger_data.get("pinky", False)
        raised_fingers = finger_data.get("raised_fingers", 0)
        palm_scale = max(finger_data.get("palm_scale", 0.1), 0.05)

        lm = landmarks
        wrist = lm[0]
        thumb_tip = lm[4]
        thumb_mcp = lm[2]
        thumb_ip = lm[3]
        index_tip = lm[8]
        index_mcp = lm[5]
        middle_tip = lm[12]
        middle_mcp = lm[9]
        ring_tip = lm[16]
        pinky_mcp = lm[17]
        pinky_tip = lm[20]

        # Geometric relations
        dist_thumb_index_tips = self._dist_2d(thumb_tip, index_tip) / palm_scale
        dist_index_middle_tips = self._dist_2d(index_tip, middle_tip) / palm_scale

        # -------------------------------------------------------------
        # 1. OK Gesture Check (Thumb and Index tips touching circle)
        # -------------------------------------------------------------
        # In OK sign, thumb and index tips are pinched/touching (dist < 0.40 of palm),
        # while middle, ring, and pinky are extended.
        if dist_thumb_index_tips < 0.40 and middle and ring:
            confidence = min(0.98, max(0.82, 1.0 - (dist_thumb_index_tips / 0.40) * 0.2))
            return {
                "gesture": "OK",
                "confidence": round(confidence, 2),
                "category": "Gestures",
                "description": "Thumb and index tips touching to form OK sign."
            }

        # -------------------------------------------------------------
        # 1B. PINCH
        # Thumb and index close together, but extended out from wrist (not curled in fist)
        # -------------------------------------------------------------
        dist_index_wrist = self._dist_2d(index_tip, wrist) / palm_scale
        if dist_thumb_index_tips < 0.36 and not middle and not ring and not pinky and dist_index_wrist > 0.80:
            return {
                "gesture": "PINCH",
                "confidence": 0.95,
                "category": "Gestures",
                "description": "Thumb and index tips pinched close together."
            }

        # -------------------------------------------------------------
        # 2. I LOVE YOU (ASL)
        # Thumb open, Index open, Pinky open, Middle closed, Ring closed
        # -------------------------------------------------------------
        if thumb and index and pinky and not middle and not ring:
            return {
                "gesture": "I LOVE YOU",
                "confidence": 0.96,
                "category": "ASL Signs",
                "description": "ASL 'I Love You' sign with thumb, index, and pinky raised."
            }

        # -------------------------------------------------------------
        # 3. ROCK / HORNS (Bonus)
        # Index open, Pinky open, Middle closed, Ring closed, Thumb closed
        # -------------------------------------------------------------
        if not thumb and index and pinky and not middle and not ring:
            return {
                "gesture": "ROCK",
                "confidence": 0.94,
                "category": "Bonus",
                "description": "Rock on / horns sign."
            }

        # -------------------------------------------------------------
        # 4. CALL ME (Bonus)
        # Thumb open, Pinky open, Index closed, Middle closed, Ring closed
        # -------------------------------------------------------------
        if thumb and pinky and not index and not middle and not ring:
            return {
                "gesture": "CALL ME",
                "confidence": 0.95,
                "category": "Bonus",
                "description": "Call me / Shaka gesture."
            }

        # -------------------------------------------------------------
        # 5. THUMBS UP / THUMBS DOWN
        # Only thumb is open (or raised_fingers == 1 and thumb == True)
        # -------------------------------------------------------------
        if thumb and not index and not middle and not ring and not pinky:
            # Check vertical direction of thumb relative to MCP and wrist
            dy_tip_mcp = thumb_tip["y"] - thumb_mcp["y"]
            dy_tip_wrist = thumb_tip["y"] - wrist["y"]

            if dy_tip_mcp < -0.04 and dy_tip_wrist < -0.05:
                # Pointing upwards (smaller Y coordinate in screen space)
                return {
                    "gesture": "THUMBS UP",
                    "confidence": 0.97,
                    "category": "Gestures",
                    "description": "Thumb pointing straight up in approval."
                }
            elif dy_tip_mcp > 0.04 and dy_tip_wrist > 0.05:
                # Pointing downwards (larger Y coordinate in screen space)
                return {
                    "gesture": "THUMBS DOWN",
                    "confidence": 0.97,
                    "category": "Gestures",
                    "description": "Thumb pointing straight down in disapproval."
                }

        # -------------------------------------------------------------
        # 5B. PINKY UP
        # -------------------------------------------------------------
        if pinky and not thumb and not index and not middle and not ring:
            return {
                "gesture": "PINKY UP",
                "confidence": 0.96,
                "category": "Gestures",
                "description": "Pinky finger raised upright while other fingers are closed."
            }

        # -------------------------------------------------------------
        # 5C. FINGER GUN / LOSER (L SIGN)
        # Thumb and Index open, other 3 closed
        # -------------------------------------------------------------
        if thumb and index and not middle and not ring and not pinky:
            dist_ti = self._dist_2d(thumb_tip, index_tip) / palm_scale
            if dist_ti > 0.60:
                return {
                    "gesture": "LOSER (L SIGN)",
                    "confidence": 0.95,
                    "category": "Gestures",
                    "description": "Thumb and index extended at a 90-degree angle forming an 'L'."
                }
            else:
                return {
                    "gesture": "FINGER GUN",
                    "confidence": 0.94,
                    "category": "Gestures",
                    "description": "Thumb upright and index pointing forward like a gun."
                }

        # -------------------------------------------------------------
        # 6. PEACE vs TWO
        # Index and middle are open; ring, pinky closed
        # -------------------------------------------------------------
        if index and middle and not ring and not pinky:
            # Check separation between index and middle tips for PEACE
            if dist_index_middle_tips > 0.32:
                return {
                    "gesture": "PEACE",
                    "confidence": 0.95,
                    "category": "Gestures",
                    "description": "Index and middle fingers spread in V-shape peace sign."
                }
            else:
                return {
                    "gesture": "TWO",
                    "confidence": 0.93,
                    "category": "Numbers",
                    "description": "Two fingers extended together."
                }

        # -------------------------------------------------------------
        # 7. ONE
        # Only index open
        # -------------------------------------------------------------
        if index and not middle and not ring and not pinky and not thumb:
            return {
                "gesture": "ONE",
                "confidence": 0.96,
                "category": "Numbers",
                "description": "Single index finger raised."
            }

        # -------------------------------------------------------------
        # 8. THREE
        # Standard: Index + Middle + Ring open; Pinky and Thumb closed
        # ASL: Thumb + Index + Middle open; Ring and Pinky closed
        # -------------------------------------------------------------
        if index and middle and ring and not pinky and not thumb:
            return {
                "gesture": "THREE",
                "confidence": 0.95,
                "category": "Numbers",
                "description": "Three fingers (index, middle, ring) raised."
            }
        if thumb and index and middle and not ring and not pinky:
            return {
                "gesture": "THREE",
                "confidence": 0.92,
                "category": "Numbers",
                "description": "Three fingers (thumb, index, middle) raised (ASL three)."
            }

        # -------------------------------------------------------------
        # 9. FOUR
        # Four fingers open (index, middle, ring, pinky), thumb closed
        # -------------------------------------------------------------
        if index and middle and ring and pinky and not thumb:
            return {
                "gesture": "FOUR",
                "confidence": 0.96,
                "category": "Numbers",
                "description": "Four fingers raised with thumb folded across palm."
            }

        # -------------------------------------------------------------
        # 10. FIVE / OPEN PALM / SPOCK / STOP
        # All five fingers open
        # -------------------------------------------------------------
        if raised_fingers == 5:
            dist_middle_ring_tips = self._dist_2d(middle_tip, ring_tip) / palm_scale
            dist_ring_pinky_tips = self._dist_2d(ring_tip, pinky_tip) / palm_scale

            # Spock / Vulcan Salute check
            if dist_middle_ring_tips > 0.30 and dist_index_middle_tips < 0.24 and dist_ring_pinky_tips < 0.24:
                return {
                    "gesture": "SPOCK (VULCAN SALUTE)",
                    "confidence": 0.96,
                    "category": "Bonus",
                    "description": "Live long and prosper: Index/middle and ring/pinky paired with central split."
                }

            # Stop / Halt check (fingers held tightly together)
            if dist_index_middle_tips < 0.19 and dist_middle_ring_tips < 0.19 and dist_ring_pinky_tips < 0.19:
                return {
                    "gesture": "STOP / HALT",
                    "confidence": 0.96,
                    "category": "Gestures",
                    "description": "All five fingers straight and pressed tightly together in a halt command."
                }

            return {
                "gesture": "OPEN PALM",
                "confidence": 0.98,
                "category": "Basic",
                "description": "All five fingers open and extended."
            }

        # -------------------------------------------------------------
        # 11. FIST
        # All fingers closed
        # -------------------------------------------------------------
        if raised_fingers == 0:
            return {
                "gesture": "FIST",
                "confidence": 0.97,
                "category": "Basic",
                "description": "All fingers closed into a tight fist."
            }

        # -------------------------------------------------------------
        # 12. Fallback based on raised fingers count
        # -------------------------------------------------------------
        if raised_fingers == 1:
            return {
                "gesture": "ONE",
                "confidence": 0.85,
                "category": "Numbers",
                "description": "One finger detected open."
            }
        elif raised_fingers == 2:
            return {
                "gesture": "TWO",
                "confidence": 0.85,
                "category": "Numbers",
                "description": "Two fingers detected open."
            }
        elif raised_fingers == 3:
            return {
                "gesture": "THREE",
                "confidence": 0.85,
                "category": "Numbers",
                "description": "Three fingers detected open."
            }
        elif raised_fingers == 4:
            return {
                "gesture": "FOUR",
                "confidence": 0.88,
                "category": "Numbers",
                "description": "Four fingers detected open."
            }

        return {
            "gesture": "UNKNOWN",
            "confidence": 0.50,
            "category": "Unknown",
            "description": "Hand position does not match a predefined gesture."
        }
