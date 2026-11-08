import React from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Technical',
  'Cultural',
  'Literary',
  'Fine Arts',
  'Management',
  'Music & Dance',
  'Workshop',
];

export const EventFilters = ({
  search,
  setSearch,
  category,
  setCategory,
  type,
  setType,
  sort,
  setSort,
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Top Search & Dropdown Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title, description, or venue..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-navy-850/80 border border-cobalt-500/25 text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan transition-all"
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

        {/* Participation Type Selector */}
        <div className="flex rounded-xl bg-navy-850/80 border border-cobalt-500/25 p-1 text-xs font-semibold">
          <button
            onClick={() => setType('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              type === 'all'
                ? 'bg-cobalt-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => setType('solo')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              type === 'solo'
                ? 'bg-cobalt-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Solo
          </button>
          <button
            onClick={() => setType('team')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              type === 'team'
                ? 'bg-cobalt-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Team
          </button>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-navy-850/80 border border-cobalt-500/25 text-slate-200 text-xs font-medium focus:outline-none focus:border-electric-cyan"
          >
            <option value="recent">Sort: Newest</option>
            <option value="fee-low">Fee: Low to High</option>
            <option value="fee-high">Fee: High to Low</option>
            <option value="popular">Most Popular</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-medium">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl transition-all duration-200 ${
              category === cat
                ? 'bg-gradient-to-r from-cobalt-600 to-cobalt-700 text-white shadow-glow-cobalt border border-cobalt-400/40 font-semibold'
                : 'bg-navy-850/60 hover:bg-navy-800 text-slate-400 hover:text-slate-200 border border-cobalt-500/15'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventFilters;
