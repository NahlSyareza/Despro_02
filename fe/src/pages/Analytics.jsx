import { OverallRating } from "@/components/charts/OverallRating"
import { NutritionQuality } from "@/components/charts/NutritionQuality"
import { StudentFeedback } from "@/components/feedback/StudentFeedback"
import { TrayLog } from "@/components/tables/TrayLog"
import { FoodIssues } from "@/components/charts/FoodIssues"

export default function Analytics() {
  return (
    <div className="min-h-screen ">
      <main className="max-w-8xl mx-auto ">
        <div className="mb-8">
          <select className="px-4 py-2 border border-gray-400 rounded-sm text-foreground bg-background text-sm">
            <option >Last 7 Days</option>
            <option>Last 14 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <OverallRating />
          <NutritionQuality />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

  <div className="flex flex-col gap-6">
    <StudentFeedback />
    <FoodIssues />
  </div>

  <div className="lg:col-span-2">
    <TrayLog />
  </div>

</div>


        
      </main>
    </div>
  )
}
