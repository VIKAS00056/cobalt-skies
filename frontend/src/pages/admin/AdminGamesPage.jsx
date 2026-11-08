import React, { useState, useEffect } from 'react';
import { gameService } from '../../services/gameService';
import { useNotification } from '../../context/NotificationContext';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Gamepad2,
  Monitor,
  Users,
  Trophy,
  X,
} from 'lucide-react';

export const AdminGamesPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Esports (PC)',
    shortDescription: '',
    description: '',
    posterUrl: '',
    fee: 150,
    isTeam: true,
    playersPerTeam: 5,
    maxSlots: 32,
    date: 'Nov 20 - 21, 2026',
    time: '11:00 AM - 08:00 PM',
    venue: 'Esports Arena Hall',
    platform: 'PC / Dedicated LAN',
    format: 'Double Elimination Tournament Bracket',
    rules: '',
    prizesFirst: '₹25,000 + Trophy',
    prizesSecond: '₹12,000',
    prizesThird: '₹6,000',
    registrationOpen: true,
    isFeatured: true,
  });

  const [formLoading, setFormLoading] = useState(false);
  const { showToast } = useNotification();

  const fetchGames = async () => {
    setLoading(true);
    try {
      const res = await gameService.getAll({ search, category: categoryFilter });
      if (res.success) setGames(res.data);
    } catch (err) {
      showToast('Failed to load games list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [search, categoryFilter]);

  const handleOpenCreate = () => {
    setEditingGame(null);
    setFormData({
      title: '',
      category: 'Esports (PC)',
      shortDescription: '',
      description: '',
      posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      fee: 150,
      isTeam: true,
      playersPerTeam: 5,
      maxSlots: 32,
      date: 'Nov 20 - 21, 2026',
      time: '11:00 AM - 08:00 PM',
      venue: 'Esports Arena Hall',
      platform: 'PC / Dedicated LAN',
      format: 'Double Elimination Tournament Bracket',
      rules: '1. Strict anti-cheat monitoring\n2. Must report 15 mins prior to match\n3. Tournament marshal decisions are final',
      prizesFirst: '₹25,000 + Trophy',
      prizesSecond: '₹12,000',
      prizesThird: '₹6,000',
      registrationOpen: true,
      isFeatured: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (gm) => {
    setEditingGame(gm);
    setFormData({
      title: gm.title,
      category: gm.category,
      shortDescription: gm.shortDescription,
      description: gm.description,
      posterUrl: gm.posterUrl,
      fee: gm.fee,
      isTeam: gm.isTeam,
      playersPerTeam: gm.playersPerTeam,
      maxSlots: gm.maxSlots,
      date: gm.date,
      time: gm.time,
      venue: gm.venue,
      platform: gm.platform,
      format: gm.format,
      rules: Array.isArray(gm.rules) ? gm.rules.join('\n') : '',
      prizesFirst: gm.prizes?.first || '',
      prizesSecond: gm.prizes?.second || '',
      prizesThird: gm.prizes?.third || '',
      registrationOpen: gm.registrationOpen,
      isFeatured: gm.isFeatured,
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
      playersPerTeam: Number(formData.playersPerTeam),
      maxSlots: Number(formData.maxSlots),
      date: formData.date,
      time: formData.time,
      venue: formData.venue,
      platform: formData.platform,
      format: formData.format,
      rules: formData.rules.split('\n').filter(Boolean),
      prizes: {
        first: formData.prizesFirst,
        second: formData.prizesSecond,
        third: formData.prizesThird,
      },
      registrationOpen: formData.registrationOpen,
      isFeatured: formData.isFeatured,
    };

    try {
      if (editingGame) {
        await gameService.update(editingGame._id, payload);
        showToast('Tournament updated successfully!', 'success');
      } else {
        await gameService.create(payload);
        showToast('New tournament added successfully!', 'success');
      }
      setIsModalOpen(false);
      fetchGames();
    } catch (err) {
      showToast(err.message || 'Error saving tournament', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete tournament: "${title}"?`)) {
      try {
        await gameService.delete(id);
        showToast('Tournament deleted successfully', 'success');
        fetchGames();
      } catch (err) {
        showToast('Failed to delete tournament', 'error');
      }
    }
  };

  const handleToggleRegistration = async (gm) => {
    try {
      await gameService.update(gm._id, { registrationOpen: !gm.registrationOpen });
      showToast(`Slot registration ${!gm.registrationOpen ? 'opened' : 'closed'} for ${gm.title}`, 'info');
      fetchGames();
    } catch (err) {
      showToast('Failed to toggle status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-display">Manage Esports & Games</h1>
          <p className="text-xs text-slate-400">Manage tournament brackets, platforms, roster limits, and entry slots.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-electric-cyan hover:bg-cyan-400 text-black text-xs font-bold shadow-glow-cyan transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Game</span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-electric-cyan" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tournaments, platforms, or venues..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-navy-950 border border-electric-cyan/30 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-electric-cyan"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-navy-950 border border-electric-cyan/30 text-slate-300 text-xs focus:outline-none focus:border-electric-cyan"
        >
          <option value="All">All Categories</option>
          <option value="Esports (PC)">Esports (PC)</option>
          <option value="Mobile Gaming">Mobile Gaming</option>
          <option value="Console Battle">Console Battle</option>
          <option value="Arcade & Carnival">Arcade & Carnival</option>
          <option value="Board & Strategy">Board & Strategy</option>
        </select>
      </div>

      {/* Games Table */}
      <div className="rounded-2xl bg-navy-950 border border-electric-cyan/25 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 font-mono">
            <thead className="bg-black border-b border-electric-cyan/20 text-electric-cyan uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Tournament</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Platform</th>
                <th className="px-5 py-3.5">Fee</th>
                <th className="px-5 py-3.5">Roster</th>
                <th className="px-5 py-3.5">Slots Filled</th>
                <th className="px-5 py-3.5">Registration</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-electric-cyan/10">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-5 py-8 text-center text-slate-500">
                    Loading tournaments...
                  </td>
                </tr>
              ) : games.length > 0 ? (
                games.map((gm) => (
                  <tr key={gm._id} className="hover:bg-navy-900/40 transition-colors">
                    <td className="px-5 py-3.5 flex items-center space-x-3 font-sans">
                      <img
                        src={gm.posterUrl}
                        alt={gm.title}
                        className="w-10 h-10 rounded-lg object-cover bg-black flex-shrink-0"
                      />
                      <div>
                        <span className="font-bold text-white block">{gm.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{gm.venue}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-black border border-electric-cyan/30 text-electric-cyan">
                        {gm.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 text-[11px] truncate max-w-[140px]">
                      {gm.platform}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-white">₹{gm.fee}</td>
                    <td className="px-5 py-3.5">{gm.isTeam ? `${gm.playersPerTeam} Players` : 'Solo'}</td>
                    <td className="px-5 py-3.5 font-bold text-electric-cyan">
                      {gm.currentSlotsFilled || 0} / {gm.maxSlots}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggleRegistration(gm)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                          gm.registrationOpen
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900'
                            : 'bg-rose-950 text-rose-300 border border-rose-500/30 hover:bg-rose-900'
                        }`}
                      >
                        {gm.registrationOpen ? 'Open' : 'Full'}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(gm)}
                        className="p-1.5 rounded-lg bg-black hover:bg-navy-800 text-electric-cyan transition-colors"
                        title="Edit Game"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(gm._id, gm.title)}
                        className="p-1.5 rounded-lg bg-black hover:bg-rose-950 text-rose-400 transition-colors"
                        title="Delete Game"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-5 py-8 text-center text-slate-500 font-sans">
                    No games found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="relative w-full max-w-2xl rounded-2xl bg-navy-950 border border-electric-cyan/40 shadow-2xl p-6 overflow-hidden my-6">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-electric-cyan/20">
              <h3 className="text-base font-bold text-white font-display uppercase tracking-wider">
                {editingGame ? 'Edit Tournament' : 'Add Tournament Arena'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Game Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-electric-cyan/30 text-white focus:outline-none focus:border-electric-cyan font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-electric-cyan/30 text-white focus:outline-none focus:border-electric-cyan font-mono"
                  >
                    <option value="Esports (PC)">Esports (PC)</option>
                    <option value="Mobile Gaming">Mobile Gaming</option>
                    <option value="Console Battle">Console Battle</option>
                    <option value="Arcade & Carnival">Arcade & Carnival</option>
                    <option value="Board & Strategy">Board & Strategy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Platform Specs *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PC / LAN 240Hz"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-electric-cyan/30 text-white focus:outline-none focus:border-electric-cyan font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Poster Image URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.posterUrl}
                    onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-electric-cyan/30 text-white focus:outline-none focus:border-electric-cyan"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Tournament Format *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Double Elimination Tournament Bracket"
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-electric-cyan/30 text-white focus:outline-none focus:border-electric-cyan font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-electric-cyan/30 text-white focus:outline-none focus:border-electric-cyan"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Detailed Description *</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-electric-cyan/30 text-white focus:outline-none focus:border-electric-cyan"
                ></textarea>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Entry Fee (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.fee}
                    onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-electric-cyan/30 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Roster Size *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.playersPerTeam}
                    onChange={(e) => setFormData({ ...formData, playersPerTeam: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-electric-cyan/30 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Max Slots *</label>
                  <input
                    type="number"
                    min="2"
                    required
                    value={formData.maxSlots}
                    onChange={(e) => setFormData({ ...formData, maxSlots: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-electric-cyan/30 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Venue *</label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-electric-cyan/30 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Rules (One per line)</label>
                <textarea
                  rows="3"
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-electric-cyan/30 text-white focus:outline-none focus:border-electric-cyan"
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Champion Prize</label>
                  <input
                    type="text"
                    value={formData.prizesFirst}
                    onChange={(e) => setFormData({ ...formData, prizesFirst: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-electric-cyan/30 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Runner Up</label>
                  <input
                    type="text"
                    value={formData.prizesSecond}
                    onChange={(e) => setFormData({ ...formData, prizesSecond: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-electric-cyan/30 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">3rd Prize</label>
                  <input
                    type="text"
                    value={formData.prizesThird}
                    onChange={(e) => setFormData({ ...formData, prizesThird: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-electric-cyan/30 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-electric-cyan/20 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-black border border-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 rounded-xl bg-electric-cyan text-black font-bold shadow-glow-cyan"
                >
                  {formLoading ? 'Saving...' : editingGame ? 'Update Game' : 'Publish Game'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGamesPage;
