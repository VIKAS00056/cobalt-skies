import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { registrationService } from '../services/registrationService';
import { paymentService } from '../services/paymentService';
import ReceiptModal from '../components/common/ReceiptModal';
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  Ticket,
  Gamepad2,
  CreditCard,
  QrCode,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Printer,
  Sparkles,
} from 'lucide-react';

export const UserDashboardPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'events'; // 'events' | 'games' | 'payments'

  const [registrations, setRegistrations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected registration for e-ticket / receipt modal
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [regsRes, paysRes] = await Promise.all([
          registrationService.getMyRegistrations(),
          paymentService.getMyPayments(),
        ]);

        if (regsRes.success) setRegistrations(regsRes.data);
        if (paysRes.success) setPayments(paysRes.data);
      } catch (error) {
        showToast('Failed to load user registrations', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  const handleOpenReceipt = (reg) => {
    setSelectedReceipt(reg);
    setIsReceiptOpen(true);
  };

  const eventRegistrations = registrations.filter((r) => r.itemType === 'Event');
  const gameRegistrations = registrations.filter((r) => r.itemType === 'Game');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-navy-850/80 border border-cobalt-500/25 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cobalt-600/10 blur-[90px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cobalt-700 via-cobalt-600 to-electric-cyan flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-glow-cobalt uppercase">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
                  {user?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cobalt-950 text-electric-cyan border border-cobalt-500/30">
                  {user?.role === 'admin' ? 'Admin' : 'Verified Delegate'}
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center space-x-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-cobalt-400" />
                <span>{user?.college}</span>
                {user?.usn && <span className="font-mono text-slate-400">({user?.usn})</span>}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <Mail className="w-3 h-3 text-slate-500" />
                  <span>{user?.email}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-slate-500" />
                  <span>{user?.phone}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/events"
              className="px-4 py-2.5 rounded-xl bg-cobalt-600 hover:bg-cobalt-500 text-white text-xs font-bold shadow-glow-cobalt transition-colors"
            >
              Browse Events
            </Link>
            <Link
              to="/games"
              className="px-4 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 border border-electric-cyan/40 text-electric-cyan text-xs font-bold transition-colors"
            >
              Enter Arcade
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-cobalt-500/20 pb-2 text-xs font-semibold">
        <button
          onClick={() => setSearchParams({ tab: 'events' })}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
            activeTab === 'events'
              ? 'bg-cobalt-600/30 border border-cobalt-500/40 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-navy-850'
          }`}
        >
          <Ticket className="w-4 h-4 text-cobalt-400" />
          <span>My Events ({eventRegistrations.length})</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'games' })}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
            activeTab === 'games'
              ? 'bg-cobalt-600/30 border border-cobalt-500/40 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-navy-850'
          }`}
        >
          <Gamepad2 className="w-4 h-4 text-electric-cyan" />
          <span>My Tournaments ({gameRegistrations.length})</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'payments' })}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
            activeTab === 'payments'
              ? 'bg-cobalt-600/30 border border-cobalt-500/40 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-navy-850'
          }`}
        >
          <CreditCard className="w-4 h-4 text-emerald-400" />
          <span>Transactions ({payments.length})</span>
        </button>
      </div>

      {/* 3. Tab Content */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-cobalt-500/30 border-t-electric-cyan rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400 font-mono">Loading dashboard records...</p>
        </div>
      ) : (
        <div>
          {/* TAB: EVENT REGISTRATIONS */}
          {activeTab === 'events' && (
            <div>
              {eventRegistrations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {eventRegistrations.map((reg) => (
                    <div
                      key={reg._id}
                      className="p-6 rounded-2xl bg-navy-850/80 border border-cobalt-500/25 space-y-4 hover:border-cobalt-400/40 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-mono tracking-wider text-cobalt-400 uppercase">
                              {reg.registrationId}
                            </span>
                            <h3 className="text-lg font-bold text-white font-display mt-0.5">
                              {reg.itemTitle}
                            </h3>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                              reg.paymentStatus === 'PAID'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {reg.paymentStatus}
                          </span>
                        </div>

                        {/* Event Metadata */}
                        <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-cobalt-500/15">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3.5 h-3.5 text-cobalt-400 flex-shrink-0" />
                            <span>{reg.event?.date || 'Festival Dates'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-3.5 h-3.5 text-cobalt-400 flex-shrink-0" />
                            <span className="truncate">{reg.event?.venue || 'Campus Venue'}</span>
                          </div>
                          {reg.isTeam && (
                            <div className="pt-1">
                              <span className="text-[10px] text-slate-400 block">Squad:</span>
                              <span className="text-xs font-semibold text-electric-cyan">
                                {reg.teamName} ({reg.teamMembers?.length ? reg.teamMembers.length + 1 : 1} Members)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-4 border-t border-cobalt-500/15 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">Paid</span>
                          <span className="text-base font-extrabold text-white">₹{reg.totalFee}</span>
                        </div>
                        <button
                          onClick={() => handleOpenReceipt(reg)}
                          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-cobalt-600 hover:bg-cobalt-500 text-white text-xs font-bold shadow-sm transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>View Pass & Receipt</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 p-8 rounded-3xl bg-navy-850/40 border border-cobalt-500/20 max-w-md mx-auto space-y-4">
                  <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
                  <h3 className="text-base font-bold text-white">No Event Registrations Yet</h3>
                  <p className="text-xs text-slate-400">
                    You have not registered for any fest competitions. Explore our 40+ hackathons, dance battles, and fashion walks!
                  </p>
                  <Link
                    to="/events"
                    className="inline-block px-5 py-2.5 rounded-xl bg-cobalt-600 hover:bg-cobalt-500 text-white text-xs font-bold"
                  >
                    Explore Events
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB: GAME REGISTRATIONS */}
          {activeTab === 'games' && (
            <div>
              {gameRegistrations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {gameRegistrations.map((reg) => (
                    <div
                      key={reg._id}
                      className="p-6 rounded-2xl bg-navy-950 border border-electric-cyan/30 space-y-4 hover:border-electric-cyan/60 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-mono tracking-wider text-electric-cyan uppercase">
                              {reg.registrationId}
                            </span>
                            <h3 className="text-lg font-bold text-white font-display mt-0.5">
                              {reg.itemTitle}
                            </h3>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                              reg.paymentStatus === 'PAID'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {reg.paymentStatus}
                          </span>
                        </div>

                        {/* Game Metadata */}
                        <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-cobalt-500/20 font-mono">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3.5 h-3.5 text-electric-cyan flex-shrink-0" />
                            <span>{reg.game?.date || 'Festival Bracket Dates'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-3.5 h-3.5 text-electric-cyan flex-shrink-0" />
                            <span className="truncate">{reg.game?.venue || 'Esports Coliseum'}</span>
                          </div>
                          {reg.isTeam && (
                            <div className="pt-1">
                              <span className="text-[10px] text-slate-400 block">Clan / Squad:</span>
                              <span className="text-xs font-semibold text-electric-cyan">
                                {reg.teamName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-4 border-t border-cobalt-500/20 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">Fee Paid</span>
                          <span className="text-base font-extrabold text-white font-mono">₹{reg.totalFee}</span>
                        </div>
                        <button
                          onClick={() => handleOpenReceipt(reg)}
                          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cobalt-600 hover:from-cyan-400 hover:to-cobalt-600 text-white text-xs font-bold shadow-glow-cyan transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>View Tournament Pass</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 p-8 rounded-3xl bg-navy-950 border border-electric-cyan/20 max-w-md mx-auto space-y-4">
                  <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto" />
                  <h3 className="text-base font-bold text-white">No Tournaments Joined Yet</h3>
                  <p className="text-xs text-slate-400">
                    Enter the competitive coliseum! Join our Valorant, BGMI, FIFA 25, or Laser Tag arenas.
                  </p>
                  <Link
                    to="/games"
                    className="inline-block px-5 py-2.5 rounded-xl bg-electric-cyan text-black text-xs font-bold"
                  >
                    Enter Arcade
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB: PAYMENT HISTORY */}
          {activeTab === 'payments' && (
            <div className="rounded-2xl bg-navy-850/80 border border-cobalt-500/20 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-navy-900 border-b border-cobalt-500/20 text-slate-400 font-mono uppercase text-[11px]">
                    <tr>
                      <th className="px-5 py-3.5">Payment ID</th>
                      <th className="px-5 py-3.5">Razorpay Order ID</th>
                      <th className="px-5 py-3.5">Item Registered</th>
                      <th className="px-5 py-3.5">Amount</th>
                      <th className="px-5 py-3.5">Method</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cobalt-500/10 font-mono">
                    {payments.length > 0 ? (
                      payments.map((p) => (
                        <tr key={p._id} className="hover:bg-navy-800/40 transition-colors">
                          <td className="px-5 py-4 font-bold text-white">{p.paymentId}</td>
                          <td className="px-5 py-4 text-slate-400 truncate max-w-[150px]">{p.razorpayOrderId}</td>
                          <td className="px-5 py-4 text-slate-200 font-sans font-medium">{p.itemTitle}</td>
                          <td className="px-5 py-4 font-bold text-white">₹{p.amount}</td>
                          <td className="px-5 py-4 uppercase text-electric-cyan">{p.paymentMethod}</td>
                          <td className="px-5 py-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                p.status === 'SUCCESS'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-slate-400">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-5 py-8 text-center text-slate-500 font-sans">
                          No transaction records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Official Gate Pass E-Ticket Modal */}
      <ReceiptModal
        registration={selectedReceipt}
        isOpen={isReceiptOpen}
        onClose={() => {
          setIsReceiptOpen(false);
          setSelectedReceipt(null);
        }}
      />
    </div>
  );
};

export default UserDashboardPage;
