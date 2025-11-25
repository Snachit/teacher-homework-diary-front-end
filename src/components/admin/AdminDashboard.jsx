import { useState } from "react"
import Sidebar from "./Sidebar"
import DashboardHome from "./DashboardHome"
import ProfessorsManager from "./ProfessorsManager"
import FilieresManager from "./FilieresManager"
import ModulesManager from "./ModulesManager"
import MatieresManager from "./MatieresManager"
import GroupesManager from "./GroupesManager"
import AssignmentsManager from "./AssignmentsManager"
import LogbooksManager from "./LogbooksManager"
import { authAPI } from "../../services/api"

export default function AdminDashboard({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState("overview")

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      onLogout()
    } catch (error) {
      console.error("Logout failed:", error)
      // Still logout on frontend even if API call fails
      onLogout()
    }
  }

  const handleMenuChange = (menuId) => {
    setActiveMenu(menuId)
    // TODO: Implement navigation to different sections
    console.log("Navigate to:", menuId)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F4ED]">
      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={handleMenuChange}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {activeMenu === "overview" && <DashboardHome />}
        {activeMenu === "professors" && <ProfessorsManager />}
        {activeMenu === "filieres" && <FilieresManager />}
        {activeMenu === "modules" && <ModulesManager />}
        {activeMenu === "matieres" && <MatieresManager />}
        {activeMenu === "groupes" && <GroupesManager />}
        {activeMenu === "assignments" && <AssignmentsManager />}
        {activeMenu === "logbooks" && <LogbooksManager />}

        {/* Fallback for unimplemented sections */}
        {activeMenu !== "overview" &&
         activeMenu !== "professors" &&
         activeMenu !== "filieres" &&
         activeMenu !== "modules" &&
         activeMenu !== "matieres" &&
         activeMenu !== "groupes" &&
         activeMenu !== "assignments" &&
         activeMenu !== "logbooks" && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="font-serif text-3xl font-bold text-[#242424] mb-2">
                {activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}
              </h2>
              <p className="text-[#242424]/60">
                This section is under construction
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
