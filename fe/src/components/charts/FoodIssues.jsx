import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: "Taste", value: 350 },
  { name: "Freshness", value: 220 },
  { name: "Hygiene", value: 150 },
  { name: "Portion", value: 630 },
  { name: "Variety", value: 800 },
]

const totalValue = 800

export function FoodIssues() {
  return (
    <Card>
      <CardHeader>
        <CardTitle
          style={{
            color: "#73707D",
            fontWeight: "1000",
            fontSize: "15px",
          }}
        >
          FOOD ISSUES
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, idx) => {
            const percent = (item.value / totalValue) * 100;
            const isInside = percent >= 90;

            return (
              <div key={idx} className="flex items-center space-x-2">
                <div className="w-20 text-sm font-medium text-gray-500">
                  {item.name}
                </div>

                <div className="flex-1 relative pr-18">
                  <div className="h-7 rounded-sm overflow-hidden">
                    <div
                      className="h-7 bg-[#7b5eea] rounded-sm transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  {isInside ? (
                    <div
                      className="absolute top-1/2 -right-3 -translate-y-1/2 text-xs font-medium text-gray-500 text-right truncate"
                      style={{
                        maxWidth: "90%",
                      }}
                    >
                      {item.value} ({percent.toFixed(1)}%)
                    </div>
                  ) : (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500"
                      style={{
                        left: `calc(${percent}%)`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.value} ({percent.toFixed(1)}%)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>



    </Card>
  )
}
