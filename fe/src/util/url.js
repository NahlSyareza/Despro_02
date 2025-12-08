import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2001";
export const IS_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// --- HELPER: Get Image URL ---
export const getImageUrl = (path) => {
  if (!path) return "https://placehold.co/600x400?text=No+Image";
  if (path.startsWith("http")) return path; 
  return `${API_BASE_URL}${path}`; 
};

const api_url = axios.create({
  baseURL: API_BASE_URL,
});

// --- INTERCEPTOR REQUEST: Sisipkan Token ---
api_url.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- INTERCEPTOR RESPONSE (BARU): Cek Token Basi ---
api_url.interceptors.response.use(
  (response) => {
    // Jika respon sukses (200, 201), loloskan saja
    return response;
  },
  (error) => {
    // Jika respon error
    if (error.response) {
      // Cek status 401 (Unauthorized) atau 403 (Forbidden - Token Salah/Expired)
      if (error.response.status === 401 || error.response.status === 403) {
        
        // Cek apakah kita sedang tidak di halaman login (untuk mencegah loop)
        if (!window.location.pathname.includes("/signin")) {
            console.warn("[Auth] Token Expired or Invalid. Redirecting to Sign In...");
            
            // 1. Hapus Token & Data Vendor yang basi
            localStorage.removeItem("token");
            localStorage.removeItem("vendor_data");
    
            // 2. Tendang paksa ke halaman login
            // Kita pakai window.location agar halaman refresh penuh & state bersih
            window.location.href = "/signin";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api_url;