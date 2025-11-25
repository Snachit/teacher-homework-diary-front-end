import { useState, useEffect } from "react"
import {
  Users,
  UsersRound,
  BookOpen,
  CheckCircle,
  Clock,
  Flag,
  Plus
} from "lucide-react"
import {
  adminProfessorsAPI,
  adminGroupesAPI,
  adminModulesAPI,
  adminLogbooksAPI
} from "../../services/api"

// Mock data matching Swagger response structure
const mockLogbooks = [
  {
    id: 1,
    user: { id: 1, name: "Dr. Sarah Connor", email: "sarah@example.com" },
    module: { id: 10, name: "Advanced Algorithms", filiere_id: 1 },
    groupe: { id: 3, name: "Groupe A", filiere_id: 1 },
    session_date: "2025-11-24",
    session_type: "cours",
    contenu_traite: "Introduction to Graph Theory and BFS traversal. We covered the fundamental concepts of graphs, including vertices, edges, directed and undirected graphs. Students implemented BFS algorithm using queue data structure and analyzed time complexity.",
    remarques: "Student participation was low today.",
    status: "pending",
    submitted_at: "2 hours ago"
  },
  {
    id: 2,
    user: { id: 2, name: "Prof. John Smith", email: "john@example.com" },
    module: { id: 12, name: "Database Systems", filiere_id: 1 },
    groupe: { id: 5, name: "Groupe B", filiere_id: 2 },
    session_date: "2025-11-24",
    session_type: "TP",
    contenu_traite: "Practical session on SQL queries. Students practiced JOIN operations, subqueries, and aggregate functions. Each student completed 10 exercises on complex queries involving multiple tables.",
    remarques: "Excellent participation. Most students completed all exercises.",
    status: "validated",
    submitted_at: "3 hours ago"
  },
  {
    id: 3,
    user: { id: 3, name: "Dr. Emily Watson", email: "emily@example.com" },
    module: { id: 15, name: "Machine Learning", filiere_id: 2 },
    groupe: { id: 2, name: "Groupe C", filiere_id: 1 },
    session_date: "2025-11-23",
    session_type: "cours",
    contenu_traite: "Introduction to Neural Networks. Covered perceptrons, activation functions, and backpropagation algorithm. Discussed the mathematics behind gradient descent and optimization techniques.",
    remarques: null,
    status: "validated",
    submitted_at: "5 hours ago"
  },
  {
    id: 4,
    user: { id: 4, name: "Prof. Michael Chen", email: "michael@example.com" },
    module: { id: 8, name: "Web Development", filiere_id: 3 },
    groupe: { id: 1, name: "Groupe A", filiere_id: 3 },
    session_date: "2025-11-23",
    session_type: "TP",
    contenu_traite: "React Hooks and State Management. Built a complete todo application demonstrating useState, useEffect, and useContext hooks. Students learned about component lifecycle and side effects.",
    remarques: "Students are excited about React. Good progress overall.",
    status: "pending",
    submitted_at: "1 day ago"
  },
  {
    id: 5,
    user: { id: 5, name: "Dr. Lisa Anderson", email: "lisa@example.com" },
    module: { id: 18, name: "Operating Systems", filiere_id: 2 },
    groupe: { id: 6, name: "Groupe B", filiere_id: 2 },
    session_date: "2025-11-22",
    session_type: "cours",
    contenu_traite: "Process scheduling algorithms. Discussed FCFS, SJF, Round Robin, and Priority scheduling. Analyzed advantages and disadvantages of each approach with real-world examples.",
    remarques: null,
    status: "validated",
    submitted_at: "2 days ago"
  }
]

