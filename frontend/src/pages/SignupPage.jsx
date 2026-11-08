import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Sparkles,
  User,
  Mail,
  Phone,
  GraduationCap,
  BadgeAlert,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    usn: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-cobalt-400' };
    return { score: 4, label: 'Strong & Secure', color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match. Please verify.', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
        usn: formData.usn,
        password: formData.password,
      });

      showToast('Account registered successfully! Welcome to Cobalt Skies.', 'success');
      navigate('/dashboard');
    } catch (error) {
      showToast(error.message || 'Registration failed. Email may already be in use.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cobalt-600/15 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-lg space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cobalt-700 via-cobalt-500 to-electric-cyan flex items-center justify-center shadow-glow-cobalt">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black font-display text-white uppercase tracking-wider">
              COBALT<span className="text-electric-cyan">SKIES</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white font-display">Create Your Fest Account</h2>
          <p className="text-xs text-slate-400">
            Join thousands of student innovators and athletes competing at Cobalt Skies 2026
          </p>
        </div>

        {/* Signup Glass Card */}
        <div className="p-8 rounded-3xl bg-navy-850/80 border border-cobalt-500/30 backdrop-blur-xl shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Aarav Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-electric-cyan"
                />
              </div>
            </div>

            {/* Email and Phone grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@college.edu"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-electric-cyan"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  WhatsApp Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-electric-cyan"
                  />
                </div>
              </div>
            </div>

            {/* College & USN grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  College / University *
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="St. Xavier's Institute"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-electric-cyan"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  USN / Student ID (Optional)
                </label>
                <div className="relative">
                  <BadgeAlert className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="usn"
                    value={formData.usn}
                    onChange={handleChange}
                    placeholder="1NX22CS042"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-electric-cyan"
                  />
                </div>
              </div>
            </div>

            {/* Password and Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Create Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-electric-cyan"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-electric-cyan"
                  />
                </div>
              </div>
            </div>

            {/* Password Strength Meter */}
            {formData.password && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>Password Security:</span>
                  <span className="font-bold text-slate-200">{strength.label}</span>
                </div>
                <div className="w-full h-1.5 bg-navy-950 rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full flex-1 transition-all duration-300 ${
                        step <= strength.score ? strength.color : 'bg-slate-800'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl font-bold text-sm bg-gradient-to-r from-cobalt-600 to-cobalt-700 hover:from-cobalt-500 hover:to-cobalt-600 text-white shadow-glow-cobalt transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center text-xs text-slate-400 border-t border-cobalt-500/20 pt-4">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-electric-cyan hover:underline">
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
