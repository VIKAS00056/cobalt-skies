import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GameCard from '../components/games/GameCard';
import GameFilters from '../components/games/GameFilters';
import RegistrationModal from '../components/registration/RegistrationModal';
import { gameService } from '../services/gameService';
import { Gamepad2, Trophy, Flame, Frown, Sparkles } from 'lucide-react';

export const GamesPage = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('recent');

  const [selectedGame, setSelectedGame] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const response = await gameService.getAll({
          search,
          category,
          sort,
        });
        if (response.success) {
          setGames(response.data);
        }
      } catch (error) {
        console.error('Failed to load games:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchGames, 250);
    return () => clearTimeout(timer);
  }, [search, category, sort]);

  const handleRegister = (game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Arcade / Esports Page Banner */}
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-r from-navy-950 via-navy-900 to-cobalt-950 border border-electric-cyan/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-electric-cyan/10 blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/80 border border-electric-cyan/40 text-electric-cyan text-xs font-mono font-bold uppercase">
            <Gamepad2 className="w-4 h-4" />
            <span>Cobalt Skies Arcade & Esports Arena</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-display uppercase tracking-tight">
            Gaming Tournaments
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Welcome to the dedicated competitive gaming arena. Lock into Valorant LAN brackets, BGMI Warzone battlefields, FIFA 25 console duels, and neon laser tag battles. High refresh rate rigs, live caster commentary, and massive cash prizes await.
          </p>
        </div>
      </div>

      {/* Cyber Filters */}
      <GameFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        sort={sort}
        setSort={setSort}
      />

      {/* Games Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-navy-950/40 border border-electric-cyan/10 h-80 animate-pulse p-4 space-y-4"
            >
              <div className="w-full h-40 bg-navy-900 rounded-xl"></div>
              <div className="w-2/3 h-5 bg-navy-900 rounded"></div>
              <div className="w-full h-10 bg-navy-900 rounded"></div>
            </div>
          ))}
        </div>
      ) : games.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard
              key={game._id}
              game={game}
              onRegisterClick={handleRegister}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-8 rounded-3xl bg-navy-950/60 border border-electric-cyan/20 max-w-md mx-auto space-y-4">
          <Frown className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No tournaments matched</h3>
          <p className="text-xs text-slate-400">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
            }}
            className="px-4 py-2 rounded-xl bg-electric-cyan text-black font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Registration Modal */}
      {selectedGame && (
        <RegistrationModal
          item={selectedGame}
          itemType="Game"
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedGame(null);
          }}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
};

export default GamesPage;
