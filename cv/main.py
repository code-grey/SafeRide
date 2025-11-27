import cv2
import mediapipe as mp
import numpy as np
import time
import json
import paho.mqtt.client as mqtt
from scipy.spatial import distance as dist

# ==========================================
# 1. CONFIGURATION
# ==========================================
MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_TOPIC = "vehicles/v-101/telemetry"
VEHICLE_ID = "v-101"

# Thresholds
EAR_THRESHOLD = 0.25        # Eyes closed threshold
EAR_CONSEC_FRAMES = 20      # Number of frames eyes must be closed to trigger FATIGUE
HEAD_YAW_THRESHOLD = 0.4    # Head turn threshold (approx)
DISTRACTION_FRAMES = 20     # Frames to trigger DISTRACTED

# ==========================================
# 2. MQTT SETUP
# ==========================================
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, "cv-agent")
try:
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.loop_start()
    print(f"✅ Connected to MQTT at {MQTT_BROKER}:{MQTT_PORT}")
except Exception as e:
    print(f"❌ MQTT Connection Failed: {e}")
    print("Running in Offline Mode (Visual Only)")

# ==========================================
# 3. MEDIAPIPE SETUP
# ==========================================
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Landmark Indices (MediaPipe specific)
# Left Eye
LEFT_EYE = [362, 385, 387, 263, 373, 380]
# Right Eye
RIGHT_EYE = [33, 160, 158, 133, 153, 144]
# Nose Tip (for head pose estimation)
NOSE_TIP = 1

# ==========================================
# 4. HELPER FUNCTIONS
# ==========================================
def calculate_ear(eye_points, landmarks):
    # eye_points is a list of indices
    # landmarks is the list of (x, y) coordinates
    
    # Vertical distances
    A = dist.euclidean(landmarks[eye_points[1]], landmarks[eye_points[5]])
    B = dist.euclidean(landmarks[eye_points[2]], landmarks[eye_points[4]])
    
    # Horizontal distance
    C = dist.euclidean(landmarks[eye_points[0]], landmarks[eye_points[3]])
    
    ear = (A + B) / (2.0 * C)
    return ear

def get_landmark_coords(landmarks, image_w, image_h):
    coords = []
    for lm in landmarks:
        coords.append((int(lm.x * image_w), int(lm.y * image_h)))
    return coords

# ==========================================
# 5. MAIN LOOP
# ==========================================
cap = cv2.VideoCapture(0)
frame_counter = 0
drowsy_counter = 0
distracted_counter = 0
current_status = "safe"
last_publish_time = 0

print("📷 Starting Camera... Press 'q' to exit.")

while cap.isOpened():
    success, image = cap.read()
    if not success:
        print("Ignoring empty camera frame.")
        continue

    # Flip image for mirror view
    image = cv2.flip(image, 1)
    h, w, _ = image.shape
    
    # Convert to RGB for MediaPipe
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(image_rgb)
    
    # Default status
    status = "safe"
    
    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            # Convert landmarks to 2D coordinates
            lm_coords = get_landmark_coords(face_landmarks.landmark, w, h)
            
            # ----------------------------------
            # A. DROWSINESS DETECTION (EAR)
            # ----------------------------------
            # Get coordinates for left and right eyes
            left_eye_coords = [lm_coords[i] for i in LEFT_EYE]
            right_eye_coords = [lm_coords[i] for i in RIGHT_EYE]
            
            leftEAR = calculate_ear(list(range(6)), left_eye_coords)
            rightEAR = calculate_ear(list(range(6)), right_eye_coords)
            avgEAR = (leftEAR + rightEAR) / 2.0
            
            # Check EAR Threshold
            if avgEAR < EAR_THRESHOLD:
                drowsy_counter += 1
            else:
                drowsy_counter = max(0, drowsy_counter - 1) # Decay slowly
            
            # Visuals: Draw Eyes
            cv2.polylines(image, [np.array(left_eye_coords)], True, (0, 255, 0), 1)
            cv2.polylines(image, [np.array(right_eye_coords)], True, (0, 255, 0), 1)
            
            # ----------------------------------
            # B. DISTRACTION DETECTION (Head Pose Proxy)
            # ----------------------------------
            # We use the relative position of the nose to the face width
            # Simplification: If nose is too close to left or right edge of face bounding box
            
            face_left_edge = lm_coords[234][0] # Ear/Face edge
            face_right_edge = lm_coords[454][0]
            nose_x = lm_coords[NOSE_TIP][0]
            
            face_width = face_right_edge - face_left_edge
            relative_nose_x = (nose_x - face_left_edge) / face_width
            
            # Normal range is approx 0.3 to 0.7. Outside this = turning head.
            if relative_nose_x < 0.2 or relative_nose_x > 0.8:
                distracted_counter += 1
            else:
                distracted_counter = max(0, distracted_counter - 1)

            # ----------------------------------
            # C. STATUS LOGIC
            # ----------------------------------
            if drowsy_counter >= EAR_CONSEC_FRAMES:
                status = "fatigue"
                cv2.putText(image, "DROWSINESS ALERT!", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            
            elif distracted_counter >= DISTRACTION_FRAMES:
                status = "distracted"
                cv2.putText(image, "DISTRACTION ALERT!", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 165, 255), 2)
            
            else:
                status = "safe"
                cv2.putText(image, "Driver Safe", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

            # Debug Info on Screen
            cv2.putText(image, f"EAR: {avgEAR:.2f}", (w - 150, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
            cv2.putText(image, f"Pose: {relative_nose_x:.2f}", (w - 150, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

    # ==========================================
    # 6. PUBLISH TELEMETRY
    # ==========================================
    # Rate Limit: Publish every 0.5 seconds to avoid spamming
    if time.time() - last_publish_time > 0.5:
        payload = {
            "vehicle_id": VEHICLE_ID,
            "timestamp": int(time.time()),
            "status": status,
            "lat": 28.7041,
            "long": 77.1025,
            "confidence": 0.95 if status != "safe" else 0.99
        }
        try:
            client.publish(MQTT_TOPIC, json.dumps(payload))
            # print(f"Sent: {status}") # Optional: uncomment for debug
        except: pass
        last_publish_time = time.time()

    # Show Frame
    cv2.imshow('SafeRide AI Guard - "Project Hawkeye"', image)
    
    if cv2.waitKey(5) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
client.loop_stop()
