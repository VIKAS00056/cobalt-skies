import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gameService } from '../services/gameService';
import RegistrationModal from '../components/registration/RegistrationModal';
import {
  Gamepad2,
  Monitor,
  Users,
  Trophy,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Share2,
  Sparkles,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const GameDetailsPage = () => {
  const { identifier } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await gameService.getById(identifier);
        if (response.success && response.data) {
          setGame(response.data);
        }
      } catch (error) {
        showToast('Tournament not found or failed to load', 'error');
        navigate('/games');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [identifier, navigate, showToast]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: game.title,
        text: game.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tournament link copied to clipboard!', 'success');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-electric-cyan/30 border-t-electric-cyan rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!game) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/games"
          className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-slate-400 hover:text-electric-cyan transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Arcade Coliseum</span>
        </Link>
      </div>

      {/* Cyber Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden aspect-[21/9] min-h-[300px] border border-electric-cyan/40 shadow-2xl">
        <img
          src={game.posterUrl}
          alt={game.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-black/80 border border-electric-cyan/40 text-slate-300 hover:text-white backdrop-blur-md transition-colors"
            title="Share Tournament"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-wrap gap-2 mb-2 font-mono">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-black/90 text-electric-cyan border border-electric-cyan/50 flex items-center space-x-1">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>{game.category}</span>
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-black/90 text-white border border-electric-cyan/50">
              Entry Fee: ₹{game.fee}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-display uppercase tracking-wider">
            {game.title}
          </h1>
        </div>
      </div>

      {/* Spec Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-navy-950 border border-electric-cyan/30 shadow-glass">
        <div className="space-y-1">
          <span className="text-[11px] text-electric-cyan font-mono flex items-center space-x-1">
            <Monitor className="w-3.5 h-3.5" />
            <span>PLATFORM</span>
          </span>
          <p className="text-xs sm:text-sm font-bold text-white font-mono truncate">{game.platform}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-electric-cyan font-mono flex items-center space-x-1">
            <Users className="w-3.5 h-3.5" />
            <span>ROSTER SIZE</span>
          </span>
          <p className="text-xs sm:text-sm font-bold text-white font-mono">
            {game.isTeam ? `${game.playersPerTeam} Players / Squad` : 'Solo Duel'}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-electric-cyan font-mono flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>DATE</span>
          </span>
          <p className="text-xs sm:text-sm font-bold text-white font-mono">{game.date}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-electric-cyan font-mono flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>ARENA VENUE</span>
          </span>
          <p className="text-xs sm:text-sm font-bold text-white font-mono truncate">{game.venue}</p>
        </div>
      </div>

      {/* Main Details and Sidebars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white font-display">Tournament Overview</h2>
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-navy-950/70 p-6 rounded-2xl border border-electric-cyan/20">
              {game.description}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white font-display">Format & Structure</h2>
            <div className="p-4 rounded-xl bg-navy-950/70 border border-electric-cyan/20 text-xs sm:text-sm text-slate-300 font-mono">
              {game.format}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white font-display">Tournament Rules & Fair Play</h2>
            <div className="p-6 rounded-2xl bg-navy-950/70 border border-electric-cyan/20 space-y-3">
              {game.rules && game.rules.length > 0 ? (
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  {game.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <span className="w-5 h-5 rounded-md bg-electric-cyan/20 border border-electric-cyan text-electric-cyan flex-shrink-0 flex items-center justify-center text-xs font-mono font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">Official tournament rules apply.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Prizes Card */}
          <div className="p-6 rounded-2xl bg-navy-950 border border-electric-cyan/30 space-y-4">
            <div className="flex items-center space-x-2 text-electric-cyan">
              <Trophy className="w-5 h-5" />
              <h3 className="text-base font-bold text-white font-display">Tournament Prize Pool</h3>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black border border-electric-cyan/40 flex items-center justify-between">
                <span className="font-bold text-electric-cyan">CHAMPIONS</span>
                <span className="text-white font-semibold">{game.prizes?.first || 'Trophy + Cash'}</span>
              </div>
              <div className="p-3 rounded-xl bg-black border border-slate-700 flex items-center justify-between">
                <span className="font-bold text-slate-300">RUNNERS-UP</span>
                <span className="text-white font-semibold">{game.prizes?.second || 'Plaque + Cash'}</span>
              </div>
              {game.prizes?.third && (
                <div className="p-3 rounded-xl bg-black border border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-slate-400">3RD PLACE</span>
                  <span className="text-white font-semibold">{game.prizes.third}</span>
                </div>
              )}
            </div>
          </div>

          {/* Registration CTA card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-navy-950 to-black border border-electric-cyan/40 space-y-4 shadow-glass">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 block font-mono">Entry Slot Fee</span>
                <span className="text-2xl font-black text-white font-mono">₹{game.fee}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                {game.registrationOpen ? 'Slots Open' : 'Full'}
              </span>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!game.registrationOpen}
              className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider font-mono transition-all duration-200 flex items-center justify-center space-x-2 ${
                game.registrationOpen
                  ? 'bg-gradient-to-r from-cyan-500 via-cobalt-600 to-cobalt-700 hover:from-cyan-400 hover:to-cobalt-600 text-white shadow-glow-cyan'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <span>{game.registrationOpen ? 'Book Tournament Slot' : 'Slots Filled'}</span>
              {game.registrationOpen && <Sparkles className="w-4 h-4" />}
            </button>
          </div>

          {/* Coordinators */}
          {game.coordinators && game.coordinators.length > 0 && (
            <div className="p-5 rounded-2xl bg-navy-950 border border-electric-cyan/20 space-y-3">
              <h4 className="text-xs font-mono font-bold text-electric-cyan uppercase">Esports Marshals</h4>
              <div className="space-y-2 text-xs">
                {game.coordinators.map((coord, idx) => (
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
        item={game}
        itemType="Game"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default GameDetailsPage;
