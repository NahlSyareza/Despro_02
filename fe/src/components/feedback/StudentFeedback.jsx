import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

const feedbacks = [
    {
        id: 1,
        name: "Tray_ID 1",
        rating: 5,
        date: "25/10/2025",
        text: "Makanannya enak, bumbu ayamnya meresap tapi nasinya kebanyakan jadi lauknya habis duluan.",
    },
    {
        id: 2,
        name: "Tray_ID 2",
        rating: 5,
        date: "25/10/2025",
        text: "Makanannya enak, bumbu ayamnya meresap tapi nasinya kebanyakan jadi lauknya habis duluan. Sayurnya enak, buahnya kurang fresh. Next ikan ya wok",
    },
    {
        id: 3,
        name: "Tray_ID 3",
        rating: 3,
        date: "25/08/2025",
        text: "Lauknya sedikit",
    },
    {
        id: 4,
        name: "Tray_ID 3",
        rating: 3,
        date: "25/08/2025",
        text: "Lauknya sedikit",
    },
    {
        id: 5,
        name: "Tray_ID 3",
        rating: 3,
        date: "25/08/2025",
        text: "Lauknya sedikit",
    },
    {
        id: 6,
        name: "Tray_ID 3",
        rating: 3,
        date: "25/08/2025",
        text: "Lauknya sedikit",
    },
]

export function StudentFeedback() {
    return (
        <Card className="h-full max-h-[400px]">
            <CardHeader>
                <CardTitle style={{
                    color: "#73707D",
                    fontWeight: '1000',
                    fontSize: '15px',
                }}>STUDENT FEEDBACK</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[262px] overflow-y-auto">
                {feedbacks.map((feedback) => (
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
                ))}
            </CardContent>
        </Card>
    )
}
