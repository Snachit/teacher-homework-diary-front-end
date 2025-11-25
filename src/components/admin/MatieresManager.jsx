import { useState, useEffect } from "react"
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  BookOpen,
  Clock
} from "lucide-react"
import { adminMatieresAPI, adminModulesAPI } from "../../services/api"

export default function MatieresManager() {
  const [matieres, setMatieres] = useState([])
  const [modules, setModules] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("create") // "create" or "edit"
  const [selectedMatiere, setSelectedMatiere] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    module_id: "",
    hours: "",
    coefficient: "",
    description: ""
  })
  const [error, setError] = useState(null)

  // Fetch matières and modules
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [matieresRes, modulesRes] = await Promise.all([
        adminMatieresAPI.list(),
        adminModulesAPI.list()
      ])
      setMatieres(matieresRes.data || [])
      setModules(modulesRes.data || [])
    } catch (err) {
      console.error("Failed to fetch data:", err)
      setError("Failed to load matières. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setModalMode("create")
    setFormData({
      name: "",
      code: "",
      module_id: "",
      hours: "",
      coefficient: "",
      description: ""
    })
    setShowModal(true)
  }

  const handleEdit = (matiere) => {
    setModalMode("edit")
    setSelectedMatiere(matiere)
    setFormData({
      name: matiere.name || "",
      code: matiere.code || "",
      module_id: matiere.module_id || "",
      hours: matiere.hours || "",
      coefficient: matiere.coefficient || "",
      description: matiere.description || ""
    })
    setShowModal(true)
  }

  const handleDelete = async (matiereId) => {
    if (!window.confirm("Are you sure you want to delete this matière?")) {
      return
    }

    try {
      await adminMatieresAPI.delete(matiereId)
      await fetchData()
    } catch (err) {
      console.error("Failed to delete matière:", err)
      alert("Failed to delete matière. Please try again.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validate numeric fields
    if (formData.hours && (parseFloat(formData.hours) < 0 || parseFloat(formData.hours) > 500)) {
      setError("Hours must be between 0 and 500.")
      return
    }

    if (formData.coefficient && (parseFloat(formData.coefficient) < 0 || parseFloat(formData.coefficient) > 10)) {
      setError("Coefficient must be between 0 and 10.")
      return
    }

    // Validate required fields
    if (!formData.name || formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters long.")
      return
    }

    if (!formData.code || formData.code.trim().length < 1) {
      setError("Code is required.")
      return
    }

    if (!formData.module_id) {
      setError("Please select a module.")
      return
    }

    try {
      if (modalMode === "create") {
        await adminMatieresAPI.create(formData)
      } else {
        await adminMatieresAPI.update(selectedMatiere.id, formData)
      }

      setShowModal(false)
      await fetchData()
    } catch (err) {
      console.error("Failed to save matière:", err)
      setError("Failed to save matière. Please check your input and try again.")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const filteredMatieres = matieres.filter(matiere =>
    matiere.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    matiere.code?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getModuleName = (moduleId) => {
    const module = modules.find(m => m.id === moduleId)
    return module?.name || "Unknown"
  }

  return (
    <div className="flex-1 bg-[#F7F4ED] overflow-y-auto h-screen">
      {/* Header */}
      <div className="bg-white border-b border-[#242424]/10 px-8 py-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold text-[#242424]">
              Matières
            </h1>
            <p className="text-[#242424]/60 mt-1">
              Manage subjects and course topics
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-[#1A8917] text-white rounded-xl font-semibold hover:bg-[#1A8917]/90 transition-colors shadow-lg shadow-[#1A8917]/20"
          >
            <Plus size={20} />
            Add Matière
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
              placeholder="Search by name or code..."
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

        {/* Matières List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-[#242424]/60">Loading matières...</div>
          </div>
        ) : filteredMatieres.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-[#242424]/60">
            <Layers size={48} className="mb-4" />
            <p>No matières found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatieres.map((matiere) => (
              <div
                key={matiere.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-[#242424]/5 hover:shadow-xl transition-shadow"
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-[#D4A373] flex items-center justify-center mb-4">
                  <Layers size={32} className="text-white" />
                </div>

                {/* Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-serif text-xl font-bold text-[#242424]">
                      {matiere.name || "Unknown"}
                    </h3>
                    {matiere.code && (
                      <span className="px-3 py-1 bg-[#D4A373]/10 text-[#D4A373] text-xs font-semibold rounded-full">
                        {matiere.code}
                      </span>
                    )}
                  </div>

                  {matiere.description && (
                    <p className="text-[#242424]/70 text-sm line-clamp-2 mb-3">
                      {matiere.description}
                    </p>
                  )}

                  {/* Module */}
                  <div className="flex items-center gap-2 text-[#242424]/60 text-sm mb-2">
                    <BookOpen size={16} />
                    <span>{getModuleName(matiere.module_id)}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#242424]/10">
                  {matiere.hours && (
                    <div className="flex items-center gap-2 text-[#242424]/60 text-sm">
                      <Clock size={16} />
                      <span>{matiere.hours}h</span>
                    </div>
                  )}
                  {matiere.coefficient && (
                    <div className="text-[#242424]/60 text-sm">
                      <span className="font-semibold">Coef:</span> {matiere.coefficient}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(matiere)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1A8917]/10 text-[#1A8917] rounded-lg font-semibold hover:bg-[#1A8917]/20 transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(matiere.id)}
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
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-[#242424]">
                {modalMode === "create" ? "Add New Matière" : "Edit Matière"}
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
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#F7F4ED] border border-[#242424]/10 rounded-xl outline-none focus:border-[#1A8917] transition-colors"
                  placeholder="Data Structures"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#242424] mb-2">
                  Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#F7F4ED] border border-[#242424]/10 rounded-xl outline-none focus:border-[#1A8917] transition-colors"
                  placeholder="DS101"
                />
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#242424] mb-2">
                    Hours
                  </label>
                  <input
                    type="number"
                    name="hours"
                    value={formData.hours}
                    onChange={handleInputChange}
                    min="0"
                    step="0.5"
                    className="w-full px-4 py-3 bg-[#F7F4ED] border border-[#242424]/10 rounded-xl outline-none focus:border-[#1A8917] transition-colors"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#242424] mb-2">
                    Coefficient
                  </label>
                  <input
                    type="number"
                    name="coefficient"
                    value={formData.coefficient}
                    onChange={handleInputChange}
                    min="0"
                    step="0.5"
                    className="w-full px-4 py-3 bg-[#F7F4ED] border border-[#242424]/10 rounded-xl outline-none focus:border-[#1A8917] transition-colors"
                    placeholder="2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#242424] mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#F7F4ED] border border-[#242424]/10 rounded-xl outline-none focus:border-[#1A8917] transition-colors resize-none"
                  placeholder="Introduction to data structures and algorithms..."
                />
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
