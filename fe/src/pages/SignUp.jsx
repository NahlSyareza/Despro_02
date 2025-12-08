import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, IS_MOCK } from "@/util/url";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function SignUp() {
  const navigate = useNavigate();

  // --- STATE ---
  const [formData, setFormData] = useState({ username: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State Visual (Show/Hide Password independen untuk 2 field)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- LOGIKA VALIDASI (ASLI) ---
  const validateForm = () => {
    // 1. Cek Username
    if (formData.username.trim().length < 3) {
      return "Username minimal 3 karakter.";
    }
    if (/\s/.test(formData.username)) {
      return "Username tidak boleh mengandung spasi.";
    }

    // 2. Cek Password Length
    if (formData.password.length < 6) {
      return "Password minimal 6 karakter.";
    }

    // 3. Cek Password Match
    if (formData.password !== formData.confirmPassword) {
      return "Konfirmasi password tidak cocok.";
    }

    return null; // Lolos validasi
  };

  // --- LOGIKA REGISTER (ASLI) ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Client Validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      if (IS_MOCK) {
        // Simulasi delay mock
        setTimeout(() => {
            alert("Mode Mock: Registrasi dianggap sukses.");
            navigate("/signin");
        }, 1000);
      } else {
        // API Call
        await axios.post(`${API_BASE_URL}/vendor/register`, {
            username: formData.username,
            password: formData.password
        });
        
        alert("Registrasi Berhasil! Silakan Login.");
        navigate("/signin");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Registrasi gagal. Coba username lain.");
      setLoading(false); // Matikan loading hanya jika error (jika sukses akan navigate)
    } finally {
      if (IS_MOCK) setLoading(false);
    }
  };

  // --- RENDER UI (Sesuai SignIn.jsx) ---
  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden font-sans">
      {/* Background Gradient Effect (Sama persis dengan SignIn) */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(60% 60% at 80% 20%, rgba(123,94,234,0.12) 0%, rgba(123,94,234,0.08) 30%, rgba(123,94,234,0.04) 55%, rgba(123,94,234,0) 80%)",
        }}
      />

      <div className="relative mx-auto max-w-screen-xl px-6 sm:px-8 md:px-10">
        <div className="flex min-h-screen items-center justify-center py-12">
          {/* Card Container */}
          <div className="w-full max-w-md rounded-2xl bg-white/70 backdrop-blur-sm p-6 sm:p-8 shadow-[0_4px_24px_rgba(16,24,40,0.06)] border border-gray-100">
            
            {/* Header Section */}
            <div className="mb-8 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                <span className="text-[#7B5EEA]">Daftar</span>
                <span className="ml-2 text-gray-900">Vendor</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-gray-500">
                Buat akun baru untuk mengakses data nutrisi MBG.
              </p>
            </div>

            {/* Form Section */}
            <form onSubmit={handleRegister} className="space-y-5">
              
              {/* Username Input */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Username
                </span>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                    placeholder="cth: kantin_sehat"
                    className="peer w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#7B5EEA]"
                  />
                </div>
              </label>

              {/* Password Input */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    placeholder="Minimal 6 karakter"
                    className="peer w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#7B5EEA]"
                  />
                  {/* Toggle Show/Hide */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-2 my-auto grid h-9 w-9 place-items-center rounded-full transition ${
                      showPassword ? "bg-gray-100 text-gray-600" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                    )}
                  </button>
                </div>
              </label>

              {/* Confirm Password Input */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Konfirmasi Password
                </span>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                    placeholder="Ulangi password"
                    className="peer w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#7B5EEA]"
                  />
                  {/* Toggle Show/Hide for Confirm */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute inset-y-0 right-2 my-auto grid h-9 w-9 place-items-center rounded-full transition ${
                      showConfirmPassword ? "bg-gray-100 text-gray-600" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                     {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                    )}
                  </button>
                </div>
              </label>

              {/* Error Display */}
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
                className="mt-2 w-full rounded-xl bg-[#7B5EEA] py-6 text-base font-semibold text-white shadow-sm transition hover:bg-[#6a4fea] focus:outline-none focus:ring-4 focus:ring-[#7B5EEA]/40"
              >
                {loading ? "Mendaftar..." : "Daftar Sekarang"}
              </Button>

              {/* Link ke Sign In */}
              <p className="text-center text-sm text-gray-600">
                Sudah punya akun?{" "}
                <Link
                  to="/signin"
                  className="text-[#7B5EEA] font-medium hover:underline"
                >
                  Masuk di sini
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}