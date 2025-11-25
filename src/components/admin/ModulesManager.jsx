import { useState, useEffect } from "react"
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  GraduationCap,
  Layers
} from "lucide-react"
import { adminModulesAPI, adminFilieresAPI } from "../../services/api"

export default function ModulesManager() {
  const [modules, setModules] = useState([])
  const [filieres, setFilieres] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("create") // "create" or "edit"
  const [selectedModule, setSelectedModule] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    filiere_id: "",
    description: ""
  })
  const [error, setError] = useState(null)

  // Fetch modules and filières
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [modulesRes, filieresRes] = await Promise.all([
        adminModulesAPI.list(),
        adminFilieresAPI.list()
      ])
      setModules(modulesRes.data || [])
      setFilieres(filieresRes.data || [])
    } catch (err) {
      console.error("Failed to fetch data:", err)
      setError("Failed to load modules. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setModalMode("create")
    setFormData({
      name: "",
      code: "",
      filiere_id: "",
      description: ""
    })
    setShowModal(true)
  }

  const handleEdit = (module) => {
    setModalMode("edit")
    setSelectedModule(module)
    setFormData({
      name: module.name || "",
      code: module.code || "",
      filiere_id: module.filiere_id || "",
      description: module.description || ""
    })
    setShowModal(true)
  }

  const handleDelete = async (moduleId) => {
    if (!window.confirm("Are you sure you want to delete this module? This will also delete all associated matières.")) {
      return
    }

    try {
      await adminModulesAPI.delete(moduleId)
      await fetchData()
    } catch (err) {
      console.error("Failed to delete module:", err)
      alert("Failed to delete module. Please try again.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validate required fields
    if (!formData.name || formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters long.")
      return
    }

    if (!formData.code || formData.code.trim().length < 1) {
      setError("Code is required.")
      return
    }

    if (!formData.filiere_id) {
      setError("Please select a filière.")
      return
    }

    try {
      if (modalMode === "create") {
        await adminModulesAPI.create(formData)
      } else {
        await adminModulesAPI.update(selectedModule.id, formData)
      }

      setShowModal(false)
      await fetchData()
    } catch (err) {
      console.error("Failed to save module:", err)
      setError("Failed to save module. Please check your input and try again.")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const filteredModules = modules.filter(module =>
    module.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.code?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getFiliereName = (filiereId) => {
    const filiere = filieres.find(f => f.id === filiereId)
    return filiere?.name || "Unknown"
  }

  return (
    <div className="flex-1 bg-[#F7F4ED] overflow-y-auto h-screen">
      {/* Header */}
      <div className="bg-white border-b border-[#242424]/10 px-8 py-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold text-[#242424]">
              Modules
            </h1>
            <p className="text-[#242424]/60 mt-1">
              Manage course modules and academic units
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-[#1A8917] text-white rounded-xl font-semibold hover:bg-[#1A8917]/90 transition-colors shadow-lg shadow-[#1A8917]/20"
          >
            <Plus size={20} />
            Add Module
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

        {/* Modules List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-[#242424]/60">Loading modules...</div>
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-[#242424]/60">
            <BookOpen size={48} className="mb-4" />
            <p>No modules found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module) => (
              <div
                key={module.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-[#242424]/5 hover:shadow-xl transition-shadow"
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-[#1A8917] flex items-center justify-center mb-4">
                  <BookOpen size={32} className="text-white" />
                </div>

                {/* Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-serif text-xl font-bold text-[#242424]">
                      {module.name || "Unknown"}
                    </h3>
                    {module.code && (
                      <span className="px-3 py-1 bg-[#1A8917]/10 text-[#1A8917] text-xs font-semibold rounded-full">
                        {module.code}
                      </span>
                    )}
                  </div>

                  {module.description && (
                    <p className="text-[#242424]/70 text-sm line-clamp-2 mb-3">
                      {module.description}
                    </p>
                  )}

                  {/* Filière */}
                  <div className="flex items-center gap-2 text-[#242424]/60 text-sm">
                    <GraduationCap size={16} />
                    <span>{getFiliereName(module.filiere_id)}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#242424]/10">
                  <div className="flex items-center gap-2 text-[#242424]/60 text-sm">
                    <Layers size={16} />
                    <span>{module.matieres_count || 0} matières</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(module)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1A8917]/10 text-[#1A8917] rounded-lg font-semibold hover:bg-[#1A8917]/20 transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(module.id)}
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
                {modalMode === "create" ? "Add New Module" : "Edit Module"}
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
                  placeholder="Advanced Algorithms"
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
                  placeholder="CS301"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#242424] mb-2">
                  Filière *
                </label>
                <select
                  name="filiere_id"
                  value={formData.filiere_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#F7F4ED] border border-[#242424]/10 rounded-xl outline-none focus:border-[#1A8917] transition-colors"
                >
                  <option value="">Select a filière</option>
                  {filieres.map((filiere) => (
                    <option key={filiere.id} value={filiere.id}>
                      {filiere.name}
                    </option>
                  ))}
                </select>
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
                  placeholder="A comprehensive study of advanced algorithms..."
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
