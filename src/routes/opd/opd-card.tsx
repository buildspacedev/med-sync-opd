import { createFileRoute } from '@tanstack/react-router'
import OPDCard from '@/pages/opdSections/OpdCard'

export const Route = createFileRoute('/opd/opd-card')({
  component: OPDCard,
})
