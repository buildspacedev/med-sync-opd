import { createFileRoute } from '@tanstack/react-router'
import Review from '@/pages/opd/Review'

export const Route = createFileRoute('/opd/review')({
  component: Review,
})
