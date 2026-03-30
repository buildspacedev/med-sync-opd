import { createFileRoute } from '@tanstack/react-router'
import ImageCapture from '@/pages/opd/ImageCapture'

export const Route = createFileRoute('/opd/image-capture')({
  component: ImageCapture,
})
