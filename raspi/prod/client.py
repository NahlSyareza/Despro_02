import cv2
import numpy as np
import subprocess
import requests
import time
import threading
import logging
from logging.handlers import RotatingFileHandler
from flask import Flask, Response

# ==========================================
# 🔧 KONFIGURASI PROJECT
# ==========================================
BACKEND_URL = "https://nutriguard.api.digilabdte.com/tray/upload" # <--- GANTI IP
VENDOR_ID = "39d026d7-d6c8-442e-9a6e-a5696c49a434"          # <--- GANTI UUID

# Parameter Auto-Capture
STABILITY_THRESHOLD = 10
FRAMES_TO_LOCK = 15
COOLDOWN_SECONDS = 5

# ==========================================
# 📝 KONFIGURASI LOGGER
# ==========================================
# 1. Setup Logger
logger = logging.getLogger("NutriGuard_Client")
logger.setLevel(logging.DEBUG)

# 2. File Handler (Simpan ke file, max 5MB, simpan 3 backup)
file_handler = RotatingFileHandler("client.log", maxBytes=5*1024*1024, backupCount=3)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)

# 3. Console Handler (Tampil di Terminal)
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)

logger.addHandler(file_handler)
logger.addHandler(console_handler)

# 4. UI Log State (Untuk ditampilkan di Video)
ui_log_message = "System Ready"
ui_log_color = (0, 255, 0) # Hijau
ui_log_time = time.time()

def log_ui(message, level="info"):
    """Fungsi helper untuk log ke Console, File, DAN Layar Video"""
    global ui_log_message, ui_log_color, ui_log_time

    ui_log_message = message
    ui_log_time = time.time()

    if level == "error":
        logger.error(message)
        ui_log_color = (0, 0, 255) # Merah
    elif level == "warning":
        logger.warning(message)
        ui_log_color = (0, 255, 255) # Kuning
    else:
        logger.info(message)
        ui_log_color = (0, 255, 0) # Hijau

# ==========================================

app = Flask(__name__)

class MetalTrayProcessor:
    def __init__(self):
        # Parameter Metal Tray
        self.bilateral_d = 9
        self.sigma_color = 75
        self.sigma_space = 75
        self.canny_min = 50
        self.canny_max = 150
        self.morph_kernel = 5
        self.dilate_iter = 1
        self.min_area = 5000
        self.poly_approx = 0.04
        self.out_w, self.out_h = 600, 450

    def process(self, frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        bilateral = cv2.bilateralFilter(gray, self.bilateral_d, self.sigma_color, self.sigma_space)
        edges = cv2.Canny(bilateral, self.canny_min, self.canny_max)
        kernel = np.ones((self.morph_kernel, self.morph_kernel), np.uint8)
        closed = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel)
        dilated = cv2.dilate(closed, kernel, iterations=self.dilate_iter)
        return dilated

    def get_best_contour(self, processed_frame):
        contours, _ = cv2.findContours(processed_frame, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours: return None
        contours = sorted(contours, key=cv2.contourArea, reverse=True)
        for cnt in contours:
            if cv2.contourArea(cnt) < self.min_area: continue
            peri = cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, self.poly_approx * peri, True)
            if len(approx) == 4: return approx
        return None

    def warp_image(self, frame, corners):
        pts = corners.reshape(4, 2)
        rect = np.zeros((4, 2), dtype="float32")
        s = pts.sum(axis=1)
        rect[0] = pts[np.argmin(s)]
        rect[2] = pts[np.argmax(s)]
        diff = np.diff(pts, axis=1)
        rect[1] = pts[np.argmin(diff)]
        rect[3] = pts[np.argmax(diff)]
        dst = np.array([[0, 0], [self.out_w-1, 0], [self.out_w-1, self.out_h-1], [0, self.out_h-1]], dtype="float32")
        M = cv2.getPerspectiveTransform(rect, dst)
        return cv2.warpPerspective(frame, M, (self.out_w, self.out_h))

processor = MetalTrayProcessor()

# Global State
current_view = None
last_upload_time = 0
stability_counter = 0
last_center = (0, 0)

def upload_worker(image_data):
    try:
        ret, jpg_binary = cv2.imencode('.jpg', image_data)
        if not ret:
            log_ui("Error: Gagal Encode JPG", "error")
            return

        log_ui("🚀 Mengupload...", "info")
        files = {'image': ('tray.jpg', jpg_binary.tobytes(), 'image/jpeg')}
        data = {'vendor_id': VENDOR_ID}

        # Mulai Request
        start_time = time.time()
        res = requests.post(BACKEND_URL, files=files, data=data, timeout=15)
        elapsed = time.time() - start_time

        if res.status_code == 201:
            json_data = res.json()
            score = json_data['data']['ai_analysis']['compliance_score']
            tray_id_short = json_data['data']['tray_id'][:8]
            log_ui(f"✅ SUKSES! ID:{tray_id_short} Skor:{score} ({elapsed:.1f}s)", "info")
        else:
            log_ui(f"⚠️ Gagal: {res.status_code} - {res.reason}", "error")

    except requests.exceptions.ConnectionError:
        log_ui("❌ Error: Koneksi ke Backend Terputus", "error")
    except requests.exceptions.Timeout:
        log_ui("❌ Error: Request Timeout (>15s)", "error")
    except Exception as e:
        log_ui(f"❌ Error: {str(e)}", "error")