export default function DashboardHome() {
  const [selectedLogbook, setSelectedLogbook] = useState(null)
  const [logbooks, setLogbooks] = useState([])
  const [stats, setStats] = useState({
    totalProfessors: 0,
    activeGroups: 0,
    modulesAssigned: 0,
    logbooksToday: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Fetch real data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch all data in parallel
        const [professorsRes, groupesRes, modulesRes, logbooksRes] = await Promise.all([
          adminProfessorsAPI.list(),
          adminGroupesAPI.list(),
          adminModulesAPI.list(),
          adminLogbooksAPI.list()
        ])

        // Update stats
        setStats({
          totalProfessors: professorsRes.data?.length || professorsRes.meta?.total || 0,
          activeGroups: groupesRes.data?.length || groupesRes.meta?.total || 0,
          modulesAssigned: modulesRes.data?.length || modulesRes.meta?.total || 0,
          logbooksToday: logbooksRes.data?.filter(log => {
            const today = new Date().toISOString().split('T')[0]
            return log.session_date === today
          }).length || 0
        })

        // Set logbooks
        const logbookData = logbooksRes.data || []
        setLogbooks(logbookData)
        if (logbookData.length > 0) {
          setSelectedLogbook(logbookData[0])
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        // Use mock data as fallback
        setLogbooks(mockLogbooks)
        setSelectedLogbook(mockLogbooks[0])
        setStats({
          totalProfessors: 24,
          activeGroups: 12,
          modulesAssigned: 85,
          logbooksToday: 8
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleValidate = async (logbookId) => {
    try {
      await adminLogbooksAPI.validate(logbookId)
      // Refresh the logbooks data after validation
      const logbooksRes = await adminLogbooksAPI.list()
      const logbookData = logbooksRes.data || []
      setLogbooks(logbookData)

      // Update selected logbook if it was the one validated
      if (selectedLogbook?.id === logbookId) {
        const updatedLogbook = logbookData.find(l => l.id === logbookId)
        if (updatedLogbook) {
          setSelectedLogbook(updatedLogbook)
        }
      }
    } catch (error) {
      console.error("Failed to validate logbook:", error)
      alert("Failed to validate logbook. Please try again.")
    }
  }

  const handleFlag = async (logbookId) => {
    const reason = window.prompt("Please enter a reason for flagging this logbook:")
    if (!reason) return

    try {
      await adminLogbooksAPI.flag(logbookId, { reason })
      alert("Logbook flagged successfully.")
    } catch (error) {
      console.error("Failed to flag logbook:", error)
      alert("Failed to flag logbook. Please try again.")
    }
  }

  const StatCard = ({ icon: Icon, label, value, action, colorClass }) => (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-[#242424]/5 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colorClass}`}>
          <Icon size={24} className="text-white" />
        </div>
        {action && (
          <button className="text-[#1A8917] hover:text-[#1A8917]/80 text-sm font-semibold flex items-center gap-1">
            <Plus size={16} />
            {action}
          </button>
        )}
      </div>
      <div className="font-serif text-5xl font-bold text-[#242424] mb-1">
        {value}
      </div>
      <div className="text-[#242424]/60 text-sm font-semibold">{label}</div>
    </div>
  )

  const LogbookListItem = ({ logbook, isActive }) => {
    const getInitials = (name) => {
      if (!name) return "?"
      return name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
    }

    return (
      <button
        onClick={() => setSelectedLogbook(logbook)}
        className={`w-full text-left p-4 rounded-2xl transition-all border-2 ${
          isActive
            ? "bg-white border-[#1A8917] shadow-md"
            : "bg-[#F7F4ED] border-transparent hover:bg-white hover:border-[#1A8917]/30"
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#1A8917] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {getInitials(logbook.user?.name)}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-[#242424] text-sm truncate">
                {logbook.user?.name || "Unknown"}
              </h4>
              {/* Status Indicator */}
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  logbook.status === "validated" ? "bg-green-500" : "bg-orange-500"
                }`}
              />
            </div>
            <p className="text-[#242424]/70 text-xs font-medium truncate">
              {logbook.module?.name || "Unknown"}
            </p>
            <p className="text-[#242424]/50 text-xs mt-1">{logbook.submitted_at || "Recently"}</p>
          </div>
        </div>
      </button>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return (
    <div className="flex-1 bg-[#F7F4ED] overflow-y-auto h-screen">
      {/* Header */}
      <div className="bg-white border-b border-[#242424]/10 px-8 py-6 sticky top-0 z-10">
        <h1 className="font-serif text-4xl font-bold text-[#242424]">
          Dashboard Overview
        </h1>
        <p className="text-[#242424]/60 mt-1">
          Real-time monitoring and management
        </p>
      </div>

      <div className="p-8 space-y-8">
        {/* Stats Row - Bento Grid */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            label="Total Professors"
            value={stats.totalProfessors}
            action="Add New"
            colorClass="bg-[#1A8917]"
          />
          <StatCard
            icon={UsersRound}
            label="Active Groups"
            value={stats.activeGroups}
            colorClass="bg-[#D4A373]"
          />
          <StatCard
            icon={BookOpen}
            label="Modules Assigned"
            value={`${stats.modulesAssigned}%`}
            colorClass="bg-[#1A8917]"
          />
          <StatCard
            icon={CheckCircle}
            label="Logbooks Today"
            value={stats.logbooksToday}
            colorClass="bg-[#D4A373]"
          />
        </div>

        {/* Live Monitor - Split View */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="border-b border-[#242424]/10 px-6 py-4">
            <h2 className="font-serif text-2xl font-bold text-[#242424]">
              Live Session Monitor
            </h2>
            <p className="text-[#242424]/60 text-sm mt-1">
              Review and validate recent teaching sessions
            </p>
          </div>

          <div className="grid grid-cols-12">
            {/* Left Column - Incoming Feed (Span 4) */}
            <div className="col-span-4 border-r border-[#242424]/10 p-6 space-y-3 h-[600px] overflow-y-auto bg-[#F7F4ED]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#242424]">Incoming Feed</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-[#242424]/60">Validated</span>
                  <div className="w-2 h-2 rounded-full bg-orange-500 ml-2" />
                  <span className="text-xs text-[#242424]/60">Pending</span>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="text-[#242424]/60">Loading...</div>
                </div>
              ) : logbooks.length === 0 ? (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="text-[#242424]/60">No logbooks found</div>
                </div>
              ) : (
                logbooks.map((logbook) => (
                  <LogbookListItem
                    key={logbook.id}
                    logbook={logbook}
                    isActive={selectedLogbook?.id === logbook.id}
                  />
                ))
              )}
            </div>

            {/* Right Column - Quick Review Panel (Span 8) */}
            <div className="col-span-8 p-8">
              {selectedLogbook && (
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                          selectedLogbook.session_type === "cours"
                            ? "bg-[#1A8917]/10 text-[#1A8917]"
                            : "bg-[#D4A373]/10 text-[#D4A373]"
                        }`}
                      >
                        {selectedLogbook.session_type === "cours" ? "Cours" : "TP"}
                      </span>
                      <span className="text-[#242424]/60 text-sm">
                        {formatDate(selectedLogbook.session_date)}
                      </span>
                    </div>

                    <h2 className="font-serif text-3xl font-bold text-[#242424] mb-3">
                      Session: {selectedLogbook.module?.name || "Unknown"}
                    </h2>

                    <div className="flex items-center gap-6 text-[#242424]/70 text-sm">
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span className="font-semibold">{selectedLogbook.user?.name || "Unknown"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UsersRound size={16} />
                        <span className="font-semibold">{selectedLogbook.groupe?.name || "Unknown"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{selectedLogbook.submitted_at || "Recently"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto mb-6">
                    <div className="bg-[#F7F4ED] rounded-2xl p-6 mb-6">
                      <h3 className="font-serif text-lg font-bold text-[#242424] mb-3">
                        Session Content
                      </h3>
                      <p className="text-[#242424]/80 leading-relaxed">
                        {selectedLogbook.contenu_traite || "No content provided"}
                      </p>
                    </div>

                    {selectedLogbook.remarques && (
                      <div className="bg-[#D4A373]/5 border-l-4 border-[#D4A373] rounded-r-2xl p-6">
                        <h3 className="font-serif text-lg font-bold text-[#242424] mb-2">
                          Remarks
                        </h3>
                        <p className="text-[#242424]/70 leading-relaxed">
                          {selectedLogbook.remarques}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#242424]/10">
                    <button
                      onClick={() => handleFlag(selectedLogbook.id)}
                      className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
                    >
                      <Flag size={18} />
                      Flag Issue
                    </button>
                    <button
                      onClick={() => handleValidate(selectedLogbook.id)}
                      className="flex items-center gap-2 px-6 py-3 bg-[#1A8917] text-white rounded-xl font-semibold hover:bg-[#1A8917]/90 transition-colors shadow-lg shadow-[#1A8917]/20"
                    >
                      <CheckCircle size={18} />
                      Validate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
