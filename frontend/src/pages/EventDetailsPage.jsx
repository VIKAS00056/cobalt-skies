import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import RegistrationModal from '../components/registration/RegistrationModal';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  ShieldAlert,
  ArrowLeft,
  Share2,
  Sparkles,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const EventDetailsPage = () => {
  const { identifier } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventService.getById(identifier);
        if (response.success && response.data) {
          setEvent(response.data);
        }
      } catch (error) {
        showToast('Event not found or failed to load', 'error');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [identifier, navigate, showToast]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Event link copied to clipboard!', 'success');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cobalt-500/30 border-t-electric-cyan rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/events"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>

      {/* Hero Poster Banner */}
      <div className="relative rounded-3xl overflow-hidden aspect-[21/9] min-h-[300px] border border-cobalt-500/30 shadow-2xl">
        <img
          src={event.posterUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent"></div>

        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-navy-900/80 border border-cobalt-500/30 text-slate-300 hover:text-white backdrop-blur-md transition-colors"
            title="Share Event"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cobalt-950 text-electric-cyan border border-cobalt-500/40">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-navy-900 text-white border border-cobalt-500/40">
              {event.fee === 0 ? 'FREE ENTRY' : `Entry Fee: ₹${event.fee}`}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-display">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-navy-850/80 border border-cobalt-500/20 shadow-glass">
        <div className="space-y-1">
          <span className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-cobalt-400" />
            <span>DATE</span>
          </span>
          <p className="text-sm font-bold text-white">{event.date}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-cobalt-400" />
            <span>TIME SCHEDULE</span>
          </span>
          <p className="text-sm font-bold text-white">{event.time}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-cobalt-400" />
            <span>VENUE</span>
          </span>
          <p className="text-sm font-bold text-white truncate">{event.venue}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
            <Users className="w-3.5 h-3.5 text-cobalt-400" />
            <span>TEAM FORMAT</span>
          </span>
          <p className="text-sm font-bold text-white">
            {event.isTeam ? `${event.minTeamSize} - ${event.maxTeamSize} Members` : 'Solo'}
          </p>
        </div>
      </div>

      {/* Main Details & Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Detailed Overview */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white font-display">Event Description</h2>
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-navy-850/50 p-6 rounded-2xl border border-cobalt-500/15">
              {event.description}
            </div>
          </div>

          {/* Rules and Regulations */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white font-display">Rules & Regulations</h2>
            <div className="p-6 rounded-2xl bg-navy-850/50 border border-cobalt-500/15 space-y-3">
              {event.rules && event.rules.length > 0 ? (
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  {event.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <span className="w-5 h-5 rounded-full bg-cobalt-950 border border-cobalt-500/30 text-electric-cyan flex-shrink-0 flex items-center justify-center text-xs font-mono font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">Standard college festival rules apply.</p>
              )}
            </div>
          </div>

          {/* Eligibility */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white font-display">Eligibility Criteria</h2>
            <div className="p-4 rounded-xl bg-navy-850/50 border border-cobalt-500/15 text-xs text-slate-300">
              {event.eligibility}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Prizes & Register CTA */}
        <div className="space-y-6">
          {/* Cash Prizes Card */}
          <div className="p-6 rounded-2xl bg-navy-850 border border-cobalt-500/25 space-y-4">
            <div className="flex items-center space-x-2 text-amber-400">
              <Trophy className="w-5 h-5" />
              <h3 className="text-base font-bold text-white font-display">Prize Pool & Honors</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-navy-900 border border-amber-500/30 flex items-center justify-between">
                <span className="font-bold text-amber-300">1st Place</span>
                <span className="text-white font-semibold">{event.prizes?.first || 'Trophy + Cash'}</span>
              </div>
              <div className="p-3 rounded-xl bg-navy-900 border border-slate-700 flex items-center justify-between">
                <span className="font-bold text-slate-300">2nd Place</span>
                <span className="text-white font-semibold">{event.prizes?.second || 'Shield + Cash'}</span>
              </div>
              {event.prizes?.third && (
                <div className="p-3 rounded-xl bg-navy-900 border border-amber-800/30 flex items-center justify-between">
                  <span className="font-bold text-amber-600">3rd Place</span>
                  <span className="text-white font-semibold">{event.prizes.third}</span>
                </div>
              )}
            </div>
          </div>

          {/* Registration CTA card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-navy-850 to-navy-900 border border-cobalt-500/30 space-y-4 shadow-glass">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 block">Registration Fee</span>
                <span className="text-2xl font-extrabold text-white">
                  {event.fee === 0 ? 'FREE' : `₹${event.fee}`}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                {event.registrationOpen ? 'Open Now' : 'Closed'}
              </span>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!event.registrationOpen}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center space-x-2 ${
                event.registrationOpen
                  ? 'bg-gradient-to-r from-cobalt-600 to-cobalt-700 hover:from-cobalt-500 hover:to-cobalt-600 text-white shadow-glow-cobalt'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <span>{event.registrationOpen ? 'Register For This Event' : 'Registrations Closed'}</span>
              {event.registrationOpen && <Sparkles className="w-4 h-4" />}
            </button>
          </div>

          {/* Event Student Coordinators */}
          {event.coordinators && event.coordinators.length > 0 && (
            <div className="p-5 rounded-2xl bg-navy-850 border border-cobalt-500/20 space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">Student Coordinators</h4>
              <div className="space-y-2 text-xs">
                {event.coordinators.map((coord, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{coord.name}</p>
                      <p className="text-[10px] text-slate-400">{coord.role}</p>
                    </div>
                    <a
                      href={`tel:${coord.phone}`}
                      className="flex items-center space-x-1 text-electric-cyan hover:underline font-mono"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{coord.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        item={event}
        itemType="Event"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default EventDetailsPage;
