import { createFileRoute } from '@tanstack/react-router'
import OPDCard from '@/pages/opd/OpdCard'

export const Route = createFileRoute('/opd/opd-card')({
  component: OPDCard,
})
