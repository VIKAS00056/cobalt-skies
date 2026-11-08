import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useNotification } from '../../context/NotificationContext';
import {
  CreditCard,
  Search,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';

export const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [itemType, setItemType] = useState('All');

  const { showToast } = useNotification();

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await adminService.getPayments({ search, status, itemType });
      if (res.success) setPayments(res.data);
    } catch (err) {
      showToast('Failed to load payments ledger', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchPayments, 250);
    return () => clearTimeout(timer);
  }, [search, status, itemType]);

  const handleExportCSV = async () => {
    try {
      await adminService.exportPaymentsCSV();
      showToast('Payments ledger exported as CSV!', 'success');
    } catch (err) {
      showToast('Export failed', 'error');
    }
  };

  const totalCollected = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-display">Payments Ledger</h1>
          <p className="text-xs text-slate-400">
            Real-time audit log of Razorpay orders, UPI payment signatures, and fee collections.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-navy-850 hover:bg-navy-800 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Payments CSV</span>
        </button>
      </div>

      {/* Summary Mini Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-navy-850 border border-cobalt-500/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Filtered Records</span>
            <p className="text-xl font-black text-white font-display">{payments.length}</p>
          </div>
          <CreditCard className="w-5 h-5 text-cobalt-400" />
        </div>

        <div className="p-4 rounded-xl bg-navy-850 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Successful Collections</span>
            <p className="text-xl font-black text-emerald-400 font-display">
              {payments.filter((p) => p.status === 'SUCCESS').length}
            </p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="p-4 rounded-xl bg-navy-850 border border-cobalt-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Filtered Revenue</span>
            <p className="text-xl font-black text-white font-display">₹{totalCollected}</p>
          </div>
          <TrendingUp className="w-5 h-5 text-electric-cyan" />
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payment ID, order ID, item..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-navy-900 border border-cobalt-500/25 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-electric-cyan"
          />
        </div>

        <div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-cobalt-500/25 text-slate-300 text-xs focus:outline-none focus:border-electric-cyan"
          >
            <option value="All">All Statuses</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="CREATED">CREATED (Pending Checkout)</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>

        <div>
          <select
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-cobalt-500/25 text-slate-300 text-xs focus:outline-none focus:border-electric-cyan"
          >
            <option value="All">All Items (Events & Games)</option>
            <option value="Event">Fest Events</option>
            <option value="Game">Gaming Tournaments</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl bg-navy-850 border border-cobalt-500/20 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 font-mono">
            <thead className="bg-navy-900 border-b border-cobalt-500/20 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Payment ID</th>
                <th className="px-5 py-3.5">Razorpay Order ID</th>
                <th className="px-5 py-3.5">Razorpay Payment ID</th>
                <th className="px-5 py-3.5">Participant</th>
                <th className="px-5 py-3.5">Item</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Method</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cobalt-500/10 text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-5 py-8 text-center text-slate-500 font-mono">
                    Loading payments ledger...
                  </td>
                </tr>
              ) : payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-navy-800/40 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-white">{p.paymentId}</td>
                    <td className="px-5 py-3.5 text-slate-400 truncate max-w-[130px]">{p.razorpayOrderId}</td>
                    <td className="px-5 py-3.5 text-electric-cyan truncate max-w-[130px]">
                      {p.razorpayPaymentId || 'N/A'}
                    </td>
                    <td className="px-5 py-3.5 font-sans">
                      <span className="font-semibold text-white block">{p.user?.name || 'Delegate'}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{p.user?.email}</span>
                    </td>
                    <td className="px-5 py-3.5 font-sans text-slate-200 truncate max-w-[160px]">
                      {p.itemTitle}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-white">₹{p.amount}</td>
                    <td className="px-5 py-3.5 text-slate-400 uppercase">{p.paymentMethod}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.status === 'SUCCESS'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : p.status === 'FAILED'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-5 py-8 text-center text-slate-500 font-sans">
                    No payment records found.
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

export default AdminPaymentsPage;
