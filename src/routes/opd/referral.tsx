import { createFileRoute } from '@tanstack/react-router'
import ReferralValidation from '@/pages/opd/Referral'

export const Route = createFileRoute('/opd/referral')({
  component: ReferralValidation,
})
