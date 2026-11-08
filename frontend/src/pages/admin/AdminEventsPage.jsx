import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import { useNotification } from '../../context/NotificationContext';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Calendar,
  MapPin,
  Users,
  Eye,
  ExternalLink,
} from 'lucide-react';

export const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical',
    shortDescription: '',
    description: '',
    posterUrl: '',
    fee: 100,
    isTeam: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    date: 'Nov 21, 2026',
    time: '10:00 AM - 04:00 PM',
    venue: 'Campus Tech Block',
    rules: '',
    eligibility: 'Open to all undergraduate and postgraduate college students.',
    prizesFirst: '₹20,000 + Trophy',
    prizesSecond: '₹10,000 + Certificate',
    prizesThird: '₹5,000',
    registrationOpen: true,
    isFeatured: false,
  });

  const [formLoading, setFormLoading] = useState(false);
  const { showToast } = useNotification();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventService.getAll({ search, category: categoryFilter });
      if (res.success) setEvents(res.data);
    } catch (err) {
      showToast('Failed to load events list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search, categoryFilter]);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      category: 'Technical',
      shortDescription: '',
      description: '',
      posterUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      fee: 100,
      isTeam: false,
      minTeamSize: 1,
      maxTeamSize: 1,
      date: 'Nov 21, 2026',
      time: '10:00 AM - 04:00 PM',
      venue: 'Auditorium 1',
      rules: '1. Valid ID required\n2. Maintain decorum\n3. Decisions of judges are final',
      eligibility: 'Open to all registered university students.',
      prizesFirst: '₹20,000 + Trophy',
      prizesSecond: '₹10,000 + Certificate',
      prizesThird: '₹5,000',
      registrationOpen: true,
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingEvent(evt);
    setFormData({
      title: evt.title,
      category: evt.category,
      shortDescription: evt.shortDescription,
      description: evt.description,
      posterUrl: evt.posterUrl,
      fee: evt.fee,
      isTeam: evt.isTeam,
      minTeamSize: evt.minTeamSize,
      maxTeamSize: evt.maxTeamSize,
      date: evt.date,
      time: evt.time,
      venue: evt.venue,
      rules: Array.isArray(evt.rules) ? evt.rules.join('\n') : '',
      eligibility: evt.eligibility || '',
      prizesFirst: evt.prizes?.first || '',
      prizesSecond: evt.prizes?.second || '',
      prizesThird: evt.prizes?.third || '',
      registrationOpen: evt.registrationOpen,
      isFeatured: evt.isFeatured,
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const payload = {
      title: formData.title,
      category: formData.category,
      shortDescription: formData.shortDescription,
      description: formData.description,
      posterUrl: formData.posterUrl,
      fee: Number(formData.fee),
      isTeam: formData.isTeam,
      minTeamSize: formData.isTeam ? Number(formData.minTeamSize) : 1,
      maxTeamSize: formData.isTeam ? Number(formData.maxTeamSize) : 1,
      date: formData.date,
      time: formData.time,
      venue: formData.venue,
      rules: formData.rules.split('\n').filter(Boolean),
      eligibility: formData.eligibility,
      prizes: {
        first: formData.prizesFirst,
        second: formData.prizesSecond,
        third: formData.prizesThird,
      },
      registrationOpen: formData.registrationOpen,
      isFeatured: formData.isFeatured,
    };

    try {
      if (editingEvent) {
        await eventService.update(editingEvent._id, payload);
        showToast('Event updated successfully!', 'success');
      } else {
        await eventService.create(payload);
        showToast('New event created successfully!', 'success');
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      showToast(err.message || 'Error saving event', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete event: "${title}"?`)) {
      try {
        await eventService.delete(id);
        showToast('Event deleted successfully', 'success');
        fetchEvents();
      } catch (err) {
        showToast('Failed to delete event', 'error');
      }
    }
  };

  const handleToggleRegistration = async (evt) => {
    try {
      await eventService.update(evt._id, { registrationOpen: !evt.registrationOpen });
      showToast(`Registration ${!evt.registrationOpen ? 'opened' : 'closed'} for ${evt.title}`, 'info');
      fetchEvents();
    } catch (err) {
      showToast('Failed to toggle status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-display">Manage Fest Events</h1>
          <p className="text-xs text-slate-400">Add, edit, or configure registration fees and rules for all festival events.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-cobalt-600 hover:bg-cobalt-500 text-white text-xs font-bold shadow-glow-cobalt transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title or venue..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-navy-900 border border-cobalt-500/25 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-electric-cyan"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-navy-900 border border-cobalt-500/25 text-slate-300 text-xs focus:outline-none focus:border-electric-cyan"
        >
          <option value="All">All Categories</option>
          <option value="Technical">Technical</option>
          <option value="Cultural">Cultural</option>
          <option value="Literary">Literary</option>
          <option value="Fine Arts">Fine Arts</option>
          <option value="Management">Management</option>
          <option value="Music & Dance">Music & Dance</option>
          <option value="Workshop">Workshop</option>
        </select>
      </div>

      {/* Events Table */}
      <div className="rounded-2xl bg-navy-850 border border-cobalt-500/20 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-900 border-b border-cobalt-500/20 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Event</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Fee (INR)</th>
                <th className="px-5 py-3.5">Format</th>
                <th className="px-5 py-3.5">Registrations</th>
                <th className="px-5 py-3.5">Reg Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cobalt-500/10">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-slate-500 font-mono">
                    Loading events...
                  </td>
                </tr>
              ) : events.length > 0 ? (
                events.map((evt) => (
                  <tr key={evt._id} className="hover:bg-navy-800/40 transition-colors">
                    <td className="px-5 py-3.5 flex items-center space-x-3">
                      <img
                        src={evt.posterUrl}
                        alt={evt.title}
                        className="w-10 h-10 rounded-lg object-cover bg-navy-950 flex-shrink-0"
                      />
                      <div>
                        <span className="font-bold text-white block">{evt.title}</span>
                        <span className="text-[10px] text-slate-400">{evt.venue}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-navy-900 border border-cobalt-500/30 text-cobalt-300">
                        {evt.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold font-mono text-white">
                      {evt.fee === 0 ? 'FREE' : `₹${evt.fee}`}
                    </td>
                    <td className="px-5 py-3.5">
                      {evt.isTeam ? `Team (${evt.minTeamSize}-${evt.maxTeamSize})` : 'Solo'}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-electric-cyan font-bold">
                      {evt.currentRegistrations || 0}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggleRegistration(evt)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                          evt.registrationOpen
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900'
                            : 'bg-rose-950 text-rose-300 border border-rose-500/30 hover:bg-rose-900'
                        }`}
                      >
                        {evt.registrationOpen ? 'Open (Click to close)' : 'Closed (Click to open)'}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(evt)}
                        className="p-1.5 rounded-lg bg-navy-900 hover:bg-cobalt-900 text-cobalt-300 transition-colors"
                        title="Edit Event"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(evt._id, evt.title)}
                        className="p-1.5 rounded-lg bg-navy-900 hover:bg-rose-950 text-rose-400 transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-slate-500">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-navy-850 border border-cobalt-500/30 shadow-2xl p-6 overflow-hidden my-6">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-cobalt-500/20">
              <h3 className="text-base font-bold text-white font-display">
                {editingEvent ? 'Edit Fest Event' : 'Create New Fest Event'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white focus:outline-none focus:border-electric-cyan"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white focus:outline-none focus:border-electric-cyan"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Literary">Literary</option>
                    <option value="Fine Arts">Fine Arts</option>
                    <option value="Management">Management</option>
                    <option value="Music & Dance">Music & Dance</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Poster Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.posterUrl}
                  onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white focus:outline-none focus:border-electric-cyan"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Short Description (Max 250 chars) *</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white focus:outline-none focus:border-electric-cyan"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Detailed Description *</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white focus:outline-none focus:border-electric-cyan"
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Entry Fee (INR) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.fee}
                    onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white focus:outline-none focus:border-electric-cyan"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Date *</label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white focus:outline-none focus:border-electric-cyan"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Time Schedule *</label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white focus:outline-none focus:border-electric-cyan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Venue *</label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white focus:outline-none focus:border-electric-cyan"
                  />
                </div>
                <div className="flex items-center space-x-4 pt-5">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isTeam}
                      onChange={(e) => setFormData({ ...formData, isTeam: e.target.checked })}
                      className="rounded bg-navy-950 border-cobalt-500/30 text-cobalt-600"
                    />
                    <span className="text-white font-semibold">Team Event?</span>
                  </label>

                  {formData.isTeam && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="2"
                        max="20"
                        value={formData.maxTeamSize}
                        onChange={(e) => setFormData({ ...formData, maxTeamSize: e.target.value })}
                        className="w-16 px-2 py-1 rounded bg-navy-950 border border-cobalt-500/30 text-white text-center"
                        title="Max team size"
                      />
                      <span className="text-slate-400">max size</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Rules (One per line)</label>
                <textarea
                  rows="3"
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white focus:outline-none focus:border-electric-cyan"
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">1st Prize</label>
                  <input
                    type="text"
                    value={formData.prizesFirst}
                    onChange={(e) => setFormData({ ...formData, prizesFirst: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-navy-950 border border-cobalt-500/30 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">2nd Prize</label>
                  <input
                    type="text"
                    value={formData.prizesSecond}
                    onChange={(e) => setFormData({ ...formData, prizesSecond: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-navy-950 border border-cobalt-500/30 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">3rd Prize</label>
                  <input
                    type="text"
                    value={formData.prizesThird}
                    onChange={(e) => setFormData({ ...formData, prizesThird: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-navy-950 border border-cobalt-500/30 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.registrationOpen}
                    onChange={(e) => setFormData({ ...formData, registrationOpen: e.target.checked })}
                    className="rounded bg-navy-950 border-cobalt-500/30 text-cobalt-600"
                  />
                  <span className="text-white">Registrations Active</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded bg-navy-950 border-cobalt-500/30 text-cobalt-600"
                  />
                  <span className="text-amber-400">Show on Home Page (Featured)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-cobalt-500/20 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-950 border border-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 rounded-xl bg-cobalt-600 hover:bg-cobalt-500 text-white font-bold"
                >
                  {formLoading ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEventsPage;
