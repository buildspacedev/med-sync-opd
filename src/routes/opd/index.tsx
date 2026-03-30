import { createFileRoute } from '@tanstack/react-router'
import OPDWizard from '@/pages/opd/OPDWizard'

export const Route = createFileRoute('/opd/')({
  component: OPDWizard,
})
