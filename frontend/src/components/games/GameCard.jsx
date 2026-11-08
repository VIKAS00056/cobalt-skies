import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Trophy, Users, Monitor, Calendar, MapPin, ArrowRight } from 'lucide-react';

export const GameCard = ({ game, onRegisterClick }) => {
  return (
    <div className="group rounded-2xl bg-gradient-to-b from-navy-850 to-navy-900 border border-electric-cyan/20 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-electric-cyan/60 hover:shadow-glow-cyan hover:-translate-y-1">
      {/* Top Media Banner */}
      <div className="relative aspect-[16/9] overflow-hidden bg-black">
        <img
          src={game.posterUrl}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-transparent"></div>

        {/* Top Floating Cyber Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-black/80 border border-electric-cyan/50 text-electric-cyan backdrop-blur-md flex items-center space-x-1">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>{game.category}</span>
          </span>
        </div>

        {/* Entry Fee Pill */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1 rounded-xl text-sm font-black bg-black/85 border border-electric-cyan/60 text-white backdrop-blur-md shadow-lg flex items-center space-x-1">
            <span className="text-electric-cyan">₹</span>
            <span>{game.fee}</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-extrabold text-white group-hover:text-electric-cyan transition-colors line-clamp-1 font-display tracking-wide">
            {game.title}
          </h3>

          <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {game.shortDescription}
          </p>

          {/* Tournament Specifications Matrix */}
          <div className="mt-4 pt-3 border-t border-cobalt-500/20 space-y-2 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <Monitor className="w-3.5 h-3.5 text-electric-cyan flex-shrink-0" />
              <span className="truncate text-slate-300 font-mono text-[11px]">{game.platform}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-3.5 h-3.5 text-electric-cyan flex-shrink-0" />
              <span>
                {game.isTeam
                  ? `Team Roster: ${game.playersPerTeam} Players`
                  : 'Solo 1v1 Battle'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-electric-cyan flex-shrink-0" />
              <span className="truncate">{game.venue}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-3 border-t border-cobalt-500/20 flex items-center space-x-2">
          <Link
            to={`/games/${game.slug}`}
            className="flex-1 text-center py-2 px-3 rounded-xl bg-navy-950 hover:bg-navy-800 border border-electric-cyan/30 text-xs font-semibold text-slate-200 transition-colors"
          >
            Rules & Bracket
          </Link>
          <button
            onClick={() => onRegisterClick && onRegisterClick(game)}
            disabled={!game.registrationOpen}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-1 ${
              game.registrationOpen
                ? 'bg-gradient-to-r from-cyan-500 via-cobalt-600 to-cobalt-700 hover:from-cyan-400 hover:to-cobalt-600 text-white shadow-glow-cyan'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>{game.registrationOpen ? 'Enter Arena' : 'Slots Full'}</span>
            {game.registrationOpen && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
