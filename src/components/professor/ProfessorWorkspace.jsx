import { useState } from "react"
import { BookOpen, Clock, CheckCircle, FileText } from "lucide-react"

export default function ProfessorWorkspace({ assignments, onSubmitLogbook }) {
  const [activeAssignment, setActiveAssignment] = useState(null)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: "cours",
    content: "",
    remarks: ""
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTypeToggle = (type) => {
    setFormData(prev => ({
      ...prev,
      type
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!activeAssignment) {
      alert("Please select a class first.")
      return
    }

    if (!formData.content.trim()) {
      alert("Please enter the session content.")
      return
    }

    // Prepare logbook data
    const logbookData = {
      assignment_id: activeAssignment.id,
      module_id: activeAssignment.module_id,
      matiere_id: activeAssignment.matiere_id,
      groupe_id: activeAssignment.groupe_id,
      session_date: formData.date,
      session_type: formData.type,
      contenu_traite: formData.content,
      remarques: formData.remarks || null
    }

    // Call parent handler
    await onSubmitLogbook(logbookData)

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: "cours",
      content: "",
      remarks: ""
    })
  }

  return (
    <div className="flex-1 bg-[#F7F4ED] overflow-y-auto">
      {/* Header - Mini Bento */}
      <div className="bg-white border-b border-[#242424]/10 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold text-[#242424]">
              Welcome, Professor
            </h1>
            <p className="text-[#242424]/60 mt-1">
              Document your teaching sessions
            </p>
          </div>

          {/* Stats Cards */}
          <div className="flex gap-4">
            <div className="bg-[#1A8917]/10 rounded-2xl px-6 py-3 border border-[#1A8917]/20">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-[#1A8917]" />
                <div>
                  <p className="text-xs text-[#242424]/60 font-semibold">Total Sessions</p>
                  <p className="font-serif text-2xl font-bold text-[#242424]">24</p>
                </div>
              </div>
            </div>

            <div className="bg-[#D4A373]/10 rounded-2xl px-6 py-3 border border-[#D4A373]/20">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-[#D4A373]" />
                <div>
                  <p className="text-xs text-[#242424]/60 font-semibold">Classes Assigned</p>
                  <p className="font-serif text-2xl font-bold text-[#242424]">{assignments.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Split Pane */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Left Column - Class Picker (30%) */}
        <div className="w-[30%] border-r border-[#242424]/10 bg-[#F7F4ED] p-6 overflow-y-auto">
          <h2 className="font-serif text-2xl font-bold text-[#242424] mb-4">
            Select Class
          </h2>
          <p className="text-[#242424]/60 text-sm mb-6">
            Choose the class for your logbook entry
          </p>

          {/* Assignment Cards */}
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <button
                key={assignment.id}
                onClick={() => setActiveAssignment(assignment)}
                className={`w-full text-left p-4 rounded-2xl transition-all border-2 ${
                  activeAssignment?.id === assignment.id
                    ? "bg-white border-[#1A8917] shadow-md"
                    : "bg-white border-transparent hover:border-[#1A8917]/30 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-full bg-[#1A8917] flex items-center justify-center flex-shrink-0">
                    <BookOpen size={20} className="text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#242424] text-sm mb-1">
                      {assignment.module_name}
                    </h3>
                    <p className="text-[#242424]/70 text-xs">
                      {assignment.matiere_name || "General"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 bg-[#D4A373]/10 text-[#D4A373] text-xs rounded-md font-semibold">
                        {assignment.groupe_name}
                      </span>
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {activeAssignment?.id === assignment.id && (
                    <CheckCircle size={20} className="text-[#1A8917] flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {assignments.length === 0 && (
            <div className="text-center py-12 text-[#242424]/60">
              <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
              <p>No classes assigned</p>
            </div>
          )}
        </div>

        {/* Right Column - Logbook Editor (70%) */}
        <div className="flex-1 p-8 overflow-y-auto">
          {!activeAssignment ? (
            // Placeholder State
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-[#1A8917]/10 flex items-center justify-center mx-auto mb-6">
                  <FileText size={48} className="text-[#1A8917]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#242424] mb-2">
                  Select a class to start
                </h3>
                <p className="text-[#242424]/60">
                  Choose a class from the left to create a logbook entry
                </p>
              </div>
            </div>
          ) : (
            // Logbook Form
            <div className="max-w-4xl mx-auto">
              {/* Form Header */}
              <div className="mb-6">
                <h2 className="font-serif text-3xl font-bold text-[#242424] mb-2">
                  New Logbook Entry
                </h2>
                <p className="text-[#242424]/60">
                  {activeAssignment.module_name} - {activeAssignment.groupe_name}
                </p>
              </div>

              {/* The Form - Paper-like Design */}
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-xl border border-[#242424]/5">
                {/* Date and Type Row */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-[#242424] mb-2">
                      Session Date
                    </label>
                    <div className="relative">
                      <Clock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#242424]/40" />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-[#F7F4ED] border border-[#242424]/10 rounded-xl outline-none focus:border-[#1A8917] transition-colors font-semibold"
                      />
                    </div>
                  </div>

                  {/* Type - Pill Toggle */}
                  <div>
                    <label className="block text-sm font-semibold text-[#242424] mb-2">
                      Session Type
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleTypeToggle("cours")}
                        className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                          formData.type === "cours"
                            ? "bg-[#1A8917] text-white shadow-lg shadow-[#1A8917]/20"
                            : "bg-[#F7F4ED] text-[#242424]/60 hover:bg-[#1A8917]/10"
                        }`}
                      >
                        Cours
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTypeToggle("TP")}
                        className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                          formData.type === "TP"
                            ? "bg-[#D4A373] text-white shadow-lg shadow-[#D4A373]/20"
                            : "bg-[#F7F4ED] text-[#242424]/60 hover:bg-[#D4A373]/10"
                        }`}
                      >
                        TP
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content - Large Textarea */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#242424] mb-2">
                    Session Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={10}
                    placeholder="What topics were covered today? Describe the content, activities, and learning objectives..."
                    className="w-full px-4 py-3 bg-[#F7F4ED] border border-[#242424]/10 rounded-xl outline-none focus:border-[#1A8917] transition-colors resize-none leading-relaxed"
                  />
                  <p className="text-xs text-[#242424]/50 mt-2">
                    Provide a detailed description of the session content
                  </p>
                </div>

                {/* Remarks - Optional */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-[#242424] mb-2">
                    Remarks (Optional)
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any observations, student feedback, or notes..."
                    className="w-full px-4 py-3 bg-[#F7F4ED] border border-[#242424]/10 rounded-xl outline-none focus:border-[#1A8917] transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="border-t border-[#242424]/10 pt-6">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#1A8917] text-white rounded-xl font-semibold text-lg hover:bg-[#1A8917]/90 transition-colors shadow-lg shadow-[#1A8917]/20"
                  >
                    <CheckCircle size={24} />
                    Sign & Submit Logbook
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
