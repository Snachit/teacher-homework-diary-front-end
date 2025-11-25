import { useState, useEffect } from "react"
import {
  FileText,
  Search,
  X,
  CheckCircle,
  Flag,
  Clock,
  Users,
  BookOpen,
  UsersRound,
  Filter
} from "lucide-react"
import { adminLogbooksAPI } from "../../services/api"

export default function LogbooksManager() {
  const [logbooks, setLogbooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // "all", "pending", "validated"
  const [selectedLogbook, setSelectedLogbook] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [error, setError] = useState(null)

  // Fetch logbooks
  useEffect(() => {
    fetchLogbooks()
  }, [])

  const fetchLogbooks = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await adminLogbooksAPI.list()
      setLogbooks(response.data || [])
    } catch (err) {
      console.error("Failed to fetch logbooks:", err)
      setError("Failed to load logbooks. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleValidate = async (logbookId) => {
    try {
      await adminLogbooksAPI.validate(logbookId)
      await fetchLogbooks()
      if (selectedLogbook?.id === logbookId) {
        const updated = logbooks.find(l => l.id === logbookId)
        if (updated) {
          setSelectedLogbook({ ...updated, status: "validated" })
        }
      }
    } catch (err) {
      console.error("Failed to validate logbook:", err)
      alert("Failed to validate logbook. Please try again.")
    }
  }

  const handleFlag = async (logbookId) => {
    const reason = window.prompt("Please enter a reason for flagging this logbook:")
    if (!reason) return

    try {
      await adminLogbooksAPI.flag(logbookId, { reason })
      await fetchLogbooks()
      alert("Logbook flagged successfully.")
    } catch (err) {
      console.error("Failed to flag logbook:", err)
      alert("Failed to flag logbook. Please try again.")
    }
  }

  const handleViewDetails = (logbook) => {
    setSelectedLogbook(logbook)
    setShowDetailModal(true)
  }

  const filteredLogbooks = logbooks.filter(logbook => {
    const matchesSearch =
      logbook.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      logbook.module?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      logbook.groupe?.name?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || logbook.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const formatFullDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "validated":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "validated":
        return <CheckCircle size={16} />
      case "pending":
        return <Clock size={16} />
      default:
        return <Flag size={16} />
    }
  }

  // Count by status
  const statusCounts = {
    all: logbooks.length,
    pending: logbooks.filter(l => l.status === "pending").length,
    validated: logbooks.filter(l => l.status === "validated").length
  }

  return (
    <div className="flex-1 bg-[#F7F4ED] overflow-y-auto h-screen">
      {/* Header */}
      <div className="bg-white border-b border-[#242424]/10 px-8 py-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold text-[#242424]">
              Logbooks
            </h1>
            <p className="text-[#242424]/60 mt-1">
              Review and manage teaching session logbooks
            </p>
          </div>

          {/* Status Badges */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm text-[#242424]/70">
                {statusCounts.pending} Pending
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-[#242424]/70">
                {statusCounts.validated} Validated
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Filters Row */}
        <div className="flex items-center gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1 bg-white rounded-2xl p-4 shadow-lg border border-[#242424]/5">
            <div className="flex items-center gap-3">
              <Search size={20} className="text-[#242424]/40" />
              <input
                type="text"
                placeholder="Search by professor, module, or group..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[#242424] placeholder:text-[#242424]/40"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-[#242424]/5">
            <div className="flex items-center gap-3">
              <Filter size={20} className="text-[#242424]/40" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent outline-none text-[#242424] font-semibold"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="validated">Validated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-red-600">
            {error}
          </div>
        )}

        {/* Logbooks Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-[#242424]/60">Loading logbooks...</div>
          </div>
        ) : filteredLogbooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-[#242424]/60">
            <FileText size={48} className="mb-4" />
            <p>No logbooks found</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-[#242424]/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F7F4ED] border-b border-[#242424]/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#242424]">
                      Professor
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#242424]">
                      Module / Matière
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#242424]">
                      Group
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#242424]">
                      Session Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#242424]">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#242424]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#242424]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#242424]/5">
                  {filteredLogbooks.map((logbook) => (
                    <tr
                      key={logbook.id}
                      className="hover:bg-[#F7F4ED]/50 transition-colors cursor-pointer"
                      onClick={() => handleViewDetails(logbook)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#1A8917] flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {logbook.user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?"}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-[#242424]">
                              {logbook.user?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-[#242424]/60">
                              {logbook.submitted_at || "Recently"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-[#242424]">
                            {logbook.module?.name || "Unknown"}
                          </p>
                          {logbook.matiere?.name && (
                            <p className="text-sm text-[#242424]/60">
                              {logbook.matiere.name}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#242424]/70">
                          {logbook.groupe?.name || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#242424]/70">
                          {formatDate(logbook.session_date)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            logbook.session_type === "cours"
                              ? "bg-[#1A8917]/10 text-[#1A8917]"
                              : "bg-[#D4A373]/10 text-[#D4A373]"
                          }`}
                        >
                          {logbook.session_type === "cours" ? "Cours" : "TP"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${getStatusColor(
                            logbook.status
                          )}`}
                        >
                          {getStatusIcon(logbook.status)}
                          {logbook.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {logbook.status === "pending" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleValidate(logbook.id)
                              }}
                              className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors"
                            >
                              Validate
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleFlag(logbook.id)
                            }}
                            className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
                          >
                            Flag
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedLogbook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-[#242424]">
                Logbook Details
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-[#242424]/40 hover:text-[#242424] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex items-center gap-3 pb-6 border-b border-[#242424]/10">
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
                  {formatFullDate(selectedLogbook.session_date)}
                </span>
                <span
                  className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(
                    selectedLogbook.status
                  )}`}
                >
                  {getStatusIcon(selectedLogbook.status)}
                  {selectedLogbook.status}
                </span>
              </div>

              {/* Session Info */}
              <div>
                <h3 className="font-serif text-xl font-bold text-[#242424] mb-4">
                  Session: {selectedLogbook.module?.name || "Unknown"}
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-[#242424]/70">
                    <Users size={16} />
                    <span>{selectedLogbook.user?.name || "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#242424]/70">
                    <UsersRound size={16} />
                    <span>{selectedLogbook.groupe?.name || "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#242424]/70">
                    <Clock size={16} />
                    <span>{selectedLogbook.submitted_at || "Recently"}</span>
                  </div>
                </div>
              </div>

              {/* Session Content */}
              <div className="bg-[#F7F4ED] rounded-2xl p-6">
                <h4 className="font-serif text-lg font-bold text-[#242424] mb-3">
                  Session Content
                </h4>
                <p className="text-[#242424]/80 leading-relaxed">
                  {selectedLogbook.contenu_traite || "No content provided"}
                </p>
              </div>

              {/* Remarks */}
              {selectedLogbook.remarques && (
                <div className="bg-[#D4A373]/5 border-l-4 border-[#D4A373] rounded-r-2xl p-6">
                  <h4 className="font-serif text-lg font-bold text-[#242424] mb-2">
                    Remarks
                  </h4>
                  <p className="text-[#242424]/70 leading-relaxed">
                    {selectedLogbook.remarques}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#242424]/10">
                <button
                  onClick={() => handleFlag(selectedLogbook.id)}
                  className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
                >
                  <Flag size={18} />
                  Flag Issue
                </button>
                {selectedLogbook.status === "pending" && (
                  <button
                    onClick={() => {
                      handleValidate(selectedLogbook.id)
                      setShowDetailModal(false)
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1A8917] text-white rounded-xl font-semibold hover:bg-[#1A8917]/90 transition-colors shadow-lg shadow-[#1A8917]/20"
                  >
                    <CheckCircle size={18} />
                    Validate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
