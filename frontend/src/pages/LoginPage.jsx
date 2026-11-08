import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { authService } from '../services/authService';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in both email and password.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const userData = await login(email, password);
      showToast(`Welcome back, ${userData.name}!`, 'success');
      navigate(userData.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (error) {
      showToast(error.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast('Please enter your registered email address.', 'warning');
      return;
    }
    setForgotLoading(true);
    try {
      const res = await authService.forgotPassword(forgotEmail);
      showToast(res.message || 'Reset instructions sent!', 'info');
      setForgotModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Error processing request', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  // Quick fill helper for reviewers
  const handleQuickFill = (type) => {
    if (type === 'admin') {
      setEmail('admin@cobaltskies.com');
      setPassword('AdminPassword@2026');
    } else {
      setEmail('aarav@example.com');
      setPassword('Password@123');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cobalt-600/15 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
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
          <h2 className="text-2xl font-bold text-white font-display">Welcome Back</h2>
          <p className="text-xs text-slate-400">
            Sign in to access event registrations, e-tickets, and your fest profile
          </p>
        </div>

        {/* Login Glass Card */}
        <div className="p-8 rounded-3xl bg-navy-850/80 border border-cobalt-500/30 backdrop-blur-xl shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                College Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-electric-cyan"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[11px] text-cobalt-400 hover:text-electric-cyan transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-electric-cyan"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-navy-950 border-cobalt-500/40 text-cobalt-600 focus:ring-cobalt-500"
              />
              <label htmlFor="remember-me" className="ml-2 text-xs text-slate-300">
                Remember me on this browser
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cobalt-600 to-cobalt-700 hover:from-cobalt-500 hover:to-cobalt-600 text-white shadow-glow-cobalt transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Fill Credentials for Reviewers */}
          <div className="pt-2 border-t border-cobalt-500/20 text-center">
            <p className="text-[11px] font-mono text-slate-400 mb-2">Demo Quick-Fill Credentials:</p>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => handleQuickFill('student')}
                className="py-1.5 px-2 rounded-lg bg-navy-950 hover:bg-navy-900 border border-cobalt-500/30 text-cobalt-300 transition-colors"
              >
                👤 Student Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="py-1.5 px-2 rounded-lg bg-navy-950 hover:bg-navy-900 border border-amber-500/30 text-amber-300 transition-colors"
              >
                🛡️ Admin Console
              </button>
            </div>
          </div>

          {/* Signup link */}
          <div className="text-center text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-semibold text-electric-cyan hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-navy-850 border border-cobalt-500/30 p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-display">Reset Your Password</h3>
            <p className="text-xs text-slate-400">
              Enter the email associated with your registration and we'll send reset instructions.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-cobalt-500/30 text-white text-xs focus:outline-none focus:border-electric-cyan"
              />
              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-navy-950 border border-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 py-2 rounded-xl bg-cobalt-600 hover:bg-cobalt-500 text-white text-xs font-bold"
                >
                  {forgotLoading ? 'Submitting...' : 'Send Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
