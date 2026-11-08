import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { useNotification } from '../../context/NotificationContext';
import {
  Users,
  CalendarDays,
  Gamepad2,
  Ticket,
  CreditCard,
  TrendingUp,
  Download,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useNotification();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        showToast('Failed to load dashboard metrics', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [showToast]);

  const handleExportRegs = async () => {
    try {
      await adminService.exportRegistrationsCSV();
      showToast('Registrations CSV exported successfully!', 'success');
    } catch (err) {
      showToast('Export failed', 'error');
    }
  };

  const handleExportPayments = async () => {
    try {
      await adminService.exportPaymentsCSV();
      showToast('Payments CSV exported successfully!', 'success');
    } catch (err) {
      showToast('Export failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-cobalt-500/30 border-t-electric-cyan rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-400 font-mono">Aggregating fest analytics...</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Top Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-display">Administrator Command Center</h1>
          <p className="text-xs text-slate-400">Live festival registrations, transaction reconciliations, and ticket revenue.</p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportRegs}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-navy-850 hover:bg-navy-800 border border-cobalt-500/30 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cobalt-400" />
            <span>Export Registrations CSV</span>
          </button>
          <button
            onClick={handleExportPayments}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-navy-850 hover:bg-navy-800 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Payments CSV</span>
          </button>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-navy-850 border border-cobalt-500/20 space-y-1">
          <div className="flex items-center justify-between text-cobalt-400">
            <span className="text-[10px] font-mono uppercase">Total Users</span>
            <Users className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-white font-display">{stats.totalUsers}</p>
          <p className="text-[10px] text-slate-400">Registered delegates</p>
        </div>

        <div className="p-4 rounded-2xl bg-navy-850 border border-cobalt-500/20 space-y-1">
          <div className="flex items-center justify-between text-electric-cyan">
            <span className="text-[10px] font-mono uppercase">Events</span>
            <CalendarDays className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-white font-display">{stats.totalEvents}</p>
          <p className="text-[10px] text-slate-400">Published categories</p>
        </div>

        <div className="p-4 rounded-2xl bg-navy-850 border border-cobalt-500/20 space-y-1">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-[10px] font-mono uppercase">Games</span>
            <Gamepad2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-white font-display">{stats.totalGames}</p>
          <p className="text-[10px] text-slate-400">Esports tournaments</p>
        </div>

        <div className="p-4 rounded-2xl bg-navy-850 border border-cobalt-500/20 space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[10px] font-mono uppercase">Registrations</span>
            <Ticket className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-white font-display">{stats.totalRegistrations}</p>
          <p className="text-[10px] text-slate-400">
            {stats.eventRegsCount} Evt / {stats.gameRegsCount} Gam
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-navy-850 border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[10px] font-mono uppercase">Paid Transactions</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-display">
            {stats.successfulPaymentsCount}
          </p>
          <p className="text-[10px] text-slate-400">{stats.pendingPaymentsCount} Pending / Cart</p>
        </div>

        <div className="p-4 rounded-2xl bg-navy-850 border border-cobalt-500/40 space-y-1 shadow-glow-cobalt">
          <div className="flex items-center justify-between text-electric-cyan">
            <span className="text-[10px] font-mono uppercase font-bold">Total Revenue</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-white font-display">₹{stats.totalRevenue}</p>
          <p className="text-[10px] text-emerald-400 font-bold">100% Verified UPI & Gateway</p>
        </div>
      </div>

      {/* Top Revenue Generators & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Revenue items */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-navy-850 border border-cobalt-500/20 space-y-4">
          <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-electric-cyan" />
            <span>Top Revenue Generating Competitions</span>
          </h3>

          <div className="space-y-3">
            {stats.topRevenueItems && stats.topRevenueItems.length > 0 ? (
              stats.topRevenueItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-navy-900 border border-cobalt-500/15 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-navy-950 text-cobalt-400 border border-cobalt-500/20">
                      {item.type}
                    </span>
                    <h4 className="text-xs font-bold text-white pt-1">{item.title}</h4>
                    <p className="text-[10px] text-slate-400">{item.ticketsSold} paid entries</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-electric-cyan font-mono">
                      ₹{item.revenue}
                    </span>
                    <span className="block text-[10px] text-slate-500">Collected</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No revenue data available yet.</p>
            )}
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="p-6 rounded-2xl bg-navy-850 border border-cobalt-500/20 space-y-4">
          <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
            Quick Actions
          </h3>

          <div className="space-y-2.5">
            <Link
              to="/admin/events"
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-navy-900 hover:bg-cobalt-950/40 border border-cobalt-500/25 text-slate-200 text-xs font-semibold transition-colors"
            >
              <span>Create New Fest Event</span>
              <Plus className="w-4 h-4 text-cobalt-400" />
            </Link>

            <Link
              to="/admin/games"
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-electric-cyan/30 text-slate-200 text-xs font-semibold transition-colors"
            >
              <span>Add Esports / Arcade Game</span>
              <Plus className="w-4 h-4 text-electric-cyan" />
            </Link>

            <Link
              to="/admin/registrations"
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-cobalt-500/25 text-slate-200 text-xs font-semibold transition-colors"
            >
              <span>Review Participant Passes</span>
              <Ticket className="w-4 h-4 text-amber-400" />
            </Link>

            <Link
              to="/admin/payments"
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-cobalt-500/25 text-slate-200 text-xs font-semibold transition-colors"
            >
              <span>Audit Payments Ledger</span>
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Registrations Table */}
      <div className="p-6 rounded-2xl bg-navy-850 border border-cobalt-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
            Recent Registrations (Live Feed)
          </h3>
          <Link
            to="/admin/registrations"
            className="text-xs text-cobalt-400 hover:text-white transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-900 border-b border-cobalt-500/20 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Reg ID</th>
                <th className="px-4 py-3">Lead Delegate</th>
                <th className="px-4 py-3">Competition</th>
                <th className="px-4 py-3">Fee</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Registered At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cobalt-500/10 font-mono text-[11px]">
              {stats.recentRegistrations && stats.recentRegistrations.length > 0 ? (
                stats.recentRegistrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-navy-800/40">
                    <td className="px-4 py-3 font-bold text-electric-cyan">{reg.registrationId}</td>
                    <td className="px-4 py-3 font-sans text-white font-medium">
                      {reg.participantName}
                      <span className="block text-[10px] text-slate-400">{reg.participantCollege}</span>
                    </td>
                    <td className="px-4 py-3 font-sans text-slate-200">{reg.itemTitle}</td>
                    <td className="px-4 py-3 font-bold text-white">₹{reg.totalFee}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          reg.paymentStatus === 'PAID'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {reg.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 uppercase text-slate-300">{reg.registrationStatus}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-slate-500 font-sans">
                    No registrations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
