import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/opd')({
  component: OPDLayout,
})

function OPDLayout() {
  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col font-app">
      <header className="bg-white px-6 py-4 shadow-sm border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#34b6b3] flex items-center justify-center text-white font-bold text-xl">
          M
        </div>
        <h1 className="text-xl font-bold text-[#1c3553]">Med-Sync OPD</h1>
      </header>

      <main className="flex-1 flex flex-col px-4 md:px-8 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#40c4aa]/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3" />

        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
