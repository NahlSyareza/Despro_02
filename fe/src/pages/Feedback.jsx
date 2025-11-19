import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default function Feedback() {
  const categories = ["Taste", "Freshness", "Hygiene", "Portion", "Variety"];
  const [ratings, setRatings] = useState({
    Taste: 0,
    Freshness: 0,
    Hygiene: 0,
    Portion: 0,
    Variety: 0,
  });

  const handleRating = (category, value) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  return (
    <div className="min-h-screen flex justify-center py-6 px-4">
      <div className="w-full max-w-sm">

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold">
              Rate Our Food!
            </CardTitle>
            <p className="text-center text-gray-800 text-sm">
              Please rate your experience below
            </p>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat}>
                  <p className="font-medium text-gray-700">{cat}</p>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={17}
                        className="cursor-pointer"
                        onClick={() => handleRating(cat, i)}
                        color={"orange"}
                        fill={ratings[cat] >= i ? "orange" : "none"}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <p className="font-medium text-gray-700">Can you tell us more?</p>
              <Textarea
                placeholder="Write your feedback here..."
                className="mt-2 h-40"
              />
            </div>

            <Button className="w-full mt-6 bg-[#7b5eea] hover:bg-[#6a4fcc]">
              Submit
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
