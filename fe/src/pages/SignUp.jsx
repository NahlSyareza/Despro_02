import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, IS_MOCK } from "@/util/url";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle } from "lucide-react"; // Icon error

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // --- CLIENT SIDE VALIDATION ---
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return; // Stop, jangan kirim ke server
    }

    setLoading(true);

    try {
      if (IS_MOCK) {
        alert("Mode Mock: Registrasi dianggap sukses.");
        navigate("/signin");
      } else {
        // --- REAL REGISTER ---
        await axios.post(`${API_BASE_URL}/vendor/register`, {
            username: formData.username,
            password: formData.password
        });
        
        alert("Registrasi Berhasil! Silakan Login.");
        navigate("/signin");
      }
    } catch (err) {
      console.error(err);
      // Tampilkan error spesifik dari backend jika ada
      setError(err.response?.data?.msg || "Registrasi gagal. Coba username lain.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Daftar Vendor</CardTitle>
          <CardDescription className="text-center">
            Buat akun baru untuk akses sistem MBG
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="cth: kantin_sehat"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Minimal 6 karakter"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Konfirmasi Password</label>
              <Input 
                type="password" 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Ulangi password"
              />
            </div>
            
            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Mendaftar..." : "Daftar Sekarang"}
            </Button>

            <div className="text-center text-sm text-gray-500 mt-4">
              Sudah punya akun?{" "}
              <Link to="/signin" className="text-blue-600 hover:underline font-medium">
                Masuk di sini
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}