def main_loop():
    global current_view, last_upload_time, stability_counter, last_center

    cmd = ["rpicam-vid", "--codec", "mjpeg", "-t", "0", "--width", "800", "--height", "600", "--framerate", "15", "-o", "-"]

    try:
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, bufsize=0)
    except FileNotFoundError:
        cmd[0] = "libcamera-vid"
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, bufsize=0)

    buffer = b''
    log_ui("Kamera Aktif. Menunggu Nampan.", "info")

    while True:
        data = process.stdout.read(4096)
        if not data: break
        buffer += data

        if len(buffer) > 10 * 1024 * 1024: buffer = b''

        a = buffer.find(b'\xff\xd8')
        b = buffer.find(b'\xff\xd9')

        if a != -1 and b != -1:
            jpg = buffer[a:b+2]
            buffer = buffer[b+2:]

            try:
                frame = cv2.imdecode(np.frombuffer(jpg, dtype=np.uint8), cv2.IMREAD_COLOR)
                if frame is None: continue
                frame = cv2.flip(frame, -1)

                # --- VISUALISASI LOGGING ---
                # Tampilkan pesan log di pojok kanan atas selama 5 detik terakhir
                if time.time() - ui_log_time < 5:
                    # Kotak background semi-transparan untuk text
                    overlay = frame.copy()
                    cv2.rectangle(overlay, (0, 0), (800, 40), (0,0,0), -1)
                    alpha = 0.6
                    cv2.addWeighted(overlay, alpha, frame, 1 - alpha, 0, frame)
                    # Text Log
                    cv2.putText(frame, ui_log_message, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, ui_log_color, 2)
                # ---------------------------

                if time.time() - last_upload_time < COOLDOWN_SECONDS:
                    wait_time = int(COOLDOWN_SECONDS - (time.time() - last_upload_time))
                    cv2.putText(frame, f"COOLDOWN {wait_time}", (20, 80), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
                    current_view = frame
                    continue

                processed = processor.process(frame)
                contour = processor.get_best_contour(processed)

                vis_frame = frame.copy()

                if contour is not None:
                    M = cv2.moments(contour)
                    cx = int(M["m10"] / M["m00"]) if M["m00"] != 0 else 0
                    cy = int(M["m01"] / M["m00"]) if M["m00"] != 0 else 0

                    cv2.drawContours(vis_frame, [contour], -1, (0, 255, 0), 2)
                    dist = np.sqrt((cx - last_center[0])**2 + (cy - last_center[1])**2)

                    if dist < STABILITY_THRESHOLD:
                        stability_counter += 1
                        bar_width = int((stability_counter / FRAMES_TO_LOCK) * 200)
                        cv2.rectangle(vis_frame, (20, 550), (20 + bar_width, 570), (0, 255, 0), -1)
                        cv2.putText(vis_frame, "STABILIZING...", (20, 540), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

                        if stability_counter >= FRAMES_TO_LOCK:
                            log_ui("📸 Capturing & Uploading...", "warning")
                            warped_img = processor.warp_image(frame, contour)
                            threading.Thread(target=upload_worker, args=(warped_img,)).start()
                            stability_counter = 0
                            last_upload_time = time.time()
                    else:
                        stability_counter = 0
                        cv2.putText(vis_frame, "MOVE", (20, 540), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 165, 255), 2)

                    last_center = (cx, cy)
                else:
                    stability_counter = 0
                    cv2.putText(vis_frame, "SCANNING...", (20, 80), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

                current_view = vis_frame

            except Exception as e:
                logger.error(f"Loop Error: {e}")
                pass

def gen_frames():
    while True:
        time.sleep(0.05)
        if current_view is None: continue
        try:
            ret, buf = cv2.imencode('.jpg', current_view)
            if ret: yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + buf.tobytes() + b'\r\n')
        except: continue

@app.route('/')
def index():
    return """
    <html><body style="background:black;text-align:center;color:white;">
    <h1>NutriGuard Client (Logged)</h1>
    <img src="/video_feed" style="border:2px solid green; width:100%; max-width:800px;">
    </body></html>
    """

@app.route('/video_feed')
def video_feed(): return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    t = threading.Thread(target=main_loop)
    t.daemon = True
    t.start()
    app.run(host='0.0.0.0', port=5000, debug=False)