import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, IS_MOCK } from "@/util/url";
import { Button } from "@/components/ui/button";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export default function SignIn() {
  const navigate = useNavigate(); // Hook untuk pindah halaman
  
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      setError("Username dan Password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      if (IS_MOCK) {
        // --- LOGIKA MOCK ---
        console.log("Mock Login Success");
        localStorage.setItem("vendor_data", JSON.stringify({ 
            vendor_id: "mock-vendor-id", 
            username: formData.username 
        }));
        // Token dummy untuk mock agar ProtectedRoute tembus
        localStorage.setItem("token", "mock-token-dummy"); 
        
        // Redirect setelah delay sedikit (efek loading)
        setTimeout(() => {
            navigate("/overview");
        }, 800);

      } else {
        // --- LOGIKA REAL API ---
        const res = await axios.post(`${API_BASE_URL}/vendor/login`, formData);
        
        // Cek apakah Backend mengirim token
        if (res.data.token) {
            // 1. Simpan Token (Wajib agar tidak ditendang ProtectedRoute)
            localStorage.setItem("token", res.data.token);
            
            // 2. Simpan Data Vendor (untuk nama/ID)
            localStorage.setItem("vendor_data", JSON.stringify(res.data));
            
            // 3. REDIRECT LANGSUNG KE DASHBOARD
            navigate("/overview", { replace: true }); 
        } else {
            throw new Error("Login berhasil tapi Token tidak diterima.");
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Login gagal. Periksa username dan password.");
    } finally {
      // Matikan loading jika bukan mock (karena mock punya timeout sendiri)
      if (!IS_MOCK) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden font-sans flex items-center justify-center">
      {/* Background Gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(60% 60% at 80% 20%, rgba(123,94,234,0.12) 0%, rgba(123,94,234,0.08) 30%, rgba(123,94,234,0.04) 55%, rgba(123,94,234,0) 80%)",
        }}
      />

      <div className="relative w-full max-w-screen-xl px-6">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white/70 backdrop-blur-sm p-8 shadow-[0_4px_24px_rgba(16,24,40,0.06)] border border-gray-100">
            
            {/* Header */}
            <div className="mb-8 text-center sm:text-left">
              <h1 className="text-3xl font-extrabold tracking-tight">
                <span className="text-[#7B5EEA]">MBG</span>
                <span className="ml-2 text-gray-900">Nutrition Data</span>
              </h1>
              <p className="mt-3 text-sm text-gray-500">
                Masukan detail akun vendor Anda untuk masuk.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Username Input */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Username</span>
                <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                    placeholder="cth: kantin_sehat"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-[#7B5EEA] transition"
                />
              </label>

              {/* Password Input */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Password</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-[#7B5EEA] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </label>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#7B5EEA] focus:ring-[#7B5EEA]"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span>Remember Me</span>
                </label>
                <button type="button" className="text-sm font-medium text-[#7B5EEA] hover:underline">
                  Forgot Password?
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-200 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-[#7B5EEA] hover:bg-[#6a4fea] py-6 text-base font-semibold text-white shadow-md transition-all active:scale-[0.98]"
              >
                {loading ? "Memproses..." : "Sign In"}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Belum punya akun?{" "}
                <Link to="/signup" className="text-[#7B5EEA] font-medium hover:underline">
                  Daftar di sini
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}