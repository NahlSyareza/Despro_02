import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, IS_MOCK } from "@/util/url";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // --- CLIENT VALIDATION ---
    if (!formData.username || !formData.password) {
      setError("Username dan Password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      if (IS_MOCK) {
        console.log("Mock Login Success");
        localStorage.setItem("vendor_data", JSON.stringify({ 
            vendor_id: "mock-vendor-id", 
            username: formData.username 
        }));
        navigate("/overview");
      } else {
        const res = await axios.post(`${API_BASE_URL}/vendor/login`, formData);
        
        if (res.data.vendor_id) {
            localStorage.setItem("vendor_data", JSON.stringify(res.data));
            navigate("/overview");
        } else {
            throw new Error("Invalid response");
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Login gagal. Periksa username dan password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Masuk Vendor</CardTitle>
          <CardDescription className="text-center">
            Selamat datang kembali di Dashboard MBG
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input 
                id="username" 
                placeholder="Masukkan username" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Password</label>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>

            <div className="text-center text-sm text-gray-500 mt-4">
              Belum punya akun?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                Daftar sekarang
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}