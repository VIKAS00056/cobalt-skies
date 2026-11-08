import React from 'react';
import { Search, Gamepad2, X } from 'lucide-react';

const GAME_CATEGORIES = [
  'All',
  'Esports (PC)',
  'Mobile Gaming',
  'Console Battle',
  'Arcade & Carnival',
  'Board & Strategy',
];

export const GameFilters = ({
  search,
  setSearch,
  category,
  setCategory,
  sort,
  setSort,
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Top Search & Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-electric-cyan" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search esports tournaments, platforms, or arenas..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-navy-950 border border-electric-cyan/30 text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan font-mono text-xs transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-navy-950 border border-electric-cyan/30 text-slate-200 text-xs font-mono focus:outline-none focus:border-electric-cyan"
          >
            <option value="recent">Sort: Featured</option>
            <option value="fee-low">Entry Fee: Low to High</option>
            <option value="fee-high">Entry Fee: High to Low</option>
            <option value="title">Game Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Arcade Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
        {GAME_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl transition-all duration-200 uppercase tracking-wider ${
              category === cat
                ? 'bg-electric-cyan text-black font-bold shadow-glow-cyan border border-electric-cyan'
                : 'bg-navy-950 text-slate-400 hover:text-slate-200 border border-electric-cyan/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameFilters;
