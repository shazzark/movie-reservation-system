import type { Metadata } from 'next'
import { ContactClient } from '../../component/contact/contact-client'
import { CustomerShell } from '@/component/layout/customer-shell'

export const metadata: Metadata = {
  title: 'Contact Us - CineBook',
  description: 'Contact options and service limitations for the CineBook demo.',
}

export default function ContactPage() {
  return <CustomerShell><ContactClient /></CustomerShell>
}
