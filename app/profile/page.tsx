import type { Metadata } from 'next'
import { Navigation } from '../../component/navigation'
import { Footer } from '../../component/footer'
import { ProfileClient } from '../../component/profile/profile-client'

export const metadata: Metadata = {
  title: 'My Profile - CineBook',
  description: 'Manage your movie bookings and reservations',
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <ProfileClient />
      </main>
      <Footer />
    </div>
  )
}
