import { useState } from "react"
import { BookOpen, Calendar, User, FileText, MessageSquare } from "lucide-react"

// Mock data based on API structure
const recentLogbooks = [
  {
    id: 1,
    user: { id: 1, name: "Dr. Sarah Connor" },
    module: { id: 10, name: "Advanced Algorithms" },
    groupe: { id: 3, name: "Groupe A" },
    session_date: "2025-11-24",
    session_type: "cours",
    contenu_traite: "Introduction to Graph Theory and BFS traversal. We covered the fundamental concepts of graphs, including vertices, edges, directed and undirected graphs. Students implemented BFS algorithm using queue data structure.",
    remarques: "Student participation was low today. Need to engage them more with practical examples."
  },
  {
    id: 2,
    user: { id: 2, name: "Prof. John Smith" },
    module: { id: 12, name: "Database Systems" },
    groupe: { id: 5, name: "Groupe B" },
    session_date: "2025-11-23",
    session_type: "TP",
    contenu_traite: "Practical session on SQL queries. Students practiced JOIN operations, subqueries, and aggregate functions. Each student completed 10 exercises on complex queries.",
    remarques: "Excellent participation. Most students completed all exercises."
  },
  {
    id: 3,
    user: { id: 3, name: "Dr. Emily Watson" },
    module: { id: 15, name: "Machine Learning" },
    groupe: { id: 2, name: "Groupe C" },
    session_date: "2025-11-22",
    session_type: "cours",
    contenu_traite: "Introduction to Neural Networks. Covered perceptrons, activation functions, and backpropagation algorithm. Discussed the mathematics behind gradient descent.",
    remarques: null
  },
  {
    id: 4,
    user: { id: 1, name: "Dr. Sarah Connor" },
    module: { id: 10, name: "Advanced Algorithms" },
    groupe: { id: 4, name: "Groupe D" },
    session_date: "2025-11-21",
    session_type: "TP",
    contenu_traite: "Lab work on sorting algorithms. Students implemented QuickSort, MergeSort, and analyzed their time complexity. Performance comparison between different algorithms.",
    remarques: "Some students struggled with recursion concepts."
  },
  {
    id: 5,
    user: { id: 4, name: "Prof. Michael Chen" },
    module: { id: 8, name: "Web Development" },
    groupe: { id: 1, name: "Groupe A" },
    session_date: "2025-11-20",
    session_type: "cours",
    contenu_traite: "React Hooks and State Management. Covered useState, useEffect, and useContext. Built a simple todo application to demonstrate concepts.",
    remarques: "Students are excited about React. Good progress overall."
  },
  {
    id: 6,
    user: { id: 5, name: "Dr. Lisa Anderson" },
    module: { id: 18, name: "Operating Systems" },
    groupe: { id: 6, name: "Groupe B" },
    session_date: "2025-11-19",
    session_type: "cours",
    contenu_traite: "Process scheduling algorithms. Discussed FCFS, SJF, Round Robin, and Priority scheduling. Analyzed advantages and disadvantages of each approach.",
    remarques: null
  }
]

export default function LogbookFeed() {
  const [activeLogbook, setActiveLogbook] = useState(recentLogbooks[0])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const SessionTypeBadge = ({ type }) => {
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          type === "cours"
            ? "bg-[#1A8917]/10 text-[#1A8917]"
            : "bg-[#D4A373]/10 text-[#D4A373]"
        }`}
      >
        {type === "cours" ? "Cours" : "TP"}
      </span>
    )
  }

  return (
    <div className="flex-1 bg-[#F7F4ED]">
      {/* Header */}
      <div className="bg-white border-b border-[#242424]/10 px-8 py-6">
        <h1 className="font-serif text-4xl font-bold text-[#242424]">
          Dashboard Overview
        </h1>
        <p className="text-[#242424]/60 mt-1">
          Recent teaching activities and session logs
        </p>
      </div>

      {/* Split Pane Layout */}
      <div className="grid grid-cols-3 gap-6 p-8 h-[calc(100vh-140px)]">
        {/* Left Column - List */}
        <div className="col-span-1 overflow-y-auto pr-4 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#242424] mb-4">
            Recent Sessions
          </h2>

          {recentLogbooks.map((logbook) => (
            <button
              key={logbook.id}
              onClick={() => setActiveLogbook(logbook)}
              className={`w-full text-left p-5 rounded-2xl transition-all border-2 ${
                activeLogbook.id === logbook.id
                  ? "bg-white border-[#1A8917] shadow-lg"
                  : "bg-white/50 border-transparent hover:bg-white hover:border-[#1A8917]/30"
              }`}
            >
              {/* Module Name */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-serif text-lg font-bold text-[#242424] leading-tight flex-1">
                  {logbook.module.name}
                </h3>
                <SessionTypeBadge type={logbook.session_type} />
              </div>

              {/* Professor */}
              <div className="flex items-center gap-2 text-[#242424]/70 text-sm mb-2">
                <User size={14} />
                <span>{logbook.user.name}</span>
              </div>

              {/* Group */}
              <div className="flex items-center gap-2 text-[#242424]/70 text-sm">
                <BookOpen size={14} />
                <span>{logbook.groupe.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Column - Detail */}
        <div className="col-span-2 bg-white rounded-3xl shadow-xl p-8 overflow-y-auto">
          {activeLogbook && (
            <div className="max-w-3xl mx-auto">
              {/* Header */}
              <div className="border-b border-[#242424]/10 pb-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <SessionTypeBadge type={activeLogbook.session_type} />
                  <div className="flex items-center gap-2 text-[#242424]/60 text-sm">
                    <Calendar size={16} />
                    <span>{formatDate(activeLogbook.session_date)}</span>
                  </div>
                </div>

                <h1 className="font-serif text-4xl font-bold text-[#242424] mb-3">
                  {activeLogbook.module.name}
                </h1>

                <div className="flex items-center gap-6 text-[#242424]/70">
                  <div className="flex items-center gap-2">
                    <User size={18} />
                    <span className="font-semibold">{activeLogbook.user.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} />
                    <span className="font-semibold">{activeLogbook.groupe.name}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={20} className="text-[#1A8917]" />
                  <h2 className="font-serif text-2xl font-bold text-[#242424]">
                    Session Content
                  </h2>
                </div>
                <div className="prose prose-lg max-w-none">
                  <p className="text-[#242424]/80 leading-relaxed text-lg">
                    {activeLogbook.contenu_traite}
                  </p>
                </div>
              </div>

              {/* Remarks */}
              {activeLogbook.remarques && (
                <div className="bg-[#D4A373]/5 border-l-4 border-[#D4A373] rounded-r-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare size={20} className="text-[#D4A373]" />
                    <h3 className="font-serif text-xl font-bold text-[#242424]">
                      Remarks
                    </h3>
                  </div>
                  <p className="text-[#242424]/70 leading-relaxed">
                    {activeLogbook.remarques}
                  </p>
                </div>
              )}

              {!activeLogbook.remarques && (
                <div className="bg-[#F7F4ED] border border-[#242424]/10 rounded-2xl p-6 text-center">
                  <p className="text-[#242424]/50 italic">No remarks for this session</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
