import React, { useState, useEffect } from 'react';
import { registrationService } from '../../services/registrationService';
import { adminService } from '../../services/adminService';
import { useNotification } from '../../context/NotificationContext';
import {
  Search,
  Download,
  Filter,
  Eye,
  XCircle,
  X,
  Users,
  CheckCircle2,
  Calendar,
  CreditCard,
  QrCode,
} from 'lucide-react';

export const AdminRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [itemType, setItemType] = useState('All');
  const [paymentStatus, setPaymentStatus] = useState('All');
  const [registrationStatus, setRegistrationStatus] = useState('All');

  // Selected registration modal
  const [selectedReg, setSelectedReg] = useState(null);

  const { showToast } = useNotification();

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await registrationService.getAll({
        search,
        itemType,
        paymentStatus,
        registrationStatus,
      });
      if (res.success) setRegistrations(res.data);
    } catch (err) {
      showToast('Failed to load registrations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchRegistrations, 250);
    return () => clearTimeout(timer);
  }, [search, itemType, paymentStatus, registrationStatus]);

  const handleExportCSV = async () => {
    try {
      await adminService.exportRegistrationsCSV();
      showToast('Registrations exported as CSV!', 'success');
    } catch (err) {
      showToast('Failed to export CSV', 'error');
    }
  };

  const handleCancelReg = async (id, regId) => {
    if (window.confirm(`Are you sure you want to cancel registration ${regId}?`)) {
      try {
        await registrationService.cancel(id);
        showToast(`Registration ${regId} cancelled`, 'info');
        fetchRegistrations();
        if (selectedReg && selectedReg._id === id) {
          setSelectedReg(null);
        }
      } catch (err) {
        showToast('Failed to cancel registration', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-display">Manage Registrations</h1>
          <p className="text-xs text-slate-400">Search attendees, inspect team rosters, audit payment verification, and issue cancellations.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-navy-850 hover:bg-navy-800 border border-cobalt-500/30 text-slate-200 text-xs font-semibold transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-cobalt-400" />
          <span>Export All as CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative sm:col-span-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name, email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-navy-900 border border-cobalt-500/25 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-electric-cyan"
          />
        </div>

        <div>
          <select
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-cobalt-500/25 text-slate-300 text-xs focus:outline-none focus:border-electric-cyan"
          >
            <option value="All">All Types (Events & Games)</option>
            <option value="Event">Fest Events Only</option>
            <option value="Game">Esports / Games Only</option>
          </select>
        </div>

        <div>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-cobalt-500/25 text-slate-300 text-xs focus:outline-none focus:border-electric-cyan"
          >
            <option value="All">All Payment Statuses</option>
            <option value="PAID">PAID</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>

        <div>
          <select
            value={registrationStatus}
            onChange={(e) => setRegistrationStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-cobalt-500/25 text-slate-300 text-xs focus:outline-none focus:border-electric-cyan"
          >
            <option value="All">All Registration Statuses</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-navy-850 border border-cobalt-500/20 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-900 border-b border-cobalt-500/20 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Registration ID</th>
                <th className="px-5 py-3.5">Lead Participant</th>
                <th className="px-5 py-3.5">Competition</th>
                <th className="px-5 py-3.5">Team Format</th>
                <th className="px-5 py-3.5">Fee Paid</th>
                <th className="px-5 py-3.5">Payment</th>
                <th className="px-5 py-3.5">Pass Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cobalt-500/10 font-mono text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-5 py-8 text-center text-slate-500 font-mono">
                    Loading registrations...
                  </td>
                </tr>
              ) : registrations.length > 0 ? (
                registrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-navy-800/40 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-electric-cyan">{reg.registrationId}</td>
                    <td className="px-5 py-3.5 font-sans">
                      <span className="font-bold text-white block">{reg.participantName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{reg.participantPhone}</span>
                    </td>
                    <td className="px-5 py-3.5 font-sans">
                      <span className="text-slate-200 block font-medium">{reg.itemTitle}</span>
                      <span className="text-[10px] font-mono text-cobalt-400 uppercase">{reg.itemType}</span>
                    </td>
                    <td className="px-5 py-3.5 font-sans">
                      {reg.isTeam ? (
                        <span className="text-electric-cyan font-medium">
                          {reg.teamName} ({reg.teamMembers?.length ? reg.teamMembers.length + 1 : 1})
                        </span>
                      ) : (
                        <span className="text-slate-400">Solo</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-white">₹{reg.totalFee}</td>
                    <td className="px-5 py-3.5">
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
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          reg.registrationStatus === 'CONFIRMED'
                            ? 'bg-cobalt-950 text-cobalt-300 border border-cobalt-500/30'
                            : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {reg.registrationStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedReg(reg)}
                        className="p-1.5 rounded-lg bg-navy-900 hover:bg-cobalt-900 text-cobalt-300 transition-colors"
                        title="View Full Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {reg.registrationStatus !== 'CANCELLED' && (
                        <button
                          onClick={() => handleCancelReg(reg._id, reg.registrationId)}
                          className="p-1.5 rounded-lg bg-navy-900 hover:bg-rose-950 text-rose-400 transition-colors"
                          title="Cancel Registration"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-5 py-8 text-center text-slate-500 font-sans">
                    No registrations match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Details Inspection Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-navy-850 border border-cobalt-500/30 shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-cobalt-500/20">
              <div>
                <span className="text-[10px] font-mono text-electric-cyan font-bold uppercase block">
                  {selectedReg.itemType} Pass Details
                </span>
                <h3 className="text-base font-bold text-white font-display">
                  {selectedReg.registrationId}
                </h3>
              </div>
              <button onClick={() => setSelectedReg(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-navy-900 border border-cobalt-500/20 space-y-1.5">
                <p className="text-slate-400 text-[11px] font-mono uppercase">Competition</p>
                <h4 className="text-sm font-bold text-white font-display">{selectedReg.itemTitle}</h4>
                <div className="flex justify-between text-slate-300 pt-1">
                  <span>Fee: ₹{selectedReg.totalFee}</span>
                  <span className="font-bold text-emerald-400">Payment: {selectedReg.paymentStatus}</span>
                </div>
              </div>

              {/* Lead Details */}
              <div className="p-3.5 rounded-xl bg-navy-900 border border-cobalt-500/20 space-y-1">
                <p className="text-slate-400 text-[11px] font-mono uppercase">Lead Participant</p>
                <p className="text-white font-bold">{selectedReg.participantName}</p>
                <p className="text-slate-300">{selectedReg.participantEmail} • {selectedReg.participantPhone}</p>
                <p className="text-slate-400 text-[11px]">{selectedReg.participantCollege} (USN: {selectedReg.participantUsn || 'N/A'})</p>
              </div>

              {/* Team Members if Team */}
              {selectedReg.isTeam && (
                <div className="p-3.5 rounded-xl bg-navy-900 border border-cobalt-500/20 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-slate-400 text-[11px] font-mono uppercase">Team Squad</p>
                    <span className="text-electric-cyan font-bold">{selectedReg.teamName}</span>
                  </div>

                  {selectedReg.teamMembers && selectedReg.teamMembers.length > 0 ? (
                    <div className="space-y-1.5 divide-y divide-cobalt-500/10">
                      {selectedReg.teamMembers.map((m, idx) => (
                        <div key={idx} className="pt-1.5 first:pt-0">
                          <p className="font-semibold text-white">#{idx + 2} {m.name}</p>
                          <p className="text-[10px] text-slate-400">{m.email} • {m.phone}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500">No additional members added.</p>
                  )}
                </div>
              )}

              {/* Payment Info */}
              {selectedReg.payment && (
                <div className="p-3 rounded-xl bg-navy-950 border border-cobalt-500/20 font-mono text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Ref:</span>
                    <span className="text-white">{selectedReg.payment.paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Razorpay Order:</span>
                    <span className="text-white">{selectedReg.payment.razorpayOrderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Razorpay Payment ID:</span>
                    <span className="text-emerald-400">{selectedReg.payment.razorpayPaymentId || 'N/A'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              {selectedReg.registrationStatus !== 'CANCELLED' && (
                <button
                  onClick={() => handleCancelReg(selectedReg._id, selectedReg.registrationId)}
                  className="px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-xs font-bold transition-colors"
                >
                  Cancel Registration
                </button>
              )}
              <button
                onClick={() => setSelectedReg(null)}
                className="px-4 py-2 rounded-xl bg-navy-900 border border-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRegistrationsPage;
