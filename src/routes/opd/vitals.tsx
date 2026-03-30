import { createFileRoute } from '@tanstack/react-router'
import Vitals from '@/pages/opd/Vitals'

export const Route = createFileRoute('/opd/vitals')({
  component: Vitals,
})
