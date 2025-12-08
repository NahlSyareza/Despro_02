import React, { useState, useEffect } from "react";
import api_url, { IS_MOCK } from "@/util/url";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, User, MessageSquareQuote, CalendarIcon, AlertCircle } from "lucide-react";

// --- KOMPONEN STAR RATING ---
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-200"
          } mr-0.5`}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-600">
        {parseFloat(rating || 0).toFixed(1)}
      </span>
    </div>
  );
};

export default function Review() {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(true);

  const vendorData = JSON.parse(localStorage.getItem("vendor_data") || "{}");
  const vendorId = vendorData.vendor_id;

  // --- HELPER: FORMAT TANGGAL ---
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (e) {
      return dateString;
    }
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        if (IS_MOCK) {
           // Mock Data disesuaikan menggunakan issue_names
           const mockData = [
             { review_id: '1', nis: '12345', rating: 4.5, message: 'Makanannya enak, tapi nasinya sedikit terlalu lembek.', date: new Date().toISOString(), issue_names: ['Nasi Lembek'] },
             { review_id: '2', nis: '67890', rating: 3.0, message: 'Ayamnya agak dingin pas disajikan.', date: new Date(Date.now() - 86400000).toISOString(), issue_names: ['Makanan Dingin'] },
             { review_id: '3', nis: '11223', rating: 5.0, message: 'Sempurna! Menu hari ini favorit saya.', date: new Date(Date.now() - 172800000).toISOString(), issue_names: [] },
             { review_id: '4', nis: '55667', rating: 2.0, message: 'Sayurnya asin banget.', date: new Date(Date.now() - 200000000).toISOString(), issue_names: ['Terlalu Asin'] },
           ];
           setReviews(mockData);
           setSelectedReview(mockData[0]);
           setLoading(false);
           return;
        }

        if (vendorId) {
            const res = await api_url.get(`/review/vendor/${vendorId}?days=30`);
            const data = res.data.payload || [];
            setReviews(data);
            
            if (data.length > 0) {
              setSelectedReview(data[0]);
            }
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [vendorId]);

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8 h-screen max-h-[800px]">
        <div className="md:col-span-5 space-y-4">
          <Skeleton className="h-8 w-1/3 mb-6" />
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </div>
        <div className="md:col-span-7">
          <Skeleton className="h-full w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Reviews</h1>
            <p className="text-gray-500 text-sm mt-1">Feedback and ratings from students regarding their meals.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-gray-200 text-xs font-medium text-gray-500 shadow-sm">
            Last 30 Days
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto h-[calc(100vh-140px)]">
        
        {/* LIST REVIEW */}
        <div className="md:col-span-5 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
             <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-2">
                <MessageSquareQuote size={16} className="text-[#7B5EEA]" />
                Inbox Review ({reviews.length})
             </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {reviews.length === 0 ? (
                <div className="text-center py-20 px-6">
                    <p className="text-gray-500 font-medium">Belum ada review masuk.</p>
                </div>
            ) : (
                reviews.map((review) => {
                  const isSelected = selectedReview?.review_id === review.review_id;
                  return (
                    <div
                      key={review.review_id}
                      onClick={() => setSelectedReview(review)}
                      className={`group p-4 rounded-xl cursor-pointer border transition-all duration-200 relative ${
                        isSelected
                          ? "bg-[#7B5EEA]/5 border-[#7B5EEA] shadow-sm"
                          : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
                      }`}
                    >
                      {isSelected && <div className="absolute left-0 top-4 bottom-4 w-1 bg-[#7B5EEA] rounded-r-full"></div>}

                      <div className="flex justify-between items-start mb-2 pl-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                isSelected ? 'bg-[#7B5EEA] text-white' : 'bg-gray-100 text-gray-500'
                            }`}>
                                {review.nis ? review.nis.slice(-2) : "??"}
                            </div>
                            <div>
                                <h4 className={`text-sm font-bold ${isSelected ? 'text-[#7B5EEA]' : 'text-gray-800'}`}>
                                    Student {review.nis}
                                </h4>
                                <span className="text-[10px] text-gray-400 font-medium">
                                    {formatDate(review.date).split(',')[0]}
                                </span>
                            </div>
                        </div>
                        <div className="bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                            <div className="flex text-yellow-400 gap-0.5">
                                <Star size={12} fill="currentColor" />
                                <span className="text-xs font-bold text-gray-700 ml-1">{review.rating}</span>
                            </div>
                        </div>
                      </div>
                      <p className={`text-xs pl-11 line-clamp-2 ${isSelected ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                        "{review.message}"
                      </p>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* DETAIL REVIEW */}
        <div className="md:col-span-7 flex flex-col h-full">
          {selectedReview ? (
            <Card className="h-full border-gray-200 shadow-md flex flex-col overflow-hidden">
              <CardHeader className="border-b border-gray-100 bg-white pb-6 pt-6 px-8">
                <div className="flex items-start justify-between">
                   <div className="flex gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7B5EEA] to-[#6a4fea] flex items-center justify-center text-white shadow-lg shadow-purple-200">
                            <User size={32} />
                        </div>
                        <div>
                            <CardTitle className="text-2xl text-gray-900 mb-1">Student {selectedReview.nis}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <CalendarIcon size={14} />
                                <span>{formatDate(selectedReview.date)}</span>
                            </div>
                        </div>
                   </div>
                   <div className="text-right">
                      <div className="inline-block bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-100 mb-2">
                          <StarRating rating={selectedReview.rating} />
                      </div>
                   </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-8 bg-gray-50/30 space-y-8">
                
                {/* --- BAGIAN INI SUDAH DIPERBAIKI --- */}
                {/* Menggunakan issue_names (Nama) alih-alih issue_id (UUID) */}
                {selectedReview.issue_names && selectedReview.issue_names.length > 0 ? (
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <AlertCircle size={14} /> Reported Issues
                        </h5>
                        <div className="flex flex-wrap gap-2">
                            {selectedReview.issue_names.map((issueName, idx) => (
                                <Badge key={idx} variant="outline" className="bg-red-50 text-red-600 border-red-200 px-3 py-1.5 text-sm font-medium">
                                    {issueName}
                                </Badge>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-3">
                        <div className="bg-green-100 p-1.5 rounded-full text-green-600"><Star size={14} fill="currentColor"/></div>
                        <p className="text-sm text-green-700 font-medium">Tidak ada isu yang dilaporkan.</p>
                    </div>
                )}

                <div>
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ml-1">Review Message</h5>
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group">
                        <MessageSquareQuote size={60} className="absolute -top-2 -left-2 text-gray-100 group-hover:text-[#7B5EEA]/10 transition-colors" />
                        <p className="text-gray-800 text-lg leading-relaxed relative z-10 font-serif italic">
                          "{selectedReview.message}"
                        </p>
                        <MessageSquareQuote size={40} className="absolute bottom-4 right-4 text-gray-100 rotate-180" />
                    </div>
                </div>

              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-10 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
                <MessageSquareQuote size={48} className="mb-4 text-gray-200" />
                <p className="text-lg font-medium text-gray-400">Select a review to see details</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #d1d5db; }
      `}</style>
    </div>
  );
}