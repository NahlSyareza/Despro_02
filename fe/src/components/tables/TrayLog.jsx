import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const logs = [ { date: "20/10/2025", trayId: "ARD42", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD41", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD40", menuId: "SU13UTX", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD39", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD38", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD47", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD37", menuId: "B-12345", calories: "950", fat: "33.0", protein: "45.0", carbs: "50.0" }, { date: "20/10/2025", trayId: "ARD36", menuId: "C-56789", calories: "980", fat: "39.0", protein: "42.0", carbs: "47.0" }, { date: "20/10/2025", trayId: "ARD35", menuId: "D-11223", calories: "1010", fat: "41.0", protein: "43.0", carbs: "46.0" }, { date: "20/10/2025", trayId: "ARD34", menuId: "E-44556", calories: "1020", fat: "42.0", protein: "44.0", carbs: "45.0" }, { date: "20/10/2025", trayId: "ARD33", menuId: "F-77889", calories: "1040", fat: "43.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD32", menuId: "G-99001", calories: "1030", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD42", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD41", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD40", menuId: "SU13UTX", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD39", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD38", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD47", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD37", menuId: "B-12345", calories: "950", fat: "33.0", protein: "45.0", carbs: "50.0" }, { date: "20/10/2025", trayId: "ARD36", menuId: "C-56789", calories: "980", fat: "39.0", protein: "42.0", carbs: "47.0" }, { date: "20/10/2025", trayId: "ARD35", menuId: "D-11223", calories: "1010", fat: "41.0", protein: "43.0", carbs: "46.0" }, { date: "20/10/2025", trayId: "ARD34", menuId: "E-44556", calories: "1020", fat: "42.0", protein: "44.0", carbs: "45.0" }, { date: "20/10/2025", trayId: "ARD33", menuId: "F-77889", calories: "1040", fat: "43.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD32", menuId: "G-99001", calories: "1030", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD42", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD41", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD40", menuId: "SU13UTX", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD39", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD38", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD47", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD37", menuId: "B-12345", calories: "950", fat: "33.0", protein: "45.0", carbs: "50.0" }, { date: "20/10/2025", trayId: "ARD36", menuId: "C-56789", calories: "980", fat: "39.0", protein: "42.0", carbs: "47.0" }, { date: "20/10/2025", trayId: "ARD35", menuId: "D-11223", calories: "1010", fat: "41.0", protein: "43.0", carbs: "46.0" }, { date: "20/10/2025", trayId: "ARD34", menuId: "E-44556", calories: "1020", fat: "42.0", protein: "44.0", carbs: "45.0" }, { date: "20/10/2025", trayId: "ARD33", menuId: "F-77889", calories: "1040", fat: "43.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD32", menuId: "G-99001", calories: "1030", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD42", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD41", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD40", menuId: "SU13UTX", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD39", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD38", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD47", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD37", menuId: "B-12345", calories: "950", fat: "33.0", protein: "45.0", carbs: "50.0" }, { date: "20/10/2025", trayId: "ARD36", menuId: "C-56789", calories: "980", fat: "39.0", protein: "42.0", carbs: "47.0" }, { date: "20/10/2025", trayId: "ARD35", menuId: "D-11223", calories: "1010", fat: "41.0", protein: "43.0", carbs: "46.0" }, { date: "20/10/2025", trayId: "ARD34", menuId: "E-44556", calories: "1020", fat: "42.0", protein: "44.0", carbs: "45.0" }, { date: "20/10/2025", trayId: "ARD33", menuId: "F-77889", calories: "1040", fat: "43.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD32", menuId: "G-99001", calories: "1030", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD42", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD41", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD40", menuId: "SU13UTX", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD39", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD38", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD47", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD37", menuId: "B-12345", calories: "950", fat: "33.0", protein: "45.0", carbs: "50.0" }, { date: "20/10/2025", trayId: "ARD36", menuId: "C-56789", calories: "980", fat: "39.0", protein: "42.0", carbs: "47.0" }, { date: "20/10/2025", trayId: "ARD35", menuId: "D-11223", calories: "1010", fat: "41.0", protein: "43.0", carbs: "46.0" }, { date: "20/10/2025", trayId: "ARD34", menuId: "E-44556", calories: "1020", fat: "42.0", protein: "44.0", carbs: "45.0" }, { date: "20/10/2025", trayId: "ARD33", menuId: "F-77889", calories: "1040", fat: "43.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD32", menuId: "G-99001", calories: "1030", fat: "44.0", protein: "44.0", carbs: "44.0" }, ]

export function TrayLog() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOption, setFilterOption] = useState("all")

  const rowsPerPage = 14

  // Apply search and filter
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.trayId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.menuId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filterOption === "all" ||
      (filterOption === "highProtein" && parseFloat(log.protein) > 40) ||
      (filterOption === "lowCalorie" && parseFloat(log.calories) < 1000)

    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, filteredLogs.length)
  const currentLogs = filteredLogs.slice(startIndex, endIndex)

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1))
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages))

  return (
    <Card className="relative h-[600px] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle
            style={{
              color: "#73707D",
              fontWeight: "1000",
              fontSize: "15px",
            }}
          >
            TRAY LOG
          </CardTitle>

          {/* Search + Filter Controls */}
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

      {/* Scrollable table */}
      <CardContent className="flex-1 overflow-y-auto overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-t">
            <tr className="border-b border-border">
              <th className="text-center py-2 font-semibold text-gray-500">Date</th>
              <th className="text-center py-2 font-semibold text-gray-500">Tray ID</th>
              <th className="text-center py-2 font-semibold text-gray-500">Menu ID</th>
              <th className="text-center py-2 font-semibold text-gray-500">Calories</th>
              <th className="text-center py-2 font-semibold text-gray-500">Fat</th>
              <th className="text-center py-2 font-semibold text-gray-500">Protein</th>
              <th className="text-center py-2 font-semibold text-gray-500">Carbohydrate</th>
              <th className="text-center py-2 font-semibold text-gray-500">Image</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((log, idx) => (
              <tr key={idx} className="border-b border-border hover:bg-muted/50">
                <td className="py-3 text-center text-gray-500">{log.date}</td>
                <td className="py-3 text-center text-gray-500">{log.trayId}</td>
                <td className="py-3 text-center text-gray-500">{log.menuId}</td>
                <td className="py-3 text-center text-gray-500">{log.calories} g</td>
                <td className="py-3 text-center text-gray-500">{log.fat} g</td>
                <td className="py-3 text-center text-gray-500">{log.protein} g</td>
                <td className="py-3 text-center text-gray-500">{log.carbs} g</td>
                <td className="py-3 text-center">
                  <a href="#" className="text-purple-500 bg-purple-100 rounded-xl px-2 py-0.5 hover:underline">
                    See Image
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>

      {/* Fixed footer */}
      <div className="absolute bottom-0 left-2 right-10 border-t border-border font-semibold bg-background py-2 px-4 flex items-center justify-between text-xs text-foreground/60">
        <span>
          Showing {startIndex + 1} to {endIndex} of {filteredLogs.length}
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handlePrev} disabled={currentPage === 1}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-gray-500 mt-2">
            {currentPage}/{totalPages}
          </span>
          <Button variant="ghost" size="sm" onClick={handleNext} disabled={currentPage === totalPages}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
