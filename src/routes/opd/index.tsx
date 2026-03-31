import { createFileRoute } from '@tanstack/react-router'
import OPDWizard from '@/pages/opdSections/OPDWizard'

export const Route = createFileRoute('/opd/')({
  component: OPDWizard,
})
