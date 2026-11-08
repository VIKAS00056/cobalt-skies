import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  MapPin,
  Trophy,
  Flame,
  Gamepad2,
  Users,
  Music,
  Code2,
  Award,
  Zap,
  CheckCircle,
  HelpCircle,
  Mail,
  Phone,
} from 'lucide-react';
import CountdownTimer from '../components/common/CountdownTimer';
import EventCard from '../components/events/EventCard';
import GameCard from '../components/games/GameCard';
import RegistrationModal from '../components/registration/RegistrationModal';
import { eventService } from '../services/eventService';
import { gameService } from '../services/gameService';

export const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Registration modal state
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState('Event');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [eventsRes, gamesRes] = await Promise.all([
          eventService.getAll({ featured: true }),
          gameService.getAll({ featured: true }),
        ]);

        if (eventsRes.success) {
          setFeaturedEvents(eventsRes.data.slice(0, 4));
        }
        if (gamesRes.success) {
          setFeaturedGames(gamesRes.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleOpenRegistration = (item, type = 'Event') => {
    setSelectedItem(item);
    setSelectedType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-24 md:space-y-32 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-8 pb-16 px-4">
        {/* Futuristic glowing ambient background */}
        <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cobalt-600/20 blur-[130px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-[450px] h-[350px] bg-electric-cyan/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Fest Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-navy-850/80 border border-cobalt-500/40 shadow-glow-cobalt backdrop-blur-md animate-in fade-in slide-in-from-top-4">
            <span className="w-2 h-2 rounded-full bg-electric-cyan animate-ping"></span>
            <span className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase">
              National Techno-Cultural & Esports Fest
            </span>
          </div>

          {/* Large Heading */}
          <div className="space-y-3">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black font-display tracking-tight text-white uppercase">
              COBALT{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan via-cobalt-400 to-cobalt-600 text-glow-cobalt">
                SKIES
              </span>
            </h1>
            <p className="text-lg sm:text-2xl font-light text-slate-300 font-display tracking-wide max-w-2xl mx-auto">
              Ignite The Celestial Pulse • 2026 Edition
            </p>
          </div>

          {/* Venue & Date Pill */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-medium text-slate-300">
            <div className="flex items-center space-x-2 bg-navy-850/70 border border-cobalt-500/30 px-4 py-2 rounded-xl backdrop-blur-md">
              <Calendar className="w-4 h-4 text-electric-cyan" />
              <span>November 20 - 22, 2026</span>
            </div>
            <div className="flex items-center space-x-2 bg-navy-850/70 border border-cobalt-500/30 px-4 py-2 rounded-xl backdrop-blur-md">
              <MapPin className="w-4 h-4 text-cobalt-400" />
              <span>Royal Crest Campus & Amphitheatre</span>
            </div>
            <div className="flex items-center space-x-2 bg-navy-850/70 border border-amber-500/30 px-4 py-2 rounded-xl backdrop-blur-md text-amber-300">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>₹5,00,000+ Prize Pool</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/events"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cobalt-600 to-cobalt-700 hover:from-cobalt-500 hover:to-cobalt-600 text-white shadow-glow-cobalt hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>Explore 40+ Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/games"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-navy-850 hover:bg-navy-800 text-slate-100 border border-electric-cyan/40 hover:border-electric-cyan shadow-glass transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Gamepad2 className="w-4 h-4 text-electric-cyan" />
              <span>Enter Arcade (Games)</span>
            </Link>
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white transition-colors"
            >
              Register Account
            </Link>
          </div>

          {/* 2. COUNTDOWN TIMER */}
          <div className="pt-8">
            <p className="text-xs font-mono font-bold tracking-widest text-cobalt-400 uppercase mb-4">
              Fest Countdown to Blastoff
            </p>
            <CountdownTimer targetDate="2026-11-20T10:00:00" />
          </div>
        </div>
      </section>

      {/* 3. ABOUT THE FEST */}
      <section id="about" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cobalt-950/80 border border-cobalt-500/30 text-electric-cyan text-xs font-mono uppercase">
              <Flame className="w-3.5 h-3.5" />
              <span>The Cobalt Phenomenon</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black font-display text-white leading-tight">
              Where Innovation Meets Pure Euphoria.
            </h2>

            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              <strong>COBALT SKIES</strong> is not just another college fest—it is an electric celebration of student creativity, technical mastery, and athletic prowess. Across 72 non-stop hours, collegiate champions from across India descend onto our state-of-the-art campus to compete, collaborate, and create memories of a lifetime.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-navy-850 border border-cobalt-500/20">
                <span className="text-2xl sm:text-3xl font-extrabold text-electric-cyan font-display">40+</span>
                <p className="text-xs text-slate-400 mt-1">Fest Competitions</p>
              </div>
              <div className="p-4 rounded-2xl bg-navy-850 border border-cobalt-500/20">
                <span className="text-2xl sm:text-3xl font-extrabold text-cobalt-400 font-display">15+</span>
                <p className="text-xs text-slate-400 mt-1">Esports Tournaments</p>
              </div>
              <div className="p-4 rounded-2xl bg-navy-850 border border-cobalt-500/20">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display">₹5L+</span>
                <p className="text-xs text-slate-400 mt-1">Prize Rewards</p>
              </div>
              <div className="p-4 rounded-2xl bg-navy-850 border border-cobalt-500/20">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-display">10K+</span>
                <p className="text-xs text-slate-400 mt-1">Footfall Expected</p>
              </div>
            </div>
          </div>

          {/* Interactive Artwork Grid */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-cobalt-500/30 shadow-2xl relative group">
              <img
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"
                alt="Cobalt Skies Grand Stage"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-navy-900/80 backdrop-blur-md border border-cobalt-500/30">
                <p className="text-xs font-mono text-electric-cyan uppercase">Star Celebrity Pro-Nites</p>
                <h4 className="text-base font-bold text-white font-display mt-0.5">
                  Live EDM & Bollywood Music Spectacles Under the Stars
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED EVENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 space-y-4 md:space-y-0">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-electric-cyan uppercase">
              Curated Highlights
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mt-1">
              Featured Fest Events
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-cobalt-400 hover:text-white transition-colors"
          >
            <span>View All 40+ Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onRegisterClick={(evt) => handleOpenRegistration(evt, 'Event')}
            />
          ))}
        </div>
      </section>

      {/* 5. FEATURED GAMES */}
      <section className="relative py-16 bg-gradient-to-b from-transparent via-navy-950/70 to-transparent border-y border-cobalt-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 space-y-4 md:space-y-0">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-electric-cyan uppercase flex items-center space-x-1.5">
                <Gamepad2 className="w-4 h-4" />
                <span>Cobalt Arcade & Esports Coliseum</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mt-1">
                Featured Gaming Tournaments
              </h2>
            </div>
            <Link
              to="/games"
              className="inline-flex items-center space-x-2 text-sm font-semibold text-electric-cyan hover:text-white transition-colors"
            >
              <span>Explore All Games & Brackets</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredGames.map((game) => (
              <GameCard
                key={game._id}
                game={game}
                onRegisterClick={(gm) => handleOpenRegistration(gm, 'Game')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY PARTICIPATE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold tracking-widest text-electric-cyan uppercase">
            Value Proposition
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mt-1">
            Why Compete at Cobalt Skies?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-navy-850/80 border border-cobalt-500/20 space-y-3 hover:border-cobalt-400/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cobalt-600/30 border border-cobalt-500/40 flex items-center justify-center text-electric-cyan">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">Substantial Cash & Trophies</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every tournament offers verified cash prizes, custom engraved trophies, and direct bank/UPI disbursements to victorious teams.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-navy-850/80 border border-cobalt-500/20 space-y-3 hover:border-cobalt-400/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cobalt-600/30 border border-cobalt-500/40 flex items-center justify-center text-electric-cyan">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">National Prestige & CV Credentials</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official certificates validated by university leadership, backed with digital QR verification acceptable for university credits and job portfolios.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-navy-850/80 border border-cobalt-500/20 space-y-3 hover:border-cobalt-400/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cobalt-600/30 border border-cobalt-500/40 flex items-center justify-center text-electric-cyan">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">Unrivaled Networking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interact with startup founders, VC judges, music directors, and tech leads hiring student interns directly from the competitions.
            </p>
          </div>
        </div>
      </section>

      {/* 7. SPONSORS & PARTNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
            Powered By Industry Leaders
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
            Festival Sponsors & Partners
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 items-center opacity-80 hover:opacity-100 transition-opacity">
          {[
            'NVIDIA GeForce',
            'Razorpay Payments',
            'Red Bull Energy',
            'GitHub Education',
            'Alienware Gaming',
            'Intel Core Ultra',
          ].map((sponsor, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-navy-850/50 border border-cobalt-500/15 text-center text-xs font-bold text-slate-300 font-mono tracking-wider hover:border-cobalt-400/40 transition-colors"
            >
              {sponsor}
            </div>
          ))}
        </div>
      </section>

      {/* 8. CONTACT & HELPLINE */}
      <section id="contact" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-navy-850 border border-cobalt-500/30 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold tracking-widest text-electric-cyan uppercase">
                Got Questions?
              </span>
              <h2 className="text-3xl font-black text-white font-display">
                Need Help with Registrations?
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Our student core committee and faculty convenors are available 24/7 to assist with outstation accommodation, event rules, and payment receipts.
              </p>

              <div className="space-y-2 pt-2 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-cobalt-400" />
                  <span>General Queries: +91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-cobalt-400" />
                  <span>Esports Desk: +91 98765 43211</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-cobalt-400" />
                  <span>support@cobaltskies.com</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-navy-900 border border-cobalt-500/20 space-y-4">
              <h4 className="text-sm font-bold text-white font-display">Drop Us a Quick Message</h4>
              <input
                type="text"
                placeholder="Your Full Name"
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-cobalt-500/25 text-white text-xs focus:outline-none focus:border-electric-cyan"
              />
              <input
                type="email"
                placeholder="College Email Address"
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-cobalt-500/25 text-white text-xs focus:outline-none focus:border-electric-cyan"
              />
              <textarea
                rows="3"
                placeholder="Describe your inquiry or accommodation request..."
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-cobalt-500/25 text-white text-xs focus:outline-none focus:border-electric-cyan"
              ></textarea>
              <button
                type="button"
                onClick={() => alert('Thank you! Our student coordinator will reach out to you shortly.')}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-cobalt-600 hover:bg-cobalt-500 text-white shadow-glow-cobalt transition-colors"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Universal Registration Modal */}
      {selectedItem && (
        <RegistrationModal
          item={selectedItem}
          itemType={selectedType}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedItem(null);
          }}
          onSuccess={() => {
            // refresh data if needed
          }}
        />
      )}
    </div>
  );
};

export default HomePage;
