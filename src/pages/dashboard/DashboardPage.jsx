import CourseList    from "../../components/dashboard/CourseList"
import PlanUpgrade   from "../../components/dashboard/PlanUpgrade"
import UsageChart    from "../../components/dashboard/UsageChart"
import CategoryManager from "../../components/dashboard/CategoryManager"

const DashboardPage = () => {
  return (
    
      
      <main className="flex-1 p-6 bg-muted/40 min-w-0 flex flex-col gap-6">
        
        <CourseList />
        <PlanUpgrade />
        <CategoryManager />
        <UsageChart />
      </main>
    
  )
}

export default DashboardPage