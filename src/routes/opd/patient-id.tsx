import { createFileRoute } from '@tanstack/react-router'
import PatientId from '@/pages/opd/PatientId'

export const Route = createFileRoute('/opd/patient-id')({
  component: PatientId,
})
