import type { Metadata } from 'next'
import { CustomerShell } from '@/component/layout/customer-shell'
import { ProfileClient } from '../../component/profile/profile-client'

export const metadata: Metadata = {
  title: 'My Profile - CineBook',
  description: 'Manage your movie bookings and reservations',
}

export default function ProfilePage() {
  return (
    <CustomerShell>
      <ProfileClient />
    </CustomerShell>
  )
}
