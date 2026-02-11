import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import Logo from "./logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card text-card-foreground mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4 mb-8">
          {/* Company Info */}
          <div>
            {/* <Link href="/" className="flex items-center gap-2 mb-4">
              <Film className="h-6 w-6 text-accent" />
              <span className="text-lg font-bold">CineBook</span>
            </Link> */}
            <Logo />
            <p className="text-sm text-muted-foreground">
              Your gateway to unforgettable movie experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>123 Cinema District, Downtown</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@cinebook.com</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold mb-4">Hours</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Mon - Thu: 10 AM - 11 PM</li>
              <li>Fri - Sat: 9 AM - 1 AM</li>
              <li>Sunday: 9 AM - 11 PM</li>
              <li className="pt-2 text-xs">Open holidays</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>&copy; {currentYear} CineBook. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
