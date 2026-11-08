import React from 'react';
import { X, Printer, QrCode, Sparkles, CheckCircle2, ShieldCheck, MapPin, Calendar, Clock, Users } from 'lucide-react';

export const ReceiptModal = ({ registration, isOpen, onClose }) => {
  if (!isOpen || !registration) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-navy-900 border border-cobalt-500/40 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 print:m-0 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Modal Top Bar */}
        <div className="p-4 bg-navy-950 border-b border-cobalt-500/20 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-electric-cyan" />
            <span className="text-xs font-mono font-bold text-slate-200 uppercase">Official E-Ticket & Receipt</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cobalt-600 hover:bg-cobalt-500 text-white text-xs font-bold shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* E-Ticket Card Layout */}
        <div id="printable-ticket" className="p-6 md:p-8 space-y-6">
          {/* Header banner */}
          <div className="flex items-center justify-between border-b border-cobalt-500/20 pb-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-electric-cyan uppercase">
                National Fest 2026 Pass
              </span>
              <h2 className="text-2xl font-black text-white font-display uppercase tracking-wider">
                COBALT<span className="text-electric-cyan">SKIES</span>
              </h2>
              <p className="text-[11px] text-slate-400">Nov 20 - 22, 2026 • Royal Crest Campus</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 uppercase">
                {registration.paymentStatus === 'PAID' ? 'Verified Entry' : registration.paymentStatus}
              </span>
              <p className="text-xs font-mono font-bold text-slate-300 mt-1">
                {registration.registrationId}
              </p>
            </div>
          </div>

          {/* Event / Game Title */}
          <div className="p-4 rounded-2xl bg-navy-850/90 border border-cobalt-500/30">
            <span className="text-[10px] font-mono text-cobalt-400 uppercase tracking-wider">
              {registration.itemType}
            </span>
            <h3 className="text-lg font-bold text-white font-display mt-0.5">
              {registration.itemTitle}
            </h3>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-cobalt-500/20 text-xs text-slate-300">
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-cobalt-400" />
                <span>{registration.event?.date || registration.game?.date || 'Nov 2026'}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-cobalt-400" />
                <span>{registration.event?.time || registration.game?.time || 'Scheduled Slot'}</span>
              </div>
              <div className="col-span-2 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-cobalt-400 flex-shrink-0" />
                <span className="truncate">{registration.event?.venue || registration.game?.venue || 'Campus Arena'}</span>
              </div>
            </div>
          </div>

          {/* Participant & Team details */}
          <div className="space-y-3 text-xs">
            <h4 className="text-[11px] font-semibold font-mono text-slate-400 uppercase tracking-wider">
              Registration Information
            </h4>
            <div className="grid grid-cols-2 gap-3 bg-navy-850/60 p-3.5 rounded-xl border border-cobalt-500/20">
              <div>
                <span className="text-slate-400 block text-[10px]">Lead Participant:</span>
                <span className="text-white font-semibold">{registration.participantName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">WhatsApp Phone:</span>
                <span className="text-white font-semibold">{registration.participantPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">College:</span>
                <span className="text-white font-semibold truncate block">{registration.participantCollege}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Student USN:</span>
                <span className="text-white font-semibold">{registration.participantUsn || 'N/A'}</span>
              </div>

              {registration.isTeam && (
                <div className="col-span-2 pt-2 border-t border-cobalt-500/20">
                  <span className="text-slate-400 block text-[10px]">Team Name:</span>
                  <span className="text-electric-cyan font-bold text-sm">{registration.teamName}</span>
                  {registration.teamMembers && registration.teamMembers.length > 0 && (
                    <div className="mt-1 space-y-0.5 text-[11px] text-slate-300">
                      <span className="text-slate-400 text-[10px]">Roster:</span>{' '}
                      {registration.teamMembers.map((m) => m.name).join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* QR Code and Verification Strip */}
          <div className="p-4 rounded-2xl bg-white text-black flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-600 block">SECURITY CHECK PASS</span>
              <p className="text-xs font-black text-slate-900 mt-0.5">FEE PAID: ₹{registration.totalFee}</p>
              <p className="text-[9px] font-mono text-slate-500 mt-1">
                Txn Ref: {registration.payment?.razorpayPaymentId || registration.payment?.paymentId || 'UPI_CONFIRMED'}
              </p>
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 mt-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Authorized by Fest Council</span>
              </span>
            </div>
            <div className="w-20 h-20 bg-slate-100 border border-slate-300 rounded-xl flex items-center justify-center p-1">
              <QrCode className="w-16 h-16 text-slate-900" />
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-500 font-mono">
            Please show this digital pass with a valid college ID card at the entry gate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
