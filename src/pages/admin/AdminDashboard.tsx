import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from '@/components/ui/Table'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { Select } from '@/components/ui/Select'
import { Search, Download, Users, Clock, LayoutGrid, CheckCircle2 } from 'lucide-react'
import { AdminPatient } from '@/types/opd'
import dayjs from 'dayjs'
import { useAdminPatientsQuery } from '@/api/patients'

export default function AdminDashboard() {
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState("")
  
  // Use TanStack Query for admin patients
  const { data: patients = [], isLoading } = useAdminPatientsQuery()

  const stats = {
    total: patients.length,
    waiting: patients.filter(p => p.status === "waiting").length,
    inProgress: patients.filter(p => p.status === "in-progress").length,
    completed: patients.filter(p => p.status === "completed").length,
  }

  const StatCard = ({ title, value, color, icon }: any) => (
    <Card className="rounded-2xl border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-full p-6">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${color}-50 text-${color}-500`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-500 font-bold text-xs mb-1 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
        </div>
      </div>
    </Card>
  )

  const columns = [
    {
      title: "UHID / Name",
      dataIndex: "name" as keyof AdminPatient,
      key: "name",
      render: (text: string, record: AdminPatient) => (
        <div>
          <div className="font-bold text-text-primary">{text}</div>
          <div className="text-xs text-text-tertiary font-mono mt-0.5">{record.uhid}</div>
        </div>
      )
    },
    {
      title: "Specialty",
      dataIndex: "specialty" as keyof AdminPatient,
      key: "specialty",
      render: (text: string) => <span className="font-bold text-text-secondary">{text}</span>
    },
    {
      title: "Room",
      dataIndex: "room" as keyof AdminPatient,
      key: "room",
      render: (text: string) => (
        <span className="px-2 py-1 rounded bg-gray-100 text-text-secondary font-mono font-bold text-xs uppercase">{text}</span>
      )
    },
    {
      title: "Time",
      dataIndex: "visitDate" as keyof AdminPatient,
      key: "time",
      render: (date: string) => (
        <span className="text-text-tertiary font-medium">{dayjs(date).format('hh:mm A')}</span>
      )
    },
    {
      title: "Status",
      dataIndex: "status" as keyof AdminPatient,
      key: "status",
      render: (status: string) => {
        let color: "success" | "warning" | "info" | "default" | "green" | "orange" | "blue" | "gray" = "gray"
        let label = status.toUpperCase()
        
        if (status === "waiting") { color = "orange"; label = "WAITING"; }
        if (status === "in-progress") { color = "blue"; label = "IN PROGRESS"; }
        if (status === "completed") { color = "green"; label = "COMPLETED"; }
        
        return <Tag color={color} className="font-bold shadow-sm">{label}</Tag>;
      }
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Button variant="text" size="small" className="text-brand-primary font-bold">
          View Details
        </Button>
      )
    }
  ]

  const filteredData = patients.filter(p => 
    p.name.toLowerCase().includes(searchText.toLowerCase()) || 
    p.uhid.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard 
          title={t('admin_today_patients')} 
          value={stats.total} 
          color="indigo" 
          icon={<Users size={24} className="text-indigo-500" />} 
        />
        <StatCard 
          title={t('admin_waiting')} 
          value={stats.waiting} 
          color="orange" 
          icon={<Clock size={24} className="text-orange-500" />} 
        />
        <StatCard 
          title={t('admin_in_progress')} 
          value={stats.inProgress} 
          color="blue" 
          icon={<LayoutGrid size={24} className="text-blue-500" />} 
        />
        <StatCard 
          title={t('admin_completed')} 
          value={stats.completed} 
          color="emerald" 
          icon={<CheckCircle2 size={24} className="text-emerald-500" />} 
        />
      </div>

      <Card className="rounded-2xl border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex-1 w-full sm:max-w-xs">
            <Input
              placeholder={t('admin_search')}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="bg-gray-50 border-gray-100"
              fullWidth={true}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select 
              value="all"
              onChange={() => {}}
              options={[
                { label: "All Departments", value: "all" },
                { label: "Cardiology", value: "cardio" },
                { label: "Orthopaedics", value: "ortho" },
              ]}
              className="w-full sm:w-48"
            />
            <Button variant="outline" icon={<Download size={18} />} className="border-gray-100 text-text-secondary whitespace-nowrap">
              {t('admin_export')}
            </Button>
          </div>
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10, className: "mt-6" }}
        />
      </Card>
    </div>
  )
}
