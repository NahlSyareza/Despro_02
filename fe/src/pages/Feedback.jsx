import { useSearchParams } from "react-router-dom";
import ReviewForm from "@/components/feedback/ReviewForm";

const Feedback = () => {
  const [searchParams] = useSearchParams();
  const vendorId = searchParams.get("v");

  if (!vendorId) {
    return <div className="h-screen flex items-center justify-center text-red-500">QR Code Tidak Valid</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Review Makanan MBG</h1>
        <ReviewForm vendorId={vendorId} />
      </div>
    </div>
  );
};

export default Feedback;