import { createFileRoute } from '@tanstack/react-router'
import Demographics from '@/pages/opd/Demographics'

export const Route = createFileRoute('/opd/demographics')({
  component: Demographics,
})
