import { createFileRoute } from '@tanstack/react-router'
import CaptureModeSelection from '@/pages/opd/CaptureMode'

export const Route = createFileRoute('/opd/capture-mode')({
  component: CaptureModeSelection,
})
