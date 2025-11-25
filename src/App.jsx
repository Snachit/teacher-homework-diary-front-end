import { useState } from "react"
import LandingPage from "./components/LandingPage"
import AuthPage from "./components/AuthPage"
import AdminDashboard from "./components/admin/AdminDashboard"
import ProfessorDashboard from "./components/professor/ProfessorDashboard"
import ErrorBoundary from "./components/ErrorBoundary"

function App() {
  const [currentPage, setCurrentPage] = useState("home") // "home", "auth", "admin", "professor"

  const navigateToAuth = () => {
    setCurrentPage("auth")
  }

  const navigateToHome = () => {
    setCurrentPage("home")
  }

  const handleLoginSuccess = (role) => {
    // Navigate based on role
    if (role === "admin") {
      setCurrentPage("admin")
    } else if (role === "professor") {
      setCurrentPage("professor")
    }
  }

  // Render different pages based on currentPage
  return (
    <ErrorBoundary>
      {currentPage === "auth" && (
        <AuthPage onBackToHome={navigateToHome} onLoginSuccess={handleLoginSuccess} />
      )}

      {currentPage === "admin" && <AdminDashboard onLogout={navigateToHome} />}

      {currentPage === "professor" && <ProfessorDashboard />}

      {currentPage === "home" && <LandingPage onNavigateToAuth={navigateToAuth} />}
    </ErrorBoundary>
  )
}

export default App
