import { useState } from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-app flex relative">
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col shadow-lg transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-[#1c3553] flex items-center justify-center text-white font-bold text-xl mr-3">
              A
            </div>
            <h1 className="text-lg font-bold text-[#1c3553]">OPD Admin</h1>
          </div>
          <button className="md:hidden text-gray-500 hover:bg-gray-100 p-1 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 bg-[#34b6b3]/10 text-[#34b6b3] rounded-lg font-medium"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
          >
            Patients List
          </a>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <a
            href="/opd"
            className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm"
          >
            Back to Kiosk
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center px-4 md:px-6 z-10 w-full gap-4">
          <button className="md:hidden text-gray-500 hover:bg-gray-100 p-2 rounded-md -ml-2" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <h2 className="text-xl font-bold text-[#1c3553] truncate">Dashboard Overview</h2>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
