import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Mail, Phone, Instagram, Youtube, Twitter, Disc as Discord, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative bg-navy-950 border-t border-cobalt-500/20 text-slate-400 text-sm overflow-hidden pt-16 pb-12">
      {/* Background glow orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-cobalt-600/10 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cobalt-700 via-cobalt-500 to-electric-cyan flex items-center justify-center shadow-glow-cobalt">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-wider font-display text-white uppercase flex items-center">
                  COBALT<span className="text-electric-cyan ml-1.5 font-light">SKIES</span>
                </span>
                <span className="block text-[10px] tracking-widest text-cobalt-400 font-mono -mt-1 uppercase">
                  National College Fest 2026
                </span>
              </div>
            </Link>

            <p className="text-slate-400 max-w-sm leading-relaxed text-sm">
              The premier national techno-cultural and gaming festival. Uniting over 10,000 students across 150+ institutions for 3 days of innovation, musical spectacles, and high-voltage esports tournaments.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-navy-850 border border-cobalt-500/30 flex items-center justify-center text-slate-300 hover:text-electric-cyan hover:border-electric-cyan transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-navy-850 border border-cobalt-500/30 flex items-center justify-center text-slate-300 hover:text-electric-cyan hover:border-electric-cyan transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-navy-850 border border-cobalt-500/30 flex items-center justify-center text-slate-300 hover:text-electric-cyan hover:border-electric-cyan transition-colors"
              >
                <Discord className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-navy-850 border border-cobalt-500/30 flex items-center justify-center text-slate-300 hover:text-electric-cyan hover:border-electric-cyan transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold tracking-wider font-display text-sm uppercase">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-electric-cyan transition-colors">Home</Link>
              </li>
              <li>
                <a href="/#about" className="hover:text-electric-cyan transition-colors">About Cobalt Skies</a>
              </li>
              <li>
                <Link to="/events" className="hover:text-electric-cyan transition-colors">Fest Events</Link>
              </li>
              <li>
                <Link to="/games" className="hover:text-electric-cyan transition-colors">Gaming Tournaments</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-electric-cyan transition-colors">My Registrations</Link>
              </li>
            </ul>
          </div>

          {/* Event Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold tracking-wider font-display text-sm uppercase">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/events?category=Technical" className="hover:text-electric-cyan transition-colors">Technical & Hackathons</Link>
              </li>
              <li>
                <Link to="/events?category=Music+%26+Dance" className="hover:text-electric-cyan transition-colors">Battle of Bands</Link>
              </li>
              <li>
                <Link to="/events?category=Cultural" className="hover:text-electric-cyan transition-colors">Fashion Walk & Nukkad</Link>
              </li>
              <li>
                <Link to="/games?category=Esports+(PC)" className="hover:text-electric-cyan transition-colors">Valorant LAN</Link>
              </li>
              <li>
                <Link to="/games?category=Mobile+Gaming" className="hover:text-electric-cyan transition-colors">BGMI Warzone</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold tracking-wider font-display text-sm uppercase">Fest Secretariat</h4>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-cobalt-400 mt-1 flex-shrink-0" />
                <span>Royal Crest Campus, University Blvd, Tech City – 560100</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-cobalt-400 flex-shrink-0" />
                <a href="mailto:support@cobaltskies.com" className="hover:text-electric-cyan">support@cobaltskies.com</a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-cobalt-400 flex-shrink-0" />
                <span>+91 98765 43210 / 11</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-cobalt-500/10 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-4 md:space-y-0">
          <p>© 2026 COBALT SKIES. All rights reserved. Managed by Student Festival Council.</p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 mx-1 fill-rose-500" /> for Collegiate Excellence
            </span>
            <Link to="/admin" className="hover:text-slate-400 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
