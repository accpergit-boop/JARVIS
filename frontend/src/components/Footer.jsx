import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-text-main text-bone py-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-serif font-bold text-primary mb-2">ZAIQA</h3>
            <p className="text-sm text-bone/70 mb-4">
              Where Pakistani Tradition Meets South African Flavour
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <Link to="/menu" className="block text-bone/70 hover:text-primary transition-colors">
                Menu
              </Link>
              <Link to="/about" className="block text-bone/70 hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/offers" className="block text-bone/70 hover:text-primary transition-colors">
                Offers
              </Link>
              <Link to="/faq" className="block text-bone/70 hover:text-primary transition-colors">
                FAQ
              </Link>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start text-bone/70">
                <Phone className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                +27 123 456 789
              </li>
              <li className="flex items-start text-bone/70">
                <Mail className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                hello@zaiqa.restaurant
              </li>
              <li className="flex items-start text-bone/70">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                Pietermaritzburg, South Africa
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold mb-4">Opening Hours</h4>
            <ul className="space-y-2 text-sm text-bone/70">
              <li>Monday - Friday: 11:00 - 22:00</li>
              <li>Saturday: 12:00 - 23:00</li>
              <li>Sunday: 12:00 - 21:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-bone/20 mt-8 pt-8 text-center text-sm text-bone/60">
          <p>&copy; {new Date().getFullYear()} ZAIQA Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}