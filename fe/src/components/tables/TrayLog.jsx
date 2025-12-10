import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api_url, { IS_MOCK, getImageUrl } from "@/util/url" 
// import axios from "axios"  <-- HAPUS INI
import { Badge } from "@/components/ui/badge"

// IMPORT DATA MOCK
import { MOCK_TRAY_LOGS } from "@/data/mockData"

export default function TrayLog() {
  const [logs, setLogs] = useState([]) 
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOption, setFilterOption] = useState("all")
  const [loading, setLoading] = useState(false)

  const rowsPerPage = 14

  // --- LOGIKA FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      if (IS_MOCK) {
        console.log("🛠️ TrayLog: Using Mock Data")
        setTimeout(() => {
            setLogs(MOCK_TRAY_LOGS)
            setLoading(false)
        }, 500)
      } else {
        console.log("🌍 Mengambil REAL DATA dari Database")
        try {
            const vendorData = JSON.parse(localStorage.getItem("vendor_data"));
            const vendorId = vendorData?.vendor_id;
            
            // 2. GUNAKAN api_url (Otomatis ada Token Header)
            // Hapus ${API_BASE_URL} karena sudah diset di config axios-nya
            const res = await api_url.get(`/tray/log/${vendorId}`)
            
            // Mapping data API ke format tabel UI
            const formattedData = (res.data.payload || []).map(item => ({
                date: new Date(item.date).toLocaleDateString("id-ID"),
                trayId: item.tray_id ? item.tray_id.substring(0, 8).toUpperCase() : "-",
                menuId: "AUTO", 
                calories: item.calories,
                fat: item.fat,
                protein: item.protein,
                
                // PERBAIKAN PENTING:
                // Di database namanya 'carbohydrate', di tabel UI kita pakai 'carbs'
                carbs: item.carbohydrate, 
                
                compliance_score: item.compliance_score,
                
                // Di database namanya 'image', di tabel UI kita pakai 'image_path'
                image_path: item.image 
            }))

            // --- PERBAIKAN DI SINI ---
            // Gunakan formattedData, JANGAN res.data.payload
            setLogs(formattedData) 
            
            setLoading(false)
        } catch (error) {
            console.error("Gagal fetch data:", error)
            setLoading(false)
        }
      }
    }

    fetchData()
  }, [])

  // --- FILTER & PAGINATION ---
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      (log.trayId && log.trayId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.menuId && log.menuId.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFilter =
      filterOption === "all" ||
      (filterOption === "highProtein" && parseFloat(log.protein) > 40) ||
      (filterOption === "lowCalorie" && parseFloat(log.calories) < 1000)

    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage) || 1
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, filteredLogs.length)
  const currentLogs = filteredLogs.slice(startIndex, endIndex)

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1))
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages))

  return (
    <Card className="relative h-[600px] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle style={{ color: "#73707D", fontWeight: "1000", fontSize: "15px" }}>
            TRAY LOG {IS_MOCK && <span className="text-xs text-orange-500 ml-2">(MOCK MODE)</span>}
          </CardTitle>

          <div className="flex items-center gap-3">
            <Select value={filterOption} onValueChange={setFilterOption}>
              <SelectTrigger className="w-[120px] text-gray-600 border-gray-300">
                <Filter className="w-4 h-4 mr-1" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="highProtein">High Protein (&gt;40g)</SelectItem>
                <SelectItem value="lowCalorie">Low Calorie (&lt;1000)</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative w-[180px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search"
                className="pl-8 text-sm border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-t">
            <tr className="border-b border-border">
              <th className="text-center py-2 font-semibold text-gray-500">Date</th>
              <th className="text-center py-2 font-semibold text-gray-500">Tray ID</th>
              <th className="text-center py-2 font-semibold text-gray-500">Score</th>
              <th className="text-center py-2 font-semibold text-gray-500">Calories</th>
              <th className="text-center py-2 font-semibold text-gray-500">Fat</th>
              <th className="text-center py-2 font-semibold text-gray-500">Protein</th>
              <th className="text-center py-2 font-semibold text-gray-500">Carbs</th>
              <th className="text-center py-2 font-semibold text-gray-500">Image</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan={8} className="text-center py-10">Loading data...</td></tr>
            ) : currentLogs.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10">No data available.</td></tr>
            ) : (
                currentLogs.map((log, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 text-center text-gray-500">{log.date}</td>
                    <td className="py-3 text-center text-gray-500">{log.trayId}</td>
                    <td className="py-3 text-center">
                        <Badge variant={log.compliance_score >= 80 ? "default" : "destructive"}>
                            {log.compliance_score}%
                        </Badge>
                    </td>
                    <td className="py-3 text-center text-gray-500">{log.calories}</td>
                    <td className="py-3 text-center text-gray-500">{log.fat}g</td>
                    <td className="py-3 text-center text-gray-500">{log.protein}g</td>
                    <td className="py-3 text-center text-gray-500">{log.carbs}g</td>
                    <td className="py-3 text-center">
                      {log.image_path ? (
                          <a href={getImageUrl(log.image_path)} target="_blank" rel="noreferrer" className="text-purple-500 bg-purple-100 rounded-xl px-2 py-0.5 hover:underline text-xs">
                            View
                          </a>
                      ) : (
                          <span className="text-gray-300 text-xs">No Img</span>
                      )}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </CardContent>

      <div className="absolute bottom-0 left-2 right-10 border-t border-border font-semibold bg-background py-2 px-4 flex items-center justify-between text-xs text-foreground/60">
        <span>Showing {startIndex + 1} to {endIndex} of {filteredLogs.length}</span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handlePrev} disabled={currentPage === 1}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-gray-500 mt-2">{currentPage}/{totalPages}</span>
          <Button variant="ghost" size="sm" onClick={handleNext} disabled={currentPage === totalPages}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}