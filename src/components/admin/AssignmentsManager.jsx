import { useState, useEffect } from "react"
import {
  Link as LinkIcon,
  Plus,
  Trash2,
  Search,
  X,
  Users,
  BookOpen,
  Layers
} from "lucide-react"
import {
  adminAssignmentsAPI,
  adminProfessorsAPI,
  adminModulesAPI,
  adminMatieresAPI,
  adminGroupesAPI
} from "../../services/api"

export default function AssignmentsManager() {
  const [assignments, setAssignments] = useState([])
  const [professors, setProfessors] = useState([])
  const [modules, setModules] = useState([])
  const [matieres, setMatieres] = useState([])
  const [groupes, setGroupes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    user_id: "",
    module_id: "",
    matiere_id: "",
    groupe_id: ""
  })
  const [error, setError] = useState(null)

  // Fetch all data
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [assignmentsRes, professorsRes, modulesRes, matieresRes, groupesRes] = await Promise.all([
        adminAssignmentsAPI.list(),
        adminProfessorsAPI.list(),
        adminModulesAPI.list(),
        adminMatieresAPI.list(),
        adminGroupesAPI.list()
      ])
      setAssignments(assignmentsRes.data || [])
      setProfessors(professorsRes.data || [])
      setModules(modulesRes.data || [])
      setMatieres(matieresRes.data || [])
      setGroupes(groupesRes.data || [])
    } catch (err) {
      console.error("Failed to fetch data:", err)
      setError("Failed to load assignments. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setFormData({
      user_id: "",
      module_id: "",
      matiere_id: "",
      groupe_id: ""
    })
    setShowModal(true)
  }

  const handleDelete = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) {
      return
    }

    try {
      await adminAssignmentsAPI.delete(assignmentId)
      await fetchData()
    } catch (err) {
      console.error("Failed to delete assignment:", err)
      alert("Failed to delete assignment. Please try again.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validate all required fields are selected
    if (!formData.user_id) {
      setError("Please select a professor.")
      return
    }

    if (!formData.module_id) {
      setError("Please select a module.")
      return
    }

    if (!formData.matiere_id) {
      setError("Please select a matière.")
      return
    }

    if (!formData.groupe_id) {
      setError("Please select a group.")
      return
    }

    // Validate that matière belongs to selected module
    const selectedMatiere = matieres.find(m => m.id === parseInt(formData.matiere_id))
    if (selectedMatiere && selectedMatiere.module_id !== parseInt(formData.module_id)) {
      setError("Selected matière does not belong to the selected module.")
      return
    }

    try {
      await adminAssignmentsAPI.create(formData)
      setShowModal(false)
      await fetchData()
    } catch (err) {
      console.error("Failed to create assignment:", err)
      setError("Failed to create assignment. Please check your input and try again.")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Helper functions - defined before use
  const getProfessorName = (userId) => {
    const professor = professors.find(p => p.id === userId)
    return professor?.name || "Unknown"
  }

  const getModuleName = (moduleId) => {
    const module = modules.find(m => m.id === moduleId)
    return module?.name || "Unknown"
  }

  const getMatiereName = (matiereId) => {
    const matiere = matieres.find(m => m.id === matiereId)
    return matiere?.name || "Unknown"
  }

  const getGroupeName = (groupeId) => {
    const groupe = groupes.find(g => g.id === groupeId)
    return groupe?.name || "Unknown"
  }

  const filteredAssignments = assignments.filter(assignment => {
    const professorName = getProfessorName(assignment.user_id)
    const moduleName = getModuleName(assignment.module_id)
    const matiereName = getMatiereName(assignment.matiere_id)
    const groupeName = getGroupeName(assignment.groupe_id)

    return (
      professorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      matiereName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      groupeName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Group assignments by professor
  const groupedAssignments = filteredAssignments.reduce((acc, assignment) => {
    const professorId = assignment.user_id
    if (!acc[professorId]) {
      acc[professorId] = {
        professor: professors.find(p => p.id === professorId),
        assignments: []
      }
    }
    acc[professorId].assignments.push(assignment)
    return acc
  }, {})

  return (
    <div className="flex-1 bg-[#F7F4ED] overflow-y-auto h-screen">
      {/* Header */}
      <div className="bg-white border-b border-[#242424]/10 px-8 py-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold text-[#242424]">
              Assignments
            </h1>
            <p className="text-[#242424]/60 mt-1">
              Manage professor-course-group assignments
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-[#1A8917] text-white rounded-xl font-semibold hover:bg-[#1A8917]/90 transition-colors shadow-lg shadow-[#1A8917]/20"
          >
            <Plus size={20} />
            New Assignment
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
              placeholder="Search by professor, module, matière, or group..."
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

        {/* Assignments List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-[#242424]/60">Loading assignments...</div>
          </div>
        ) : Object.keys(groupedAssignments).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-[#242424]/60">
            <LinkIcon size={48} className="mb-4" />
            <p>No assignments found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.values(groupedAssignments).map(({ professor, assignments }) => (
              <div
                key={professor?.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-[#242424]/5"
              >
                {/* Professor Header */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#242424]/10">
                  <div className="w-12 h-12 rounded-full bg-[#1A8917] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">
                      {professor?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-bold text-[#242424]">
                      {professor?.name || "Unknown Professor"}
                    </h3>
                    <p className="text-[#242424]/60 text-sm">
                      {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Assignments Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="bg-[#F7F4ED] rounded-xl p-4 border border-[#242424]/5"
                    >
                      {/* Assignment Details */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <BookOpen size={16} className="text-[#1A8917]" />
                          <span className="font-semibold text-[#242424]">
                            {getModuleName(assignment.module_id)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Layers size={16} className="text-[#D4A373]" />
                          <span className="text-[#242424]/70">
                            {getMatiereName(assignment.matiere_id)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users size={16} className="text-[#242424]/60" />
                          <span className="text-[#242424]/70">
                            {getGroupeName(assignment.groupe_id)}
                          </span>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors text-sm"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  ))}
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
                Create New Assignment
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
                  Professor *
                </label>
                <select
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#F7F4ED] border border-[#242424]/10 rounded-xl outline-none focus:border-[#1A8917] transition-colors"
                >
                  <option value="">Select a professor</option>
                  {professors.map((professor) => (
                    <option key={professor.id} value={professor.id}>
                      {professor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#242424] mb-2">
                  Module *
                </label>
                <select
                  name="module_id"
                  value={formData.module_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#F7F4ED] border border-[#242424]/10 rounded-xl outline-none focus:border-[#1A8917] transition-colors"
                >
                  <option value="">Select a module</option>
                  {modules.map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#242424] mb-2">
                  Matière *
                </label>
                <select
                  name="matiere_id"
                  value={formData.matiere_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#F7F4ED] border border-[#242424]/10 rounded-xl outline-none focus:border-[#1A8917] transition-colors"
                >
                  <option value="">Select a matière</option>
                  {matieres
                    .filter(m => !formData.module_id || m.module_id === parseInt(formData.module_id))
                    .map((matiere) => (
                      <option key={matiere.id} value={matiere.id}>
                        {matiere.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#242424] mb-2">
                  Group *
                </label>
                <select
                  name="groupe_id"
                  value={formData.groupe_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#F7F4ED] border border-[#242424]/10 rounded-xl outline-none focus:border-[#1A8917] transition-colors"
                >
                  <option value="">Select a group</option>
                  {groupes.map((groupe) => (
                    <option key={groupe.id} value={groupe.id}>
                      {groupe.name}
                    </option>
                  ))}
                </select>
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
