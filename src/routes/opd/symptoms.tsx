import { createFileRoute } from '@tanstack/react-router'
import SymptomsAndRouting from '@/pages/opd/Symptoms'

export const Route = createFileRoute('/opd/symptoms')({
  component: SymptomsAndRouting,
})
