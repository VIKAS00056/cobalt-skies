import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export const EventCard = ({ event, onRegisterClick }) => {
  const isFree = event.fee === 0;

  return (
    <div className="group rounded-2xl bg-navy-850/70 border border-cobalt-500/20 backdrop-blur-md overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-cobalt-400/50 hover:shadow-glow-cobalt hover:-translate-y-1">
      {/* Top Banner & Badges */}
      <div className="relative aspect-[16/9] overflow-hidden bg-navy-950">
        <img
          src={event.posterUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent"></div>

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cobalt-950/80 border border-cobalt-500/40 text-electric-cyan backdrop-blur-md">
            {event.category}
          </span>
          {event.isFeatured && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 border border-amber-400/40 text-amber-300 backdrop-blur-md">
              Featured
            </span>
          )}
        </div>

        {/* Entry Fee Floating Pill */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1 rounded-xl text-sm font-bold bg-navy-900/90 border border-cobalt-400/50 text-white backdrop-blur-md shadow-lg flex items-center">
            {isFree ? (
              <span className="text-emerald-400 font-extrabold">FREE ENTRY</span>
            ) : (
              <span>₹{event.fee}</span>
            )}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-electric-cyan transition-colors line-clamp-1 font-display">
            {event.title}
          </h3>

          <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {event.shortDescription}
          </p>

          {/* Metadata Grid */}
          <div className="mt-4 pt-3 border-t border-cobalt-500/15 space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-cobalt-400 flex-shrink-0" />
              <span className="truncate">{event.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-cobalt-400 flex-shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-3.5 h-3.5 text-cobalt-400 flex-shrink-0" />
              <span>
                {event.isTeam
                  ? `Team (${event.minTeamSize} - ${event.maxTeamSize} Members)`
                  : 'Solo Participation'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-cobalt-500/15 flex items-center space-x-2">
          <Link
            to={`/events/${event.slug}`}
            className="flex-1 text-center py-2 px-3 rounded-xl bg-navy-950/80 hover:bg-cobalt-950/80 border border-cobalt-500/30 text-xs font-semibold text-slate-200 transition-colors"
          >
            Details
          </Link>
          <button
            onClick={() => onRegisterClick && onRegisterClick(event)}
            disabled={!event.registrationOpen}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-1 ${
              event.registrationOpen
                ? 'bg-gradient-to-r from-cobalt-600 to-cobalt-700 hover:from-cobalt-500 hover:to-cobalt-600 text-white shadow-glow-cobalt'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>{event.registrationOpen ? 'Register' : 'Closed'}</span>
            {event.registrationOpen && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
