from flask import Flask, Response
import subprocess
import cv2
import numpy as np
import time

app = Flask(__name__)

class RobustTrayScanner:
    def __init__(self):
        # --- PARAMETER TUNING (Ubah di sini) ---
        self.blur_kernel = (7, 7)        # (3,3), (5,5), (7,7)
        self.canny_min = 30              # 10 - 50
        self.canny_max = 170             # 100 - 200
        self.dilate_iter = 5             # 1 - 4

        self.min_area = 6000
        self.poly_approx = 0.04

        self.out_w = 600
        self.out_h = 450

    def preprocess_steps(self, frame):
        """Mengembalikan SEMUA tahap preprocessing"""
        # 1. Grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # 2. Gaussian Blur
        blurred = cv2.GaussianBlur(gray, self.blur_kernel, 0)

        # 3. Canny Edge Detection
        edges = cv2.Canny(blurred, self.canny_min, self.canny_max)

        # 4. Dilation
        kernel = np.ones((3, 3), np.uint8)
        dilated = cv2.dilate(edges, kernel, iterations=self.dilate_iter)

        # Return Dictionary semua step
        return {
            "gray": gray,
            "blur": blurred,
            "canny": edges,
            "dilated": dilated
        }

    def get_tray_contour(self, processed_frame):
        contours, _ = cv2.findContours(processed_frame, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours: return None

        contours = sorted(contours, key=cv2.contourArea, reverse=True)
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area < self.min_area: continue

            peri = cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, self.poly_approx * peri, True)

            if len(approx) == 4:
                return approx
        return None

    def get_warped(self, frame, corners):
        # Urutkan titik
        rect = np.zeros((4, 2), dtype="float32")
        s = corners.reshape(4, 2).sum(axis=1)
        diff = np.diff(corners.reshape(4, 2), axis=1)

        rect[0] = corners.reshape(4, 2)[np.argmin(s)]
        rect[2] = corners.reshape(4, 2)[np.argmax(s)]
        rect[1] = corners.reshape(4, 2)[np.argmin(diff)]
        rect[3] = corners.reshape(4, 2)[np.argmax(diff)]

        dst = np.array([
            [0, 0],
            [self.out_w - 1, 0],
            [self.out_w - 1, self.out_h - 1],
            [0, self.out_h - 1]
        ], dtype="float32")

        M = cv2.getPerspectiveTransform(rect, dst)
        warped = cv2.warpPerspective(frame, M, (self.out_w, self.out_h))
        return warped

scanner = RobustTrayScanner()

# Global Buffers untuk semua step
frames = {
    "main": None,
    "gray": None,
    "blur": None,
    "canny": None,
    "dilated": None,
    "warped": None
}

def camera_loop():
    global frames
    cmd = ["rpicam-vid", "--codec", "mjpeg", "-t", "0", "--width", "800", "--height", "600", "--framerate", "10", "-o", "-"]

    try:
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, bufsize=0)
    except FileNotFoundError:
        cmd[0] = "libcamera-vid"
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, bufsize=0)

    buffer = b''
    while True:
        data = process.stdout.read(4096)
        if not data: break
        buffer += data

        if len(buffer) > 10 * 1024 * 1024: buffer = b'' # Safety

        a = buffer.find(b'\xff\xd8')
        b = buffer.find(b'\xff\xd9')

        if a != -1 and b != -1:
            jpg = buffer[a:b+2]
            buffer = buffer[b+2:]

            try:
                frame = cv2.imdecode(np.frombuffer(jpg, dtype=np.uint8), cv2.IMREAD_COLOR)
                if frame is not None:
                    frame = cv2.flip(frame, 1)
                    frame = cv2.flip(frame, 0)
                    # 1. Jalankan semua step Preprocessing
                    steps = scanner.preprocess_steps(frame)

                    # 2. Cari Kontur pakai hasil akhir (dilated)
                    contour = scanner.get_tray_contour(steps["dilated"])

                    vis_frame = frame.copy()
                    warped_res = np.zeros((300, 300, 3), dtype=np.uint8)

                    if contour is not None:
                        cv2.drawContours(vis_frame, [contour], -1, (0, 255, 0), 3)
                        warped_res = scanner.get_warped(frame, contour)

                    # Update semua global frames
                    frames["main"] = vis_frame
                    frames["gray"] = steps["gray"]
                    frames["blur"] = steps["blur"]
                    frames["canny"] = steps["canny"]
                    frames["dilated"] = steps["dilated"]
                    frames["warped"] = warped_res
            except:
                pass

def gen_frames(key):
    while True:
        time.sleep(0.1)
        img = frames.get(key)
        if img is None: continue

        try:
            ret, buf = cv2.imencode('.jpg', img)
            if ret:
                yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + buf.tobytes() + b'\r\n')
        except: continue

@app.route('/')
def index():
    return """
    <html>
    <head>
        <title>Full Pipeline Debug</title>
        <style>
            body { background: #1a1a1a; color: #fff; font-family: monospace; text-align: center; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; padding: 20px; }
            .card { background: #333; padding: 10px; border-radius: 8px; }
            img { width: 100%; border-radius: 4px; border: 1px solid #555; }
            h3 { margin: 5px 0; color: #4ade80; font-size: 14px; }
            p { margin: 0; font-size: 11px; color: #aaa; }
        </style>
    </head>
    <body>
        <h1>🛠️ OpenCV Pipeline Debugger</h1>
        <div class="grid">
            <div class="card">
                <h3>1. Input (Grayscale)</h3>
                <p>Cek pencahayaan di sini</p>
                <img src="/feed/gray">
            </div>
            <div class="card">
                <h3>2. Gaussian Blur</h3>
                <p>Noise (bintik) harus hilang</p>
                <img src="/feed/blur">
            </div>
            <div class="card">
                <h3>3. Canny Edges</h3>
                <p>Garis tipis putus-putus</p>
                <img src="/feed/canny">
            </div>

            <div class="card">
                <h3>4. Dilation (Thick)</h3>
                <p>Garis harus tebal & nyambung</p>
                <img src="/feed/dilated">
            </div>
            <div class="card">
                <h3>5. Live Detection</h3>
                <p>Kotak hijau = Lock</p>
                <img src="/feed/main">
            </div>
            <div class="card">
                <h3>6. Final Output</h3>
                <p>Warped perspective</p>
                <img src="/feed/warped">
            </div>
        </div>
    </body>
    </html>
    """

@app.route('/feed/<key>')
def feed(key):
    return Response(gen_frames(key), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    from threading import Thread
    t = Thread(target=camera_loop)
    t.daemon = True
    t.start()
    app.run(host='0.0.0.0', port=5000, debug=False)