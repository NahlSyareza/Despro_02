import { Navigate, Outlet } from "react-router-dom";
import { IS_MOCK } from "@/util/url";

const ProtectedRoute = () => {
  // 1. Cek apakah data vendor tersimpan di browser
  const vendorData = JSON.parse(localStorage.getItem("vendor_data"));
  
  // 2. Logic Keamanan:
  // Jika Mode REAL (MOCK=false) dan tidak ada data login -> TENDANG ke Login
  // (Opsional: Di Mode Mock pun sebaiknya tetap login agar konsisten)
  const isAuthenticated = vendorData?.vendor_id;

  if (!isAuthenticated) {
    // Redirect ke halaman login, tapi simpan url tujuan (opsional)
    return <Navigate to="/signin" replace />;
  }

  // Jika aman, izinkan masuk ke halaman anak (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;