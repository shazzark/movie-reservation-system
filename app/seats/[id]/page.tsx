import type { Metadata } from 'next'
import { CustomerShell } from '@/component/layout/customer-shell'
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
    <CustomerShell>
      <SeatSelectionClient showtimeId={id} />
    </CustomerShell>
  )
}
