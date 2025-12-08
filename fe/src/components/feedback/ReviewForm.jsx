import { useState, useEffect } from "react";
import axios from "axios";
import { Star, AlertCircle, Check, CalendarCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/util/url";

export default function ReviewForm({ vendorId }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [nis, setNis] = useState("");
  const [message, setMessage] = useState("");
  const [selectedIssues, setSelectedIssues] = useState([]);
  
  const [availableIssues, setAvailableIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // --- LOGIKA BARU: CEK LOCAL STORAGE ---
  useEffect(() => {
    // 1. Cek apakah siswa ini sudah review hari ini di browser ini
    const today = new Date().toDateString(); // Contoh format: "Mon Dec 08 2025"
    const lastReviewDate = localStorage.getItem(`last_review_date_${vendorId}`);

    if (lastReviewDate === today) {
        setSubmitted(true); // Langsung lompat ke halaman "Terima Kasih"
    }

    // 2. Fetch Issues (Logic Lama)
    const fetchIssues = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/review/issues`);
        setAvailableIssues(res.data);
      } catch (err) {
        setAvailableIssues([
          { issue_name: "Terlalu Asin" }, { issue_name: "Hambar" },
          { issue_name: "Makanan Dingin" }, { issue_name: "Nasi Keras" },
          { issue_name: "Porsi Sedikit" }, { issue_name: "Kurang Matang" },
          { issue_name: "Basi / Bau" }, { issue_name: "Terlalu Pedas" }
        ]);
      }
    };
    fetchIssues();
  }, [vendorId]);

  const toggleIssue = (issueName) => {
    setSelectedIssues(prev => 
      prev.includes(issueName) ? prev.filter(i => i !== issueName) : [...prev, issueName]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError("Mohon berikan rating bintang"); return; }
    if (!nis) { setError("Mohon isi NIS Anda"); return; }

    setLoading(true);
    setError("");

    try {
      await axios.post(`${API_BASE_URL}/review/submit`, {
        vendor_id: vendorId,
        nis: nis,
        rating: rating,
        message: message,
        issue_types: selectedIssues
      });
      
      // --- SUKSES ---
      handleSuccess();

    } catch (err) {
      console.error(err);
      
      // Jika Backend menolak karena duplikat (Error 403), kita anggap sukses juga di frontend
      // agar siswa tidak mencoba spam tombol kirim.
      if (err.response && err.response.status === 403) {
          handleSuccess();
      } else {
          const msg = err.response?.data?.msg || "Gagal mengirim review. Coba lagi nanti.";
          setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk menyimpan status ke browser
  const handleSuccess = () => {
      setSubmitted(true);
      // Simpan "Jejak" tanggal hari ini di browser siswa
      const today = new Date().toDateString();
      localStorage.setItem(`last_review_date_${vendorId}`, today);
  };

  // --- TAMPILAN SUKSES / SUDAH ISI ---
  if (submitted) {
    return (
      <Card className="text-center p-8 border-green-200 bg-green-50 shadow-lg animate-in fade-in zoom-in duration-500">
        <CardContent className="space-y-6 pt-6 flex flex-col items-center">
          
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
            <CalendarCheck className="w-10 h-10 text-green-600" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-green-800">Review Diterima!</h3>
            <p className="text-green-700 font-medium text-sm px-4">
                Terima kasih atas masukan Anda. <br/>
                Anda telah mengisi review untuk hari ini. Silakan kembali lagi besok untuk menu selanjutnya!
            </p>
          </div>

          {/* Tombol "Kirim Review Lain" SUDAH DIHAPUS */}
          
          <div className="text-xs text-green-600/60 font-mono mt-8">
            Review ID: {new Date().getTime().toString().slice(-6)}
          </div>
        </CardContent>
      </Card>
    );
  }

  // --- FORM UTAMA (TIDAK BERUBAH BANYAK) ---
  return (
    <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center border-b border-gray-100 pb-6">
        <CardTitle className="text-xl font-black text-gray-800 tracking-tight">
            BERI NILAI MAKANAN
        </CardTitle>
        <p className="text-sm text-gray-500">Bantu kami meningkatkan kualitas makananmu</p>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Rating Bintang */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-all duration-200 hover:scale-110 active:scale-95 p-1"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-10 h-10 drop-shadow-sm ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-100 text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className={`h-6 text-sm font-bold transition-all duration-300 ${rating > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
               <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                  {rating === 1 && "😫 Sangat Buruk"}
                  {rating === 2 && "😞 Kurang Enak"}
                  {rating === 3 && "😐 Biasa Saja"}
                  {rating === 4 && "😋 Enak"}
                  {rating === 5 && "😍 Sangat Enak!"}
               </span>
            </div>
          </div>

          {/* 3. Input NIS */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">NIS</label>
            <Input 
              placeholder="Contoh: 123456" 
              value={nis}
              onChange={(e) => setNis(e.target.value)}
              className="bg-gray-50 border-gray-200 focus:bg-white transition-colors h-12"
            />
          </div>

          {/* 4. Input Pesan Tambahan */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Komentar Tambahan</label>
            <Textarea 
              placeholder="Ceritakan lebih detail..." 
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-gray-50 border-gray-200 focus:bg-white transition-colors resize-none"
            />
          </div>

          {/* 2. Tombol Pilihan Isu */}
          <div className="space-y-3">
             <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <AlertCircle size={16} />
                Ada Masalah dengan Makanan?
             </label>
             <div className="flex flex-wrap gap-2">
                {availableIssues.map((issue, idx) => {
                    const isSelected = selectedIssues.includes(issue.issue_name);
                    return (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => toggleIssue(issue.issue_name)}
                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 ${
                                isSelected 
                                ? "bg-red-50 border-red-200 text-red-600 shadow-sm scale-[1.02]" 
                                : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            {issue.issue_name}
                        </button>
                    )
                })}
             </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 flex items-center justify-center font-medium">
                {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-[#7B5EEA] hover:bg-[#6a4fea] text-white font-bold py-6 rounded-xl text-lg shadow-lg shadow-purple-100 transition-all active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? "Mengirim..." : "Kirim Masukan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}