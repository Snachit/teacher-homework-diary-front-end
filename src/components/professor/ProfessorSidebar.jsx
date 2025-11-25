import { PenTool, Archive, User, LogOut } from "lucide-react"

export default function ProfessorSidebar({ activeMenu = "workspace", onMenuChange, onLogout }) {
  const menuItems = [
    { id: "workspace", label: "Workspace", icon: PenTool },
    { id: "history", label: "History", icon: Archive },
    { id: "profile", label: "Profile", icon: User },
  ]

  const MenuItem = ({ item, isActive }) => {
    const Icon = item.icon
    return (
      <button
        onClick={() => onMenuChange(item.id)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
          isActive
            ? "bg-white/20 text-white border-l-4 border-white"
            : "text-white/80 hover:bg-white/10 hover:text-white border-l-4 border-transparent"
        }`}
      >
        <Icon size={20} />
        <span className="font-semibold text-sm">{item.label}</span>
      </button>
    )
  }

  return (
    <aside className="w-64 bg-[#1A8917] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/20">
        <h1 className="font-serif text-3xl font-bold text-white">Nota</h1>
        <p className="text-white/70 text-xs mt-1">Professor Workspace</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        {menuItems.map((item) => (
          <MenuItem key={item.id} item={item} isActive={activeMenu === item.id} />
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-all rounded-lg"
        >
          <LogOut size={20} />
          <span className="font-semibold text-sm">Logout</span>
        </button>
      </div>
    </aside>
  )
}
