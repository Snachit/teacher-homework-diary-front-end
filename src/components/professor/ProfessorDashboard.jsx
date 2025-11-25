import { useState } from "react"
import ProfessorSidebar from "./ProfessorSidebar"
import ProfessorWorkspace from "./ProfessorWorkspace"
import { professorAssignmentsAPI, professorLogbooksAPI } from "../../services/api"

export default function ProfessorDashboard() {
  const [activeMenu, setActiveMenu] = useState("workspace")
  const [assignments, setAssignments] = useState([])
  const [logbooks, setLogbooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock assignments data (will be replaced with real API call)
  const mockAssignments = [
    {
      id: 1,
      module_id: 1,
      module_name: "Advanced Algorithms",
      matiere_id: 1,
      matiere_name: "Data Structures",
      groupe_id: 1,
      groupe_name: "Group A",
    },
    {
      id: 2,
      module_id: 2,
      module_name: "Web Development",
      matiere_id: 2,
      matiere_name: "React Fundamentals",
      groupe_id: 2,
      groupe_name: "Group B",
    },
    {
      id: 3,
      module_id: 3,
      module_name: "Database Systems",
      matiere_id: 3,
      matiere_name: "SQL & NoSQL",
      groupe_id: 1,
      groupe_name: "Group A",
    },
    {
      id: 4,
      module_id: 4,
      module_name: "Software Engineering",
      matiere_id: 4,
      matiere_name: "Design Patterns",
      groupe_id: 3,
      groupe_name: "Group C",
    },
  ]

  // Fetch assignments on mount
  useState(() => {
    const fetchAssignments = async () => {
      try {
        setIsLoading(true)
        // TODO: Replace with real API call when backend is ready
        // const response = await professorAssignmentsAPI.list()
        // setAssignments(response.data || [])

        // For now, use mock data
        setTimeout(() => {
          setAssignments(mockAssignments)
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error("Failed to fetch assignments:", error)
        // Fallback to mock data
        setAssignments(mockAssignments)
        setIsLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  // Handle logbook submission
  const handleSubmitLogbook = async (logbookData) => {
    try {
      // TODO: Replace with real API call when backend is ready
      // await professorLogbooksAPI.create(logbookData)

      // For now, simulate submission with alert
      alert(`✅ Logbook submitted successfully!\n\nSession Details:\nDate: ${logbookData.session_date}\nType: ${logbookData.session_type}\nContent: ${logbookData.contenu_traite.substring(0, 50)}...`)

      console.log("Logbook submitted:", logbookData)
    } catch (error) {
      console.error("Failed to submit logbook:", error)
      alert("❌ Failed to submit logbook. Please try again.")
    }
  }

  // Handle logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // TODO: Clear auth token and redirect to login
      localStorage.removeItem("authToken")
      window.location.href = "/login"
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F7F4ED]">
      {/* Sidebar */}
      <ProfessorSidebar
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1">
        {activeMenu === "workspace" && (
          <ProfessorWorkspace
            assignments={assignments}
            onSubmitLogbook={handleSubmitLogbook}
          />
        )}

        {activeMenu === "history" && (
          <div className="flex-1 bg-[#F7F4ED] overflow-y-auto p-8">
            <div className="bg-white border-b border-[#242424]/10 px-8 py-6 mb-8 rounded-3xl">
              <h1 className="font-serif text-4xl font-bold text-[#242424]">
                Logbook History
              </h1>
              <p className="text-[#242424]/60 mt-1">
                View your past teaching sessions
              </p>
            </div>

            {/* Placeholder for History View */}
            <div className="flex items-center justify-center h-64 text-[#242424]/60">
              <div className="text-center">
                <p className="text-xl">History view coming soon...</p>
                <p className="text-sm mt-2">Your submitted logbooks will appear here</p>
              </div>
            </div>
          </div>
        )}

        {activeMenu === "profile" && (
          <div className="flex-1 bg-[#F7F4ED] overflow-y-auto p-8">
            <div className="bg-white border-b border-[#242424]/10 px-8 py-6 mb-8 rounded-3xl">
              <h1 className="font-serif text-4xl font-bold text-[#242424]">
                Profile
              </h1>
              <p className="text-[#242424]/60 mt-1">
                Manage your account settings
              </p>
            </div>

            {/* Placeholder for Profile View */}
            <div className="flex items-center justify-center h-64 text-[#242424]/60">
              <div className="text-center">
                <p className="text-xl">Profile settings coming soon...</p>
                <p className="text-sm mt-2">Update your information and preferences here</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
