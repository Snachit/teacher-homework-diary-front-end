import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  Library,
  GraduationCap,
  BookOpen,
  Layers,
  UsersRound,
  Link as LinkIcon,
  FileText,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from "lucide-react"

export default function Sidebar({ activeMenu = "overview", onMenuChange, onLogout }) {
  const [isAcademicsOpen, setIsAcademicsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, href: "#" },
    { id: "professors", label: "Professors", icon: Users, href: "#" },
    { id: "assignments", label: "Assignments", icon: LinkIcon, href: "#" },
  ]

  const academicsItems = [
    { id: "filieres", label: "Filières", icon: GraduationCap, href: "#" },
    { id: "modules", label: "Modules", icon: BookOpen, href: "#" },
    { id: "matieres", label: "Matières", icon: Layers, href: "#" },
    { id: "groupes", label: "Groupes", icon: UsersRound, href: "#" },
  ]

  const logbooksItem = { id: "logbooks", label: "Logbooks", icon: FileText, href: "#" }

  const MenuItem = ({ item, isActive }) => {
    const Icon = item.icon
    return (
      <button
        onClick={() => onMenuChange(item.id)}
        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 text-left transition-all ${
          isActive
            ? "bg-white/20 text-white border-l-4 border-white"
            : "text-white/80 hover:bg-white/10 hover:text-white border-l-4 border-transparent"
        }`}
        title={isCollapsed ? item.label : ''}
      >
        <Icon size={20} />
        {!isCollapsed && <span className="font-semibold text-sm">{item.label}</span>}
      </button>
    )
  }

  const toggleAcademics = () => {
    setIsAcademicsOpen(!isAcademicsOpen)
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
    if (!isCollapsed) {
      setIsAcademicsOpen(false) // Close academics when collapsing
    }
  }

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-[#1A8917] min-h-screen flex flex-col transition-all duration-300`}>
      {/* Logo and Toggle */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="font-serif text-3xl font-bold text-white">Nota</h1>
              <p className="text-white/70 text-xs mt-1">Admin Dashboard</p>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
        {isCollapsed && (
          <div className="mt-3 text-center">
            <h1 className="font-serif text-2xl font-bold text-white">N</h1>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        {/* Main Menu */}
        <div className="mb-2">
          {menuItems.map((item) => (
            <MenuItem key={item.id} item={item} isActive={activeMenu === item.id} />
          ))}
        </div>

        {/* Academics Accordion */}
        {!isCollapsed && (
          <div className="mb-2">
            <button
              onClick={toggleAcademics}
              className="w-full flex items-center justify-between px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-all border-l-4 border-transparent"
            >
              <div className="flex items-center gap-3">
                <Library size={20} />
                <span className="font-semibold text-sm">Academics</span>
              </div>
              {isAcademicsOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {/* Academics Submenu */}
            {isAcademicsOpen && (
              <div className="pl-4 mt-1">
                {academicsItems.map((item) => (
                  <MenuItem key={item.id} item={item} isActive={activeMenu === item.id} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Collapsed Academics - Show as individual items */}
        {isCollapsed && (
          <div className="mb-2">
            {academicsItems.map((item) => (
              <MenuItem key={item.id} item={item} isActive={activeMenu === item.id} />
            ))}
          </div>
        )}

        {/* Logbooks */}
        <div>
          <MenuItem item={logbooksItem} isActive={activeMenu === logbooksItem.id} />
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={onLogout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-all rounded-lg`}
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-semibold text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
