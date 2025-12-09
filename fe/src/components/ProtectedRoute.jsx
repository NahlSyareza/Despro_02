import { Navigate, Outlet } from "react-router-dom";
import { IS_MOCK } from "@/util/url";

const ProtectedRoute = () => {
  // 1. Ambil Token dan Data Vendor dari LocalStorage
  const token = localStorage.getItem("token");
  const vendorData = localStorage.getItem("vendor_data");

  // 2. Logic Autentikasi
  let isAuthenticated = false;

  if (IS_MOCK) {
    // Mode Mock: Cukup cek apakah ada data vendor (simulasi login)
    // (Token mungkin tidak ada di mode mock, jadi kita abaikan)
    isAuthenticated = !!vendorData;
  } else {
    // Mode Real: WAJIB ada Token JWT dan Data Vendor yang valid
    isAuthenticated = !!token && !!vendorData;
  }

  // 3. Jika tidak terautentikasi, tendang ke halaman Login
  if (!isAuthenticated) {
    // Bersihkan storage untuk memastikan tidak ada data sampah
    localStorage.removeItem("token");
    localStorage.removeItem("vendor_data");
    
    // Redirect ke Sign In
    return <Navigate to="/signin" replace />;
  }

  // 4. Jika aman, izinkan akses ke halaman (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;