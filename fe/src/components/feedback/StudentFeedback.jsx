import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import { IS_MOCK, API_BASE_URL } from "@/util/url"
import axios from "axios"

// IMPORT DATA MOCK
import { MOCK_STUDENT_FEEDBACKS } from "@/data/mockData"

export default function StudentFeedback() {
    const [feedbacks, setFeedbacks] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true)
            if (IS_MOCK) {
                setTimeout(() => {
                    // GUNAKAN DATA IMPORT
                    setFeedbacks(MOCK_STUDENT_FEEDBACKS)
                    setLoading(false)
                }, 500)
            } else {
                try {
                    const vendorData = JSON.parse(localStorage.getItem("vendor_data"));
                    const vendorId = vendorData?.vendor_id;
                    
                    if(!vendorId) {
                        setLoading(false); 
                        return;
                    }

                    const res = await axios.get(`${API_BASE_URL}/review/vendor/${vendorId}`)
                    
                    const mapped = (res.data.payload || []).map(r => ({
                        id: r.review_id,
                        name: r.nis ? `NIS: ${r.nis}` : "Siswa",
                        rating: parseFloat(r.rating),
                        date: new Date(r.date).toLocaleDateString("id-ID"),
                        text: r.message
                    }))
                    setFeedbacks(mapped)
                } catch (err) {
                    console.error("Gagal load reviews", err)
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchReviews()
    }, [])

    return (
        <Card className="h-full max-h-[400px]">
            <CardHeader>
                <CardTitle style={{ color: "#73707D", fontWeight: '1000', fontSize: '15px' }}>
                    STUDENT FEEDBACK {IS_MOCK && <span className="text-xs text-orange-500 font-normal ml-1">(Mock)</span>}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[262px] overflow-y-auto">
                {loading ? (
                    <p className="text-center text-sm text-gray-400">Loading feedback...</p>
                ) : feedbacks.length === 0 ? (
                    <p className="text-center text-sm text-gray-400">Belum ada feedback.</p>
                ) : (
                    feedbacks.map((feedback) => (
                        <div key={feedback.id} className="pb-4 border-b border-gray-900 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start">
                                <div className="font-medium text-sm">
                                    {feedback.name}
                                </div>
                                <div className="flex gap-1 my-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < feedback.rating
                                                ? "fill-orange-400 text-orange-400"
                                                : "fill-transparent text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="text-[8px] text-gray-400">
                                {feedback.date}
                            </div>
                            <p className="mt-3 text-[9px] text-foreground/50">{feedback.text}</p>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}