import React, { useRef } from "react";
import QRCode from "react-qr-code";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function QRCodePage() {
  // 1. Ambil Vendor ID dari LocalStorage
  const vendorData = JSON.parse(localStorage.getItem("vendor_data") || "{}");
  const vendorId = vendorData.vendor_id;
  const username = vendorData.username || "Vendor";

  // 2. Buat URL Feedback Otomatis
  // window.location.origin akan menyesuaikan apakah sedang di localhost atau domain production
  const feedbackUrl = `${window.location.origin}/feedback?v=${vendorId}`;

  // Helper untuk Print
  const handlePrint = () => {
    window.print();
  };

  // Helper untuk Copy Link
  const handleCopy = () => {
    navigator.clipboard.writeText(feedbackUrl);
    toast.success("Link berhasil disalin ke clipboard!");
  };

  if (!vendorId) {
    return <div className="p-10 text-center text-red-500">Error: Anda belum login.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 flex flex-col items-center">
      
      <div className="max-w-2xl w-full space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">QR Code Feedback</h1>
            <p className="text-gray-500">
                Cetak dan tempel QR Code ini di lokasi kantin Anda agar siswa dapat memberikan review dengan mudah.
            </p>
        </div>

        {/* Card QR Code */}
        <Card className="border-gray-200 shadow-lg bg-white print:shadow-none print:border-none">
          <CardHeader className="text-center border-b border-gray-100 pb-6">
            <CardTitle className="text-xl font-extrabold text-[#7B5EEA] uppercase tracking-wide">
                {username}
            </CardTitle>
            <p className="text-sm text-gray-400 font-medium">SCAN ME TO REVIEW</p>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center pt-8 pb-8 space-y-8">
            {/* The QR Code */}
            <div className="p-4 bg-white border-4 border-gray-100 rounded-xl shadow-inner">
                <QRCode 
                    value={feedbackUrl} 
                    size={256} 
                    fgColor="#1f2937" 
                    level="H" // High Error Correction
                />
            </div>

            {/* Link Display */}
            <div className="w-full bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between gap-3 print:hidden">
                <p className="text-xs text-gray-500 font-mono truncate flex-1">{feedbackUrl}</p>
                <button onClick={handleCopy} className="text-[#7B5EEA] hover:text-[#6a4fea]">
                    <Copy size={18} />
                </button>
            </div>

            {/* Action Buttons (Hidden when printing) */}
            <div className="flex gap-4 w-full print:hidden">
                <Button 
                    onClick={handlePrint} 
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white gap-2 h-12 rounded-xl"
                >
                    <Printer size={18} />
                    Print QR Code
                </Button>
                <Button 
                    variant="outline"
                    onClick={() => window.open(feedbackUrl, "_blank")}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 gap-2 h-12 rounded-xl"
                >
                    <ExternalLink size={18} />
                    Test Link
                </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 print:hidden">
            <div className="bg-blue-100 p-2 rounded-full h-fit text-blue-600">
                <Printer size={20} />
            </div>
            <div>
                <h4 className="font-bold text-blue-800 text-sm">Tips Mencetak</h4>
                <p className="text-sm text-blue-600 mt-1">
                    Gunakan kertas putih bersih untuk hasil scan terbaik. Pastikan QR code tidak terlipat saat ditempel.
                </p>
            </div>
        </div>
      </div>

      {/* CSS untuk Print Mode: Sembunyikan elemen lain saat nge-print */}
      <style>{`
        @media print {
            body * {
                visibility: hidden;
            }
            .max-w-2xl, .max-w-2xl * {
                visibility: visible;
            }
            .max-w-2xl {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 0;
            }
            .print\\:hidden {
                display: none !important;
            }
        }
      `}</style>
    </div>
  );
}