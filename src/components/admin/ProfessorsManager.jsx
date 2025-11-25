import { useState, useEffect } from "react"
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Mail,
  Calendar
} from "lucide-react"
import { adminProfessorsAPI } from "../../services/api"

export default function ProfessorsManager() {
  const [professors, setProfessors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("create") // "create" or "edit"
  const [selectedProfessor, setSelectedProfessor] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "professeur"
  })
  const [error, setError] = useState(null)

  // Fetch professors
  useEffect(() => {
    fetchProfessors()
  }, [])

  const fetchProfessors = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await adminProfessorsAPI.list()
      setProfessors(response.data || [])
    } catch (err) {
      console.error("Failed to fetch professors:", err)
      setError("Failed to load professors. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setModalMode("create")
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "professeur"
    })
    setShowModal(true)
  }

  const handleEdit = (professor) => {
    setModalMode("edit")
    setSelectedProfessor(professor)
    setFormData({
      name: professor.name || "",
      email: professor.email || "",
      password: "", // Empty password means no change
      role: professor.role || "professeur"
    })
    setShowModal(true)
  }

  const handleDelete = async (professorId) => {
    if (!window.confirm("Are you sure you want to delete this professor?")) {
      return
    }

    try {
      await adminProfessorsAPI.delete(professorId)
      await fetchProfessors()
    } catch (err) {
      console.error("Failed to delete professor:", err)
      alert("Failed to delete professor. Please try again.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.")
      return
    }

    // Validate name is not empty
    if (!formData.name || formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters long.")
      return
    }

    // Validate password for new professors
    if (modalMode === "create" && (!formData.password || formData.password.length < 8)) {
      setError("Password must be at least 8 characters long.")
      return
    }

    // For updates, validate password only if provided
    if (modalMode === "edit" && formData.password && formData.password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    try {
      // Prepare data - remove empty password for updates
      const dataToSend = { ...formData }
      if (modalMode === "edit" && !dataToSend.password) {
        delete dataToSend.password
      }

      if (modalMode === "create") {
        await adminProfessorsAPI.create(dataToSend)
      } else {
        await adminProfessorsAPI.update(selectedProfessor.id, dataToSend)
      }

      setShowModal(false)
      await fetchProfessors()
    } catch (err) {
      console.error("Failed to save professor:", err)
      setError("Failed to save professor. Please check your input and try again.")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const filteredProfessors = professors.filter(prof =>
    prof.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prof.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 bg-[#F7F4ED] overflow-y-auto h-screen">
      {/* Header */}
      <div className="bg-white border-b border-[#242424]/10 px-8 py-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold text-[#242424]">
              Professors
            </h1>
            <p className="text-[#242424]/60 mt-1">
              Manage professor accounts and information
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-[#1A8917] text-white rounded-xl font-semibold hover:bg-[#1A8917]/90 transition-colors shadow-lg shadow-[#1A8917]/20"
          >
            <Plus size={20} />
            Add Professor
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg border border-[#242424]/5">
          <div className="flex items-center gap-3">
            <Search size={20} className="text-[#242424]/40" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[#242424] placeholder:text-[#242424]/40"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-red-600">
            {error}
          </div>
        )}

        {/* Professors List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-[#242424]/60">Loading professors...</div>
          </div>
        ) : filteredProfessors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-[#242424]/60">
            <Users size={48} className="mb-4" />
            <p>No professors found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessors.map((professor) => (
              <div
                key={professor.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-[#242424]/5 hover:shadow-xl transition-shadow"
              >
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-[#1A8917] flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">
                    {professor.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?"}
                  </span>
                </div>

                {/* Info */}
                <h3 className="font-serif text-xl font-bold text-[#242424] mb-3">
                  {professor.name || "Unknown"}
                </h3>

                <div className="space-y-2 mb-4">
                  {professor.email && (
                    <div className="flex items-center gap-2 text-[#242424]/70 text-sm">
                      <Mail size={16} />
                      <span className="truncate">{professor.email}</span>
                    </div>
                  )}
                  {professor.role && (
                    <div className="flex items-center gap-2 text-[#242424]/70 text-sm">
                      <Users size={16} />
                      <span className="px-2 py-1 bg-[#1A8917]/10 text-[#1A8917] rounded-md text-xs font-semibold">
                        {professor.role}
                      </span>
                    </div>
                  )}
                  {professor.created_at && (
                    <div className="flex items-center gap-2 text-[#242424]/50 text-xs">
                      <Calendar size={14} />
                      <span>
                        Joined {new Date(professor.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-[#242424]/10">
                  <button
                    onClick={() => handleEdit(professor)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1A8917]/10 text-[#1A8917] rounded-lg font-semibold hover:bg-[#1A8917]/20 transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(professor.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-[#242424]">
                {modalMode === "create" ? "Add New Professor" : "Edit Professor"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#242424]/40 hover:text-[#242424] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#242424] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#F7F4ED] border border-[#242424]/10 rounded-xl outline-none focus:border-[#1A8917] transition-colors"
                  placeholder="Dr. John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#242424] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#F7F4ED] border border-[#242424]/10 rounded-xl outline-none focus:border-[#1A8917] transition-colors"
                  placeholder="john.smith@university.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#242424] mb-2">
                  Password {modalMode === "create" ? "*" : "(leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={modalMode === "create"}
                  minLength={8}
                  className="w-full px-4 py-3 bg-[#F7F4ED] border border-[#242424]/10 rounded-xl outline-none focus:border-[#1A8917] transition-colors"
                  placeholder={modalMode === "create" ? "Minimum 8 characters" : "Leave blank to keep current password"}
                />
                <p className="text-xs text-[#242424]/50 mt-1">
                  {modalMode === "create"
                    ? "Minimum 8 characters required"
                    : "Only fill this if you want to change the password"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#242424] mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#F7F4ED] border border-[#242424]/10 rounded-xl outline-none focus:border-[#1A8917] transition-colors"
                >
                  <option value="professeur">Professor</option>
                  <option value="admin">Admin</option>
                </select>
                <p className="text-xs text-[#242424]/50 mt-1">
                  Select the user's role in the system
                </p>
              </div>

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-[#242424]/5 text-[#242424] rounded-xl font-semibold hover:bg-[#242424]/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#1A8917] text-white rounded-xl font-semibold hover:bg-[#1A8917]/90 transition-colors shadow-lg shadow-[#1A8917]/20"
                >
                  {modalMode === "create" ? "Create" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
