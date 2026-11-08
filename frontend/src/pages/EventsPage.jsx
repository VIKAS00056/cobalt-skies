import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import EventCard from '../components/events/EventCard';
import EventFilters from '../components/events/EventFilters';
import RegistrationModal from '../components/registration/RegistrationModal';
import { eventService } from '../services/eventService';
import { Calendar, Search, Sparkles, Frown } from 'lucide-react';

export const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [type, setType] = useState('all');
  const [sort, setSort] = useState('recent');

  // Modal registration state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await eventService.getAll({
          search,
          category,
          type,
          sort,
        });
        if (response.success) {
          setEvents(response.data);
        }
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchEvents, 250);
    return () => clearTimeout(timer);
  }, [search, category, type, sort]);

  const handleRegister = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-cobalt-950/80 border border-cobalt-500/30 text-electric-cyan uppercase">
          Cobalt Skies Competitions
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white font-display uppercase tracking-tight">
          Fest Events
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Explore technical hackathons, cultural spectacles, management battles, and literary face-offs. Register solo or assemble your collegiate squad.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <EventFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        type={type}
        setType={setType}
        sort={sort}
        setSort={setSort}
      />

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-navy-850/40 border border-cobalt-500/10 h-80 animate-pulse p-4 space-y-4"
            >
              <div className="w-full h-40 bg-navy-900 rounded-xl"></div>
              <div className="w-2/3 h-5 bg-navy-900 rounded"></div>
              <div className="w-full h-10 bg-navy-900 rounded"></div>
            </div>
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onRegisterClick={handleRegister}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-8 rounded-3xl bg-navy-850/50 border border-cobalt-500/20 max-w-md mx-auto space-y-4">
          <Frown className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No matching events found</h3>
          <p className="text-xs text-slate-400">
            Try adjusting your search query, selecting "All" categories, or resetting the filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setType('all');
            }}
            className="px-4 py-2 rounded-xl bg-cobalt-600 hover:bg-cobalt-500 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Registration Modal */}
      {selectedEvent && (
        <RegistrationModal
          item={selectedEvent}
          itemType="Event"
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
          onSuccess={() => {
            // Success
          }}
        />
      )}
    </div>
  );
};

export default EventsPage;
