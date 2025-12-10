from flask import Flask, Response
import subprocess
import cv2
import numpy as np
import time

app = Flask(__name__)

class MetalTrayDebugger:
    def __init__(self):
        # ==========================================
        # 🎛️ AREA TUNING VARIABLE (Ubah di sini)
        # ==========================================

        # 1. BILATERAL FILTER (Penghalus Metal)
        # d: Diameter pixel tetangga (9 - 15)
        # sigmaColor: Semakin tinggi, semakin agresif meratakan warna metal (50 - 150)
        # sigmaSpace: Toleransi jarak piksel (50 - 150)
        self.bilateral_d = 9
        self.sigma_color = 75
        self.sigma_space = 75

        # 2. CANNY EDGE (Deteksi Garis)
        # Min/Max: Karena metal kontrasnya tinggi, nilai ini biasanya lebih tinggi dari nampan plastik
        self.canny_min = 50
        self.canny_max = 150

        # 3. MORPHOLOGY (Penambal Pantulan Cahaya)
        # Ukuran kotak penutup lubang. Ganjil (3, 5, 7, 9)
        # Semakin besar, semakin kuat menutup garis yang putus kena silau.
        self.morph_kernel_size = 5

        # 4. DILATION (Penebalan Akhir)
        self.dilate_iter = 1

        # 5. FILTER UKURAN & BENTUK
        self.min_area = 5000
        self.poly_approx = 0.04
        self.out_w, self.out_h = 600, 450

    def get_pipeline_steps(self, frame):
        """
        Mengembalikan gambar dari SETIAP tahap pemrosesan
        """
        # Step 1: Grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Step 2: Bilateral Filter (Smooth texture, keep edges)
        bilateral = cv2.bilateralFilter(gray, self.bilateral_d, self.sigma_color, self.sigma_space)

        # Step 3: Canny Edges (Raw Edges)
        edges = cv2.Canny(bilateral, self.canny_min, self.canny_max)

        # Step 4: Morphological Closing (Tutup lubang/putus)
        kernel = np.ones((self.morph_kernel_size, self.morph_kernel_size), np.uint8)
        closed = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel)

        # Step 5: Dilation (Tebalkan)
        dilated = cv2.dilate(closed, kernel, iterations=self.dilate_iter)

        return {
            "gray": gray,
            "bilateral": bilateral,
            "canny": edges,
            "closed": closed,
            "dilated": dilated
        }

    def get_contour_and_warp(self, processed_frame, original_frame):
        contours, _ = cv2.findContours(processed_frame, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        warped_res = np.zeros((300, 300, 3), dtype=np.uint8)
        found_contour = None

        if contours:
            contours = sorted(contours, key=cv2.contourArea, reverse=True)
            for cnt in contours:
                if cv2.contourArea(cnt) < self.min_area: continue

                peri = cv2.arcLength(cnt, True)
                approx = cv2.approxPolyDP(cnt, self.poly_approx * peri, True)

                if len(approx) == 4:
                    found_contour = approx

                    # Lakukan Warping
                    rect = np.zeros((4, 2), dtype="float32")
                    pts = approx.reshape(4, 2)
                    s = pts.sum(axis=1)
                    diff = np.diff(pts, axis=1)
                    rect[0] = pts[np.argmin(s)]
                    rect[2] = pts[np.argmax(s)]
                    rect[1] = pts[np.argmin(diff)]
                    rect[3] = pts[np.argmax(diff)]

                    dst = np.array([[0,0], [self.out_w-1,0], [self.out_w-1,self.out_h-1], [0,self.out_h-1]], dtype="float32")
                    M = cv2.getPerspectiveTransform(rect, dst)
                    warped_res = cv2.warpPerspective(original_frame, M, (self.out_w, self.out_h))
                    break

        return found_contour, warped_res

scanner = MetalTrayDebugger()

# Global Image Buffers
frames = {
    "main": None,      # Live View dengan Kotak Hijau
    "bilateral": None, # Hasil Smoothing
    "canny": None,     # Garis Tepi Mentah
    "closed": None,    # Hasil Penambalan Garis
    "dilated": None,   # Hasil Akhir Hitam Putih
    "warped": None     # Hasil Potong
}

def camera_loop():
    global frames
    cmd = ["rpicam-vid", "--codec", "mjpeg", "-t", "0", "--width", "800", "--height", "600", "--framerate", "15", "-o", "-"]

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
        if len(buffer) > 10 * 1024 * 1024: buffer = b''

        a = buffer.find(b'\xff\xd8')
        b = buffer.find(b'\xff\xd9')

        if a != -1 and b != -1:
            jpg = buffer[a:b+2]
            buffer = buffer[b+2:]

            try:
                frame = cv2.imdecode(np.frombuffer(jpg, dtype=np.uint8), cv2.IMREAD_COLOR)
                if frame is not None:
                    frame = cv2.flip(frame, -1) # Mirror
                    # 1. Dapatkan semua gambar step-by-step
                    steps = scanner.get_pipeline_steps(frame)

                    # 2. Cari Kontur & Warp
                    contour, warped = scanner.get_contour_and_warp(steps["dilated"], frame)

                    # 3. Visualisasi
                    vis_frame = frame.copy()
                    if contour is not None:
                        cv2.drawContours(vis_frame, [contour], -1, (0, 255, 0), 3)
                        for p in contour: cv2.circle(vis_frame, tuple(p[0]), 8, (0, 0, 255), -1)
                        cv2.putText(vis_frame, "LOCKED", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

                    # Update Globals
                    frames["main"] = vis_frame
                    frames["bilateral"] = steps["bilateral"]
                    frames["canny"] = steps["canny"]
                    frames["closed"] = steps["closed"]
                    frames["dilated"] = steps["dilated"]
                    frames["warped"] = warped
            except Exception as e:
                print(e)
                pass

def gen_frames(key):
    while True:
        time.sleep(0.1)
        img = frames.get(key)
        if img is None: continue
        try:
            ret, buf = cv2.imencode('.jpg', img)
            if ret: yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + buf.tobytes() + b'\r\n')
        except: continue

@app.route('/')
def index():
    return """
    <html>
    <head>
        <title>Metal Pipeline Debugger</title>
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
        <h1>⚙️ Metal Tray Tuning Dashboard</h1>
        <div class="grid">
            <div class="card">
                <h3>1. Bilateral Filter</h3>
                <p>Target: Permukaan metal halus, tapi pinggir tajam.</p>
                <img src="/feed/bilateral">
            </div>

            <div class="card">
                <h3>2. Canny Edges</h3>
                <p>Target: Garis pinggir nampan terlihat (walau putus).</p>
                <img src="/feed/canny">
            </div>

            <div class="card">
                <h3>3. Morph Closing</h3>
                <p>Target: Menambal garis yang putus kena silau.</p>
                <img src="/feed/closed">
            </div>

            <div class="card">
                <h3>4. Dilation (Final Mask)</h3>
                <p>Target: Kotak putih sempurna tanpa bolong.</p>
                <img src="/feed/dilated">
            </div>

            <div class="card">
                <h3>5. Live Detection</h3>
                <p>Hijau = Terdeteksi.</p>
                <img src="/feed/main">
            </div>

            <div class="card">
                <h3>6. Warped Output</h3>
                <p>Input untuk AI.</p>
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