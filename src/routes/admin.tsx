import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] font-app flex">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-[#1c3553] flex items-center justify-center text-white font-bold text-xl mr-3">
            A
          </div>
          <h1 className="text-lg font-bold text-[#1c3553]">OPD Admin</h1>
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

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6 z-10 w-full">
          <h2 className="text-xl font-bold text-[#1c3553]">Dashboard Overview</h2>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
