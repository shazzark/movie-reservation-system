import type { Metadata } from 'next'
import { Navigation } from '../../../component/navigation'
import { Footer } from '../../../component/footer'
import { SeatSelectionClient } from '../../../component/seats/seat-section-client'


interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Select Seats - CineBook',
  description: 'Choose your seats and complete your movie booking',
}

export default async function SeatsPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <SeatSelectionClient showtimeId={id} />
      </main>
      <Footer />
    </div>
  )
}
