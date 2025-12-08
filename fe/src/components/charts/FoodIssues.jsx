import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FoodIssues({ data = [], loading }) {
  // Hitung nilai maksimum untuk skala progress bar
  const maxValue = Math.max(...data.map(d => d.value), 1) * 1.1;

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ color: "#73707D", fontWeight: "900", fontSize: "15px" }}>
          FOOD ISSUES
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-gray-400 py-10">Loading...</p>
        ) : (
          <div className="space-y-3">
            {data.length === 0 ? (
              <p className="text-center text-xs text-gray-400">No issues.</p>
            ) : (
              data.map((item, idx) => {
                // Hitung persentase panjang bar
                const percent = (item.value / maxValue) * 100;
                return (
                  <div key={idx} className="flex items-center space-x-3">
                    {/* Nama Isu */}
                    <div className="w-24 text-sm font-medium text-gray-500 truncate" title={item.name}>
                      {item.name}
                    </div>
                    {/* Progress Bar Background */}
                    <div className="flex-1 h-7 bg-gray-100 rounded-sm overflow-hidden">
                      {/* Purple Fill */}
                      <div 
                        className="h-full bg-[#7b5eea] rounded-sm transition-all duration-1000" 
                        style={{ width: `${percent}%` }} 
                      />
                    </div>
                    {/* Nilai Angka */}
                    <div className="w-10 text-xs font-medium text-gray-500 text-right">
                      {item.value}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}