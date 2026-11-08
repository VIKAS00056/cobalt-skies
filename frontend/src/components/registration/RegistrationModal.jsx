import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { paymentService } from '../../services/paymentService';
import {
  X,
  Users,
  Plus,
  Trash2,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Smartphone,
} from 'lucide-react';

export const RegistrationModal = ({ item, itemType = 'Event', isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  // Registration form state
  const [teamName, setTeamName] = useState('');
  const [participantPhone, setParticipantPhone] = useState(user?.phone || '');
  const [participantCollege, setParticipantCollege] = useState(user?.college || '');
  const [participantUsn, setParticipantUsn] = useState(user?.usn || '');
  const [teamMembers, setTeamMembers] = useState([]);

  // Flow states: 'form' | 'processing' | 'simulated_payment' | 'confirmed'
  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [confirmationData, setConfirmationData] = useState(null);
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');

  if (!isOpen || !item) return null;

  const maxMembers = itemType === 'Event' ? item.maxTeamSize : item.playersPerTeam;
  const isTeam = item.isTeam;
  const fee = item.fee;

  const handleAddMember = () => {
    if (teamMembers.length + 1 >= maxMembers) {
      showToast(`Maximum team size for this event is ${maxMembers} members (including team lead).`, 'warning');
      return;
    }
    setTeamMembers([
      ...teamMembers,
      { name: '', email: '', phone: '', college: participantCollege, usn: '' },
    ]);
  };

  const handleRemoveMember = (index) => {
    setTeamMembers(teamMembers.filter((_, idx) => idx !== index));
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  // Step 1: Create Order on backend
  const handleSubmitRegistration = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please log in or create an account to register for events.', 'warning');
      navigate('/login');
      return;
    }

    if (isTeam && !teamName.trim()) {
      showToast('Please provide a team or squad name.', 'warning');
      return;
    }

    // Validate team members have names & emails
    for (let i = 0; i < teamMembers.length; i++) {
      if (!teamMembers[i].name || !teamMembers[i].email) {
        showToast(`Please enter name and email for Team Member #${i + 2}.`, 'warning');
        return;
      }
    }

    setLoading(true);

    try {
      const response = await paymentService.createOrder({
        itemType,
        itemId: item._id,
        teamName,
        teamMembers,
        participantPhone,
        participantCollege,
        participantUsn,
      });

      if (response.success && response.data) {
        setOrderData(response.data);

        // If item is completely free (₹0)
        if (response.data.isFree) {
          triggerSuccessConfetti();
          setConfirmationData(response.data);
          setStep('confirmed');
          if (onSuccess) onSuccess(response.data);
          return;
        }

        // Check if Razorpay script is loaded and live key configured
        if (window.Razorpay && !response.data.isTestMode && !response.data.key.includes('DEMO')) {
          launchRazorpayCheckout(response.data);
        } else {
          // Open interactive test mode UPI gateway
          setStep('simulated_payment');
        }
      }
    } catch (error) {
      showToast(error.message || 'Failed to initiate registration', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Launch official Razorpay checkout script
  const launchRazorpayCheckout = (data) => {
    const options = {
      key: data.key,
      amount: data.amount,
      currency: 'INR',
      name: 'COBALT SKIES 2026',
      description: `Registration for ${item.title}`,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=200&q=80',
      order_id: data.orderId,
      handler: async (paymentResponse) => {
        try {
          setLoading(true);
          const verifyRes = await paymentService.verifyPayment({
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            registrationId: data.registrationId,
            paymentMethod: 'UPI',
          });

          if (verifyRes.success) {
            triggerSuccessConfetti();
            setConfirmationData(verifyRes.data);
            setStep('confirmed');
            if (onSuccess) onSuccess(verifyRes.data);
          }
        } catch (err) {
          showToast(err.message || 'Payment signature verification failed', 'error');
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: participantPhone || user.phone,
      },
      notes: {
        registrationId: data.registrationId,
        itemType,
      },
      theme: {
        color: '#0047AB',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (failResponse) {
      showToast(`Payment failed: ${failResponse.error.description}`, 'error');
    });
    rzp.open();
  };

  // Complete simulated/test UPI payment with authentic server verification
  const handleSimulatedPayment = async () => {
    if (!orderData) return;
    setLoading(true);

    try {
      const simulatedPaymentId = `pay_sim_${Date.now().toString().slice(-6)}_${Math.random().toString(36).substring(2, 7)}`;
      const simulatedSignature = `sig_sim_${Date.now()}`;

      const verifyRes = await paymentService.verifyPayment({
        razorpay_order_id: orderData.orderId,
        razorpay_payment_id: simulatedPaymentId,
        razorpay_signature: simulatedSignature,
        registrationId: orderData.registrationId,
        paymentMethod: 'UPI',
      });

      if (verifyRes.success) {
        triggerSuccessConfetti();
        setConfirmationData(verifyRes.data);
        setStep('confirmed');
        if (onSuccess) onSuccess(verifyRes.data);
      }
    } catch (error) {
      showToast(error.message || 'Payment verification failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const triggerSuccessConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0047AB', '#00F0FF', '#38BDF8', '#FFFFFF', '#60A5FA'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-navy-850 border border-cobalt-500/30 shadow-2xl p-6 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Glow ambient header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cobalt-500 via-electric-cyan to-cobalt-600"></div>

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-cobalt-950/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: Registration Form */}
        {step === 'form' && (
          <div>
            <div className="mb-6">
              <span className="text-[11px] font-mono font-bold tracking-wider text-electric-cyan uppercase">
                {itemType} Registration
              </span>
              <h2 className="text-xl font-bold text-white font-display mt-0.5">{item.title}</h2>
              <div className="flex items-center space-x-3 mt-2 text-xs text-slate-300">
                <span className="text-electric-cyan font-bold text-sm">
                  {fee === 0 ? 'FREE' : `Entry Fee: ₹${fee}`}
                </span>
                <span>•</span>
                <span>{item.date}</span>
                <span>•</span>
                <span className="truncate">{item.venue}</span>
              </div>
            </div>

            <form onSubmit={handleSubmitRegistration} className="space-y-4">
              {/* Primary Participant info (Pre-filled) */}
              <div className="p-3.5 rounded-xl bg-navy-900 border border-cobalt-500/20 space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Lead Participant (You)
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">Name:</span>
                    <span className="text-slate-200 font-medium">{user?.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Email:</span>
                    <span className="text-slate-200 font-medium truncate block">{user?.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">WhatsApp Phone *</label>
                    <input
                      type="text"
                      required
                      value={participantPhone}
                      onChange={(e) => setParticipantPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-navy-950 border border-cobalt-500/30 text-white text-xs focus:outline-none focus:border-electric-cyan"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">College Name *</label>
                    <input
                      type="text"
                      required
                      value={participantCollege}
                      onChange={(e) => setParticipantCollege(e.target.value)}
                      placeholder="University / College"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-navy-950 border border-cobalt-500/30 text-white text-xs focus:outline-none focus:border-electric-cyan"
                    />
                  </div>
                </div>
              </div>

              {/* Team Event Details */}
              {isTeam && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-200 block mb-1">
                      Team / Squad Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. Cobalt Strikers"
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white text-xs focus:outline-none focus:border-electric-cyan"
                    />
                  </div>

                  {/* Team Members List */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">
                        Squad Members ({teamMembers.length + 1} / {maxMembers})
                      </span>
                      {teamMembers.length + 1 < maxMembers && (
                        <button
                          type="button"
                          onClick={handleAddMember}
                          className="flex items-center space-x-1 text-xs text-electric-cyan hover:text-white transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Teammate</span>
                        </button>
                      )}
                    </div>

                    {teamMembers.map((member, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-navy-900 border border-cobalt-500/20 space-y-2 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-cobalt-300">
                            Member #{idx + 2}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(idx)}
                            className="text-rose-400 hover:text-rose-300 text-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Full Name"
                            value={member.name}
                            onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg bg-navy-950 border border-cobalt-500/30 text-white text-xs focus:outline-none focus:border-electric-cyan"
                          />
                          <input
                            type="email"
                            required
                            placeholder="Email Address"
                            value={member.email}
                            onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg bg-navy-950 border border-cobalt-500/30 text-white text-xs focus:outline-none focus:border-electric-cyan"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Phone Number"
                            value={member.phone}
                            onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg bg-navy-950 border border-cobalt-500/30 text-white text-xs focus:outline-none focus:border-electric-cyan"
                          />
                          <input
                            type="text"
                            placeholder="USN / Student ID"
                            value={member.usn}
                            onChange={(e) => handleMemberChange(idx, 'usn', e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg bg-navy-950 border border-cobalt-500/30 text-white text-xs focus:outline-none focus:border-electric-cyan"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Calculation Bar */}
              <div className="pt-3 border-t border-cobalt-500/20 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Total Registration Fee</span>
                  <span className="text-xl font-extrabold text-white">
                    {fee === 0 ? 'FREE' : `₹${fee}`}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cobalt-600 to-cobalt-700 hover:from-cobalt-500 hover:to-cobalt-600 text-white shadow-glow-cobalt transition-all disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>{fee === 0 ? 'Confirm Free Registration' : 'Proceed to Pay'}</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: UPI Payment Gateway Simulator */}
        {step === 'simulated_payment' && orderData && (
          <div className="space-y-5">
            <div className="text-center">
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-cobalt-950 text-electric-cyan border border-cobalt-500/40">
                Razorpay UPI Gateway
              </span>
              <h3 className="text-lg font-bold text-white font-display mt-2">
                Scan UPI QR or Choose UPI App
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Transaction Reference: <span className="font-mono text-slate-200">{orderData.orderId}</span>
              </p>
            </div>

            {/* UPI QR Code Container */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white text-black max-w-xs mx-auto shadow-2xl">
              <div className="w-44 h-44 bg-slate-100 border-2 border-slate-900 rounded-xl flex flex-col items-center justify-center p-2 text-center">
                <QrCode className="w-28 h-28 text-slate-900" />
                <span className="text-[10px] font-mono font-bold mt-1 tracking-tighter">
                  cobaltskies2026@razorpay
                </span>
              </div>
              <div className="mt-3 text-center">
                <p className="text-xs font-bold text-slate-900 uppercase">Amount: ₹{item.fee}</p>
                <p className="text-[10px] text-slate-600 font-mono">Scan with any UPI App (GPay, PhonePe, Paytm)</p>
              </div>
            </div>

            {/* Popular UPI Apps Quick Select */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block text-center">
                Or Tap to Pay via UPI App:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'gpay', name: 'Google Pay', icon: '🟢' },
                  { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
                  { id: 'paytm', name: 'Paytm UPI', icon: '🔵' },
                  { id: 'bhim', name: 'BHIM UPI', icon: '🟠' },
                ].map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedUpiApp(app.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      selectedUpiApp === app.id
                        ? 'bg-cobalt-600/30 border-electric-cyan text-white shadow-glow-cobalt'
                        : 'bg-navy-900 border-cobalt-500/20 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-lg block mb-0.5">{app.icon}</span>
                    <span className="text-[10px] font-semibold block truncate">{app.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Verify & Complete Payment Action */}
            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="flex-1 py-2.5 rounded-xl bg-navy-900 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-navy-800"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSimulatedPayment}
                disabled={loading}
                className="flex-2 w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-lg shadow-emerald-950/50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Confirm UPI Payment (₹{item.fee})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Confirmed / Receipt screen */}
        {step === 'confirmed' && confirmationData && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                Registration Confirmed!
              </span>
              <h3 className="text-xl font-bold text-white font-display mt-2">
                You're in for {item.title}!
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                Your fest entry pass has been generated and linked to your student profile.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-navy-900 border border-cobalt-500/30 text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-cobalt-500/20 pb-2">
                <span className="text-slate-400">Registration ID:</span>
                <span className="text-electric-cyan font-bold">{confirmationData.registrationId}</span>
              </div>
              <div className="flex justify-between border-b border-cobalt-500/20 pb-2">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="text-white font-bold">₹{item.fee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-bold uppercase">PAID & VERIFIED</span>
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/dashboard');
                }}
                className="flex-1 py-2.5 rounded-xl bg-cobalt-600 hover:bg-cobalt-500 text-white font-bold text-xs shadow-glow-cobalt transition-colors"
              >
                View in My Dashboard
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-navy-900 border border-cobalt-500/30 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationModal;
