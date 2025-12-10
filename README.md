
# 🥗 ML-Driven Nutrient Analysis & Online Feedback System (MBG System)

-----
## 👥 Tim Pengembang

  * **Mahasiswa Teknik Komputer UI 2022**
  * *Nicholas Samosir-2206059465*
  * *Nahl Syahreza Rahidra-2206830340*
  * *Beres Bakti Parsaoran Siagian-2206817585*
  * *Lavly Rantissa Z. R.-2206830624*
  * *Yasmin Devina Sinuraya-2206817244**
-----

> Sistem pemantauan nutrisi otomatis berbasis AI dan IoT untuk Program Makan Bergizi Gratis (MBG), terintegrasi dengan platform umpan balik siswa dan dashboard analitik vendor.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20Express-green)
![React](https://img.shields.io/badge/Frontend-React%20Vite-cyan)
![Python](https://img.shields.io/badge/AI-Python%20YOLOv8-blue)
![Docker](https://img.shields.io/badge/Deployment-Docker%20Compose-2496ED)

## 📖 Deskripsi Proyek

Sistem ini dirancang untuk mendukung **Program Makan Bergizi Gratis (MBG)** dengan menggantikan pencatatan manual menggunakan teknologi *Computer Vision* dan *Internet of Things (IoT)*. Sistem secara otomatis mendeteksi jenis makanan pada nampan siswa, menghitung total kalori/nutrisi, dan menyediakan platform bagi siswa untuk memberikan ulasan (feedback) terhadap kualitas makanan.

### Fitur Utama
* 📷 **AI Nutrient Analysis:** Deteksi otomatis 21 jenis menu MBG menggunakan **YOLOv8** (Akurasi mAP@50: 72.3%).
* 📊 **Vendor Dashboard:** Visualisasi data rating, isu makanan, dan kepatuhan nutrisi harian.
* 📅 **Smart Meal Planner:** Sistem rekomendasi menu otomatis agar tidak membosankan (aturan rotasi 2 hari).
* ⭐ **Student Feedback:** Formulir ulasan interaktif dengan validasi NIS untuk mencegah spam.
* 🔐 **Secure Access:** Otentikasi berbasis JWT untuk vendor dan admin.

---

## 🏗️ Arsitektur Sistem

Proyek ini menggunakan arsitektur **Microservices** yang dibungkus dalam kontainer Docker.

### 1. Backend Service (`be`)
Bertanggung jawab atas logika bisnis, manajemen database, dan API Gateway.
* **Framework:** Express.js (Node.js)
* **Arsitektur:** MVC (Model-View-Controller)
* **Database:** PostgreSQL (via Neon Tech)
* **Auth:** JSON Web Token (JWT)

### 2. AI Inference Service (`ai`)
Microservice Python untuk inferensi gambar menjadi data nutrisi.
* **Model:** YOLOv8n (Custom Trained)
* **Framework:** FastAPI / Ultralytics
* **Server:** Uvicorn

### 3. Frontend Client (`fe`)
Antarmuka pengguna responsif untuk Vendor (Admin) dan Siswa.
* **Framework:** React.js
* **Build Tool:** Vite
* **Styling:** Tailwind CSS + Shadcn UI
* **Charts:** Recharts

---

## 📂 Struktur Direktori

```bash
root/
├── ai/                 # Python AI Service
│   ├── models/best.pt   # Bobot Model YOLOv8
│   ├── main.py          # Server Inferensi FastAPI
│   └── Dockerfile       # Konfigurasi Container AI
│
├── be/                 # Backend Node.js
│   ├── src/
│   │   ├── controllers/ # Logika Bisnis (Analytics, Menu, Review, Tray, Vendor)
│   │   ├── middleware/  # Auth Middleware
│   │   ├── models/      # Koneksi Database & Schema
│   │   ├── routes/      # Definisi Endpoint API
│   │   └── utils/       # Logger
│   ├── uploads/         # Temp storage gambar dari IoT
│   └── Dockerfile       # Konfigurasi Container Backend
│
├── fe/                 # Frontend React Vite
│   ├── src/
│   │   ├── components/  # Reusable UI Components
│   │   ├── pages/       # Halaman (Dashboard, Login, Review, dll)
│   │   └── lib/         # Utility functions
│   └── Dockerfile       # Konfigurasi Container Frontend (Nginx/Serve)
│
└── docker-compose.yml   # Orkestrasi seluruh service

```

## 🚀 Instalasi & Menjalankan (Docker)

Cara termudah untuk menjalankan sistem ini adalah menggunakan Docker Compose. Pastikan Docker Desktop sudah terinstall.

1.  **Clone Repository:**

    ```bash
    git clone [https://github.com/username/repo-name.git](https://github.com/username/repo-name.git)
    cd repo-name
    ```

2.  **Konfigurasi Environment:**
    Buat file `.env` di dalam folder `be/` dan sesuaikan isinya:

    ```env
    PORT=6060
    DATABASE_URL=postgres://user:pass@host/dbname
    JWT_SECRET=rahasia_anda_disini
    ```

3.  **Jalankan dengan Docker Compose:**
    Perintah ini akan membuild image dan menjalankan container untuk Backend, Frontend, dan AI Service secara bersamaan.

    ```bash
    docker-compose up --build
    ```

4.  **Akses Aplikasi:**

      * **Frontend (Dashboard):** `http://localhost:5173` (atau port yang didefine di docker-compose)
      * **Backend API:** `http://localhost:6060`
      * **AI Docs (Swagger):** `http://localhost:8000/docs`

-----

## 📡 Dokumentasi API (Endpoints)

### 🍱 Menu Management

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/menu/recommendations` | Mendapatkan rekomendasi paket menu seimbang |
| `POST` | `/api/menu/save` | Menyimpan rencana menu mingguan |
| `GET` | `/api/menu/:vendor_id/week` | Mengambil jadwal menu minggu ini |

### 📸 Tray & IoT

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/api/tray/upload` | Upload foto dari Raspberry Pi & Trigger AI |
| `GET` | `/api/tray/log/:vendor_id` | Riwayat scan nutrisi |

### ⭐ Reviews

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/api/review/submit` | Kirim ulasan siswa (Butuh NIS) |
| `GET` | `/api/review/vendor/:id` | List semua ulasan vendor |

### 🔐 Vendor & Auth

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/api/vendor/login` | Login Vendor (Return JWT) |
| `GET` | `/api/vendor/:id/charts` | Data grafik analitik dashboard |

-----

## 🤖 Performa Model AI (YOLOv8)

Model dilatih menggunakan **1.091 citra** dataset custom dengan augmentasi dinamis.

  * **Epochs:** 100
  * **mAP @50%:** 72.3%
  * **Precision:** 66.8%
  * **Recall:** 70.0%

**Kelas Deteksi Terbaik:**

  * Tumis Kangkung (99.5%)
  * Nasi Putih (96.0%)
  * Capcay Bakso (93.8%)

-----
