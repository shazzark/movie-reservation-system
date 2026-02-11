import type { Metadata } from 'next'
import { ContactClient } from '../../component/contact/contact-client'

export const metadata: Metadata = {
  title: 'Contact Us - CineBook',
  description: 'Get in touch with CineBook. We\'d love to hear from you.',
}

export default function ContactPage() {
  return <ContactClient />
}